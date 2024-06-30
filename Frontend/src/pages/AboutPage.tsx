import { Button, CircularProgress, Divider, Grid, Link, Typography, useTheme } from "@mui/material";
import agent from "../api/agent";
import { useEffect, useState } from "react";
import { Scenery } from "../models/Scenery";
import { useParams, useNavigate } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";

export default function AboutPage() {
    // State to manage the Snackbar visibility and message
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    // Get the scenery ID from the URL parameters
    const { Id } = useParams<{ Id: string }>();
    // State to store the scenery details
    const [scenery, setScenery] = useState<Scenery | null>(null);
    // Theme for styling
    const theme = useTheme();
    // Navigation hook
    const navigate = useNavigate();
    // Get user information from Redux store
    const userId = useSelector((state: RootState) => state.auth.userId);
    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
    const token = useSelector((state: RootState) => state.auth.token);
    // State to manage the collection status
    const [isCollected, setIsCollected] = useState(false);
    // State to manage the modal visibility
    const [openModal, setOpenModal] = useState(false);
    // State to manage loading status
    const [loading, setLoading] = useState(false);

    // Fetch the scenery details when the component mounts or dependencies change
    useEffect(() => {
        const fetchScenery = async () => {
            try {
                if (!Id) {
                    console.error('Scenery ID is empty or undefined.');
                    return;
                }
                setLoading(true);
                const fetchedScenery = await agent.getSceneryById(Id);
                setScenery(fetchedScenery);

                // Check if the scenery is already collected by the user
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                };
                const collectedCheck = await agent.getCollectionById(userId, Id, config);
                if (collectedCheck && collectedCheck.userId === userId) {
                    setIsCollected(true);
                } else {
                    setIsCollected(false);
                }
            } catch (error) {
                console.error('Error fetching scenery:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchScenery();
    }, [userId, Id, token])

    // Open and close handlers for the modal
    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    // Close handler for the Snackbar
    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    // Handle adding/removing scenery from the collection
    const handleCollect = async () => {
        try {
            if (!isLoggedIn) {
                console.error('User is not authenticated.');
                setSnackbarMessage("You need to login!");
                setOpenSnackbar(true);
                return;
            }
            if (!Id) {
                console.error('Scenery ID is empty or undefined.');
                return;
            }
            if (isCollected) {
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                };
                await agent.removeFromCollection(userId, Id, config);
                setIsCollected(false);
                setSnackbarMessage("Removed from your collection!");
            } else {
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                };
                await agent.addToCollection(userId, Id, config);
                setIsCollected(true);
                setSnackbarMessage("Added to your collection!");
            }
            setOpenSnackbar(true);
        } catch (error) {
            console.error('Error adding to collection from about page:', error);
        }
    }

    // Handle deleting the scenery
    const handleDelete = async () => {
        try {
            if (!isLoggedIn) {
                console.error('User is not authenticated.');
                setSnackbarMessage("you need to login!");
                setOpenSnackbar(true);
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            }

            if (userId !== scenery?.userId) {
                console.error('User is not authorized to delete this scenery.');
                setSnackbarMessage("You are not authorized to delete this scenery.");
                setOpenSnackbar(true);
                return;
            }

            if (!Id) {
                console.error('Scenery ID is empty or undefined.');
                return navigate('/sceneries');
            }

            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            };
            const response = await agent.deleteScenery(Id, config);
            if (response.status === 200) {
                setSnackbarMessage("Deleted successful!");
                setOpenSnackbar(true);
                console.log("delete successfully!");
            } else {
                console.error('delete failed.');
            }
            setTimeout(() => {
                navigate('/sceneries');
            }, 1000);
        } catch (error) {
            console.error('Error deleting scenery:', error);
        } finally {
            setOpenModal(false);
            setSnackbarMessage("Deleted successful!");
            setOpenSnackbar(true);
        }
    }

    // Render loading state if scenery ID or scenery details are not available
    if (!Id) {
        return <div>No scenery ID provided.</div>;
    }

    if (!scenery) {
        return (
            <div style={{ position: 'relative' }}>
                <Typography variant="h5" sx={{ textAlign: 'center' }}></Typography>
                {loading && (<CircularProgress
                    size={40}
                    style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                />
                )}
            </div>
        );
    };

    // Convert Base64 image data to a Blob and generate a URL for it
    const base64ImageData = scenery.imageData;
    const byteCharacters = atob(base64ImageData);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });
    const imageUrl = URL.createObjectURL(blob);

    return (
        <Grid container spacing={6} sx={{ mt: 15 }}>
            <Grid item xs={6}>
                <img src={imageUrl} alt={scenery.sceneryName} style={{ width: '100%' }} />
            </Grid>
            <Grid item xs={6}>
                <Typography variant='h3' sx={{ mb: 2 }} >{scenery.sceneryName}</Typography>
                <Typography variant='h4' color='success.main'>{scenery.country} - {scenery.city}</Typography>

                <Divider sx={{ mb: 5 }} />
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant='h5' color='info.main'>Uploader Comment:</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant='h5' color='text.secondary'>{scenery.comment}</Typography>
                    </Grid>
                </Grid>
                <Divider sx={{ mb: 3 }} />

                {/* Snackbar for notifications */}
                <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                    <MuiAlert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </MuiAlert>
                </Snackbar>

                {!isLoggedIn && (
                    <Typography variant="body1" color="#3f51b5" paragraph>
                        log in to enable below operations
                    </Typography>
                )}
                <br />
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        {/* Collect/Collected button */}
                        <Button component={Link} disabled={!isLoggedIn} data-testid="collect-button"
                            onClick={handleCollect} sx={{
                            color: 'white', backgroundColor: '#a2cf6e', fontWeight: 'bold', fontSize: '15px',
                            border: "2px solid #a2cf6e",
                            '&:hover': {
                                backgroundColor: "#4caf50",
                                color: theme.palette.success.contrastText,
                                border: "2px solid #4caf50",
                            }
                        }}>{isCollected ? 'Collected' : 'Collect'}</Button>
                    </Grid>
                    <Grid item xs={6}>
                        {/* Return button */}
                        <Button
                            onClick={() => navigate("/sceneries")}
                            sx={{
                                color: 'white',
                                backgroundColor: '#33ab9f',
                                fontWeight: 'bold',
                                fontSize: '15px',
                                border: "2px solid #33ab9f",
                                '&:hover': {
                                    backgroundColor: "#00695f",
                                    color: theme.palette.success.contrastText,
                                    border: "2px solid #00695f",
                                }
                            }}>
                            Return
                        </Button>
                    </Grid>
                </Grid>
                <br />
                {!isLoggedIn || userId !== scenery.userId && (
                    <Typography variant="body1" color="#009688" paragraph>
                        only uploader can update or delete the scenery
                    </Typography>
                )}
                <br />
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        {/* Update button */}
                        <Button component={Link} disabled={!isLoggedIn || userId !== scenery.userId}
                            data-testid="update-button" onClick={() => navigate(`/update/${Id}`)} sx={{
                            color: "white", backgroundColor: "#ffc107", fontWeight: 'bold', fontSize: '15px',
                            border: "2px solid #ffc107",
                            '&:hover': {
                                backgroundColor: "#ff9800",
                                color: theme.palette.success.contrastText,
                                border: "2px solid #ff9800",
                            }
                        }}>Update</Button>
                    </Grid>

                    <Grid item xs={6}>
                        {/* Delete button */}
                        <Button onClick={handleOpenModal} disabled={!isLoggedIn || userId !== scenery.userId} sx={{
                            color: theme.palette.error.contrastText, backgroundColor: "#f6685e", fontWeight: 'bold', fontSize: '15px',
                            border: "2px solid #f6685e",
                            '&:hover': {
                                backgroundColor: theme.palette.error.main,
                                color: theme.palette.error.contrastText,
                                border: `2px solid ${theme.palette.error.main}`,
                            }
                        }}>Delete</Button>
                        {/* Delete confirmation modal */}
                        <DeleteConfirmationModal
                            open={openModal}
                            onClose={handleCloseModal}
                            onConfirmDelete={handleDelete}
                        />
                    </Grid>
                    <Divider sx={{ mt: 5 }} />
                </Grid>
            </Grid>
        </Grid>
    )
}