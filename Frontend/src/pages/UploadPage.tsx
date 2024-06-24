import { Button, Divider, Grid, TextField, useTheme } from "@mui/material";
import { useState } from "react";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import agent from "../api/agent";
import compressImage from 'browser-image-compression';

export default function UploadPage() {
    const theme = useTheme();
    const navigate = useNavigate();
    const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
    const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
    const [successSnackbarMessage, setSuccessSnackbarMessage] = useState('');
    const [errorSnackbarMessage, setErrorSnackbarMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [image, setImage] = useState<string | undefined>(undefined);
    const [sceneryName, setSceneryName] = useState<string>('');
    const [country, setCountry] = useState<string>('');
    const [city, setCity] = useState<string>('');
    const [comment, setComment] = useState<string>('');
    const userId = useSelector((state: RootState) => state.auth.userId);
    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
    const token = useSelector((state: RootState) => state.auth.token);
    const [sceneryNameTouched, setSceneryNameTouched] = useState(false);
    const [countryTouched, setCountryTouched] = useState(false);
    const MAX_FILE_SIZE_MB = 1;


    const handleCloseSuccessSnackbar = () => {
        setOpenSuccessSnackbar(false);
    };

    const handleCloseErrorSnackbar = () => {
        setOpenErrorSnackbar(false);
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

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!selectedFile) {
            console.error('No file selected.');
            return;
        }
        try {
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
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                }
            };
            const response = await agent.addScenery(formData, config);
            if (response.sceneryId) {
                setSuccessSnackbarMessage("Upload successful!");
                setOpenSuccessSnackbar(true);
                setSelectedFile(null);
                setImage(undefined);
                setSceneryName('');
                setCountry('');
                setCity('');
                setComment('');
                setCountryTouched(false);
                setSceneryNameTouched(false);
            } else {
                console.error('upload failed.');
                setErrorSnackbarMessage("Upload failed.");
                setOpenErrorSnackbar(true);
            }
        } catch (error: any) {
            console.error('Error uploading file:', error);
            setErrorSnackbarMessage("Upload error.");
            setOpenErrorSnackbar(true);
            if (error.response) {
                console.log('Detailed error response:', error.response);
                setErrorSnackbarMessage("Upload error.");
                setOpenErrorSnackbar(true);
            } else {
                console.log('Error details:', error.message);
            }
        }
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }

    return (
        <Grid container spacing={6} sx={{ mt: 10, ml: 20 }}>
            <form onSubmit={handleSubmit}>
                <Grid item xs={12}>
                    <img src={image} alt="scenery image" style={{ width: '40%' }} />
                </Grid>
                <Grid item xs={12}>
                    <input type="file" onChange={handleFileChange} />
                </Grid>
                <Divider sx={{ mb: 5 }} />
                <Grid item xs={12}>
                    <Grid container spacing={2}>

                        <Grid item xs={6}>
                            <TextField
                                variant='outlined'
                                type='string'
                                label='Scenery Name'
                                value={sceneryName}
                                onChange={(e) => {
                                    setSceneryName(e.target.value);
                                    setSceneryNameTouched(true);
                                }}
                                fullWidth
                                sx={{ mb: 5 }}
                            />
                            {sceneryNameTouched && !sceneryName && (
                                <p style={{ color: 'red' }}>Scenery Name can't be empty.</p>
                            )}
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                variant='outlined'
                                type='string'
                                label='Country'
                                value={country}
                                onChange={(e) => {
                                    setCountry(e.target.value);
                                    setCountryTouched(true);
                                }}
                                fullWidth
                                sx={{ mb: 5 }}
                            />
                            {countryTouched && !country && (
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
                                type="submit"
                                disabled={!sceneryName || !country}
                                sx={{
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '15px',
                                    backgroundColor: '#ffc107',
                                    border: '2px solid #ffc107',
                                    '&:hover': {
                                        backgroundColor: "#ff9800",
                                        color: theme.palette.success.contrastText,
                                        border: "2px solid #ff9800",
                                    }
                                }}>
                                Upload
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                onClick={() => navigate('/')}
                                sx={{
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '15px',
                                    backgroundColor: '#33ab9f',
                                    border: '2px solid #33ab9f',
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
                            <Snackbar open={openSuccessSnackbar} autoHideDuration={6000} onClose={handleCloseSuccessSnackbar}>
                                <MuiAlert onClose={handleCloseSuccessSnackbar} severity="success" sx={{ width: '100%', backgroundColor: theme.palette.success.main, color: 'white', fontWeight: 'bold' }}>
                                    {successSnackbarMessage}
                                </MuiAlert>
                            </Snackbar>
                        </Grid>
                        <Grid item xs={6}>
                            <Snackbar open={openErrorSnackbar} autoHideDuration={6000} onClose={handleCloseErrorSnackbar}>
                                <MuiAlert onClose={handleCloseErrorSnackbar} severity="error" sx={{ width: '100%', backgroundColor: theme.palette.error.main, color: 'white', fontWeight: 'bold' }}>
                                    {errorSnackbarMessage}
                                </MuiAlert>
                            </Snackbar>
                        </Grid>
                    </Grid>
                </Grid>
            </form>
        </Grid>
    );
}