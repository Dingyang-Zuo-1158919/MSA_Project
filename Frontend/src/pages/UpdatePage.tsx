import { RootState } from "../Redux/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Scenery } from "../models/Scenery";
import agent from "../api/agent";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Button, Grid, TextField, useTheme } from "@mui/material";

export default function UpdatePage() {
    const theme = useTheme();
    const { Id } = useParams<{ Id: string }>();
    const navigate = useNavigate();
    const userId = useSelector((state: RootState) => state.auth.userId);
    const [sceneryName, setSceneryName] = useState<string>('');
    const [country, setCountry] = useState<string>('');
    const [city, setCity] = useState<string>('');
    const [comment, setComment] = useState<string>('');
    const [scenery, setScenery] = useState<Scenery | null>(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const token = useSelector((state: RootState) => state.auth.token);

    useEffect(() => {
        if (Id) {
            const fetchScenery = async () => {
                try {
                    const fetchedScenery = await agent.getSceneryById(Id);
                    setScenery(fetchedScenery);
                    setSceneryName(fetchedScenery.sceneryName);
                    setCountry(fetchedScenery.country);
                    setCity(fetchedScenery.city ?? "");
                    setComment(fetchedScenery.comment ?? "");
                } catch (error) {
                    console.error('Error fetching scenery:', error);
                }
            };
            fetchScenery();
        } else {
            console.error('Scenery Id is empty or undefined.');
            navigate(`/about/${scenery?.sceneryId}`);
        }
    }, [Id, navigate]);

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleUpdate = async () => {
        try {
            if (!scenery) {
                console.error("scenery data is missing");
                return;
            }

            const updatedScenery = {
                sceneryId: scenery.sceneryId,
                sceneryName,
                country,
                city,
                comment,
                userId: scenery.userId,
                imageData: scenery.imageData,
            };

            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            };

            const response = await agent.updateScenery(updatedScenery, config);

            if (response.sceneryId) {
                setSnackbarMessage("Upload successful!");
                setOpenSnackbar(true);
                setTimeout(() => {
                    navigate(`/about/${scenery.sceneryId}`);
                }, 1000);
            } else {
                setSnackbarMessage("No empty Scenery name or Country");
                setOpenSnackbar(true);
            }
        } catch (error) {
            console.error("Error updating scenery:", error);
            setSnackbarMessage("Error updating scenery");
            setOpenSnackbar(true);
        }
    };

    if (!scenery) {
        return <div>Loading...</div>
    }

    if (scenery.userId !== userId) {
        setSnackbarMessage("User can only update sceneries uploaded by the user");
        setOpenSnackbar(true);
        return <div>Unauthorized: You are not allowed to update this scenery.</div>
    }

    return (
        <Grid container justifyContent="center" spacing={2} sx={{ mt: 10 }}>
            <form onSubmit={(e) => e.preventDefault()}>
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                variant='outlined'
                                type='string'
                                label='Scenery Name'
                                required
                                value={sceneryName}
                                onChange={(e) => setSceneryName(e.target.value)}
                                fullWidth
                                sx={{ mb: 5 }}
                            />
                            {!sceneryName && (
                                <p style={{ color: 'red' }}>Scenery Name can't be empty.</p>
                            )}
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                variant='outlined'
                                type='string'
                                label='Country'
                                required
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                fullWidth
                                sx={{ mb: 5 }}
                            />
                            {!country && (
                                <p style={{ color: 'red' }}>Country can't be empty.</p>
                            )}
                        </Grid>

                        <Grid item xs={6}>
                            <TextField
                                variant='outlined'
                                type='string'
                                label='City'
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                fullWidth
                                sx={{ mb: 5 }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                variant='outlined'
                                type='string'
                                label='Comment'
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                fullWidth
                                sx={{ mb: 5 }}
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Button
                                type="button"
                                disabled={!sceneryName || !country}
                                onClick={handleUpdate}
                                sx={{
                                    color: 'white',
                                    backgroundColor: "#ffc107",
                                    fontWeight: 'bold',
                                    fontSize: '15px',
                                    border: "2px solid #ffc107",
                                    '&:hover': {
                                        backgroundColor: "#ff9800",
                                        color: theme.palette.success.contrastText,
                                        border: "2px solid #ff9800",
                                    }
                                }}>
                                Save
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                onClick={() => navigate(`/about/${scenery.sceneryId}`)}
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

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                                <MuiAlert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                                    {snackbarMessage}
                                </MuiAlert>
                            </Snackbar>
                        </Grid>
                    </Grid>
                </Grid>
            </form>
        </Grid>
    )
}