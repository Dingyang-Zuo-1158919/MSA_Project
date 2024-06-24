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
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const { Id } = useParams<{ Id: string }>();
    const [scenery, setScenery] = useState<Scenery | null>(null);
    const theme = useTheme();
    const navigate = useNavigate();
    const userId = useSelector((state: RootState) => state.auth.userId);
    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
    const [isCollected, setIsCollected] = useState(false);
    const token = useSelector((state: RootState) => state.auth.token);
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);

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

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

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

    // convert Base64
    const base64ImageData = scenery.imageData;
    const byteCharacters = atob(base64ImageData);

    // transfer to Uint8Array
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // generate Blob object
    const blob = new Blob([byteArray], { type: 'image/jpeg' }); // 这里的type要根据实际情况设置

    // generate URL
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
                        <Button component={Link} disabled={!isLoggedIn} onClick={handleCollect} sx={{
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
                        <Button component={Link} disabled={!isLoggedIn || userId !== scenery.userId} onClick={() => navigate(`/update/${Id}`)} sx={{
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
                        <Button onClick={handleOpenModal} disabled={!isLoggedIn || userId !== scenery.userId} sx={{
                            color: theme.palette.error.contrastText, backgroundColor: "#f6685e", fontWeight: 'bold', fontSize: '15px',
                            border: "2px solid #f6685e",
                            '&:hover': {
                                backgroundColor: theme.palette.error.main,
                                color: theme.palette.error.contrastText,
                                border: `2px solid ${theme.palette.error.main}`,
                            }
                        }}>Delete</Button>
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