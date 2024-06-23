import { Button, Divider, Grid, TextField, useTheme } from "@mui/material";
import { useState } from "react";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import agent from "../api/agent";

export default function UploadPage() {
    const theme = useTheme();
    const navigate = useNavigate();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
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


    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            setSelectedFile(file);
            const imageUrl = URL.createObjectURL(file);
            setImage(imageUrl);
        }
    };

    const fileToUint8Array = (file: File): Promise<Uint8Array> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result instanceof ArrayBuffer) {
                    const arrayBuffer = reader.result;
                    const uint8Array = new Uint8Array(arrayBuffer);
                    resolve(uint8Array);
                } else {
                    reject(new Error('Failed to read file as ArrayBuffer.'));
                }
            };
            reader.onerror = (error) => {
                reject(error);
            };
            reader.readAsArrayBuffer(file);
        });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // if (!selectedFile) {
        //     console.error('No file selected.');
        //     return;
        // }
        try {
            const formData = new FormData();
            formData.append('sceneryName', sceneryName);
            formData.append('country', country);

            if (city !== '') {
                formData.append('City', city);
            };

            if (selectedFile) {
                const byteArr = await fileToUint8Array(selectedFile);
                formData.append('ImageData', new Blob([byteArr], { type: selectedFile.type }));
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
                setSnackbarMessage("Upload successful!");
                setOpenSnackbar(true);
                setSelectedFile(null);
                setImage(undefined);
                setSceneryName('');
                setCountry('');
                setCity('');
                setComment('');
            } else {
                console.error('upload failed.');
            }
        } catch (error: any) {
            console.error('Error uploading file:', error);
            console.log('Detailed error response:', error.response);
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

                    <Divider sx={{ mb: 10 }} />

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
                                onClick={() => navigate('/homepage')}
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
    );
}