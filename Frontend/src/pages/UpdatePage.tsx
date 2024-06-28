import { RootState } from "../Redux/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Scenery } from "../models/Scenery";
import agent from "../api/agent";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Button, Grid, TextField, useTheme } from "@mui/material";
import compressImage from 'browser-image-compression';
import { ConvertByteToImageUrl } from "../tools/ConvertByteToImageUrl";

export default function UpdatePage() {
    const theme = useTheme();
    const { Id } = useParams<{ Id: string }>();
    const navigate = useNavigate();
    const userId = useSelector((state: RootState) => state.auth.userId);
    const [sceneryName, setSceneryName] = useState<string>('');
    const [country, setCountry] = useState<string>('');
    const [city, setCity] = useState<string>('');
    const [comment, setComment] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [image, setImage] = useState<string | undefined>(undefined);
    const [scenery, setScenery] = useState<Scenery | null>(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const token = useSelector((state: RootState) => state.auth.token);
    const MAX_FILE_SIZE_MB = 1;

    useEffect(() => {
        if (Id) {
            const fetchScenery = async () => {
                try {
                    const fetchedScenery = await agent.getSceneryById(Id);
                    setScenery(fetchedScenery);
                    const imageUrl = ConvertByteToImageUrl(fetchedScenery);
                    setImage(imageUrl);
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

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];

            if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                try {
                    const options = {
                        maxSizeMB: MAX_FILE_SIZE_MB,
                        maxWidthOrHeight: 1920,
                        useWebWorker: true,
                    };
                    const compressedFile = await compressImage(file, options);

                    setSelectedFile(compressedFile);
                    const imageUrl = URL.createObjectURL(compressedFile);
                    setImage(imageUrl);
                } catch (error) {
                    console.error('Image compression error: ', error);
                }
            } else {
                setSelectedFile(file);
                const imageUrl = URL.createObjectURL(file);
                setImage(imageUrl);
            }
        }
    };

    const handleUpdate = async () => {
        try {
            if (!scenery) {
                console.error("scenery data is missing");
                return;
            }

            const formData = new FormData();
            formData.append('SceneryName', sceneryName);
            formData.append('Country', country);

            if (city !== '') {
                formData.append('City', city);
            };

            if (selectedFile) {
                formData.append('ImageData', selectedFile);
            };

            if (comment !== '') {
                formData.append('Comment', comment);
            };

            formData.append('UserId', userId.toString());
            formData.append('SceneryId', scenery.sceneryId);

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                }
            };

            const response = await agent.updateScenery(formData, config);

            if (response.sceneryId) {
                setSnackbarMessage("Update successful!");
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
                    <Grid item xs={12}>
                        <img src={image} alt="scenery image" style={{ width: '40%' }} />
                    </Grid>
                    <Grid item xs={12} sx={{ mb: 5 }}>
                        <input type="file" onChange={handleFileChange} />
                    </Grid>

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
                                id="sceneryNameInput"
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
                                id="countryInput"
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
                                id="cityInput"
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
                                id="commentInput"
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