import { Button, CircularProgress, Grid, IconButton, MenuItem, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useEffect, useRef, useState } from "react";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import agent from "../api/agent";
import compressImage from 'browser-image-compression';

export default function UploadPage() {
    // Responsive styling
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    // Navigation hook
    const navigate = useNavigate();
    // Get user information from Redux store
    const userId = useSelector((state: RootState) => state.auth.userId);
    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
    const token = useSelector((state: RootState) => state.auth.token);
    // State variables
    const [countries, setCountries] = useState<string[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<string>('');
    const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
    const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
    const [successSnackbarMessage, setSuccessSnackbarMessage] = useState('');
    const [errorSnackbarMessage, setErrorSnackbarMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [image, setImage] = useState<string | undefined>(undefined);
    const [sceneryName, setSceneryName] = useState<string>('');
    const [city, setCity] = useState<string>('');
    const [comment, setComment] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    // State to track if fields have been touched for validation
    const [sceneryNameTouched, setSceneryNameTouched] = useState(false);
    const [countryTouched, setCountryTouched] = useState(false);
    // Maximum image file size allowed in MB
    const MAX_FILE_SIZE_MB = 1;
    // Ref for file input
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Fetch countries list for user to select from Rest Countries API
        const fetchCountries = async () => {
            try {
                const response = await fetch('https://restcountries.com/v3.1/independent?status=true');
                if (!response.ok) {
                    throw new Error('Failed to fetch countries data');
                }
                const data = await response.json();

                const fetchedCountries = data.map((country: any) => country.name.common);
                setCountries(fetchedCountries);
            } catch (error) {
                console.error('Error fetching countries data', error);
            }
        };
        fetchCountries();
    }, []);

    // Closing success snackbar
    const handleCloseSuccessSnackbar = () => {
        setOpenSuccessSnackbar(false);
    };

    // Closing error snackbar
    const handleCloseErrorSnackbar = () => {
        setOpenErrorSnackbar(false);
    };

    // Handle file input change (including image compression if needed)
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];

            // Validate file type
            if (!file.type.match('image/jpeg')) {
                console.error('Only JPEG files are allowed.');
                setErrorSnackbarMessage("Only JPEG files are allowed.");
                setOpenErrorSnackbar(true);
                return;
            }

            //Compress image if oversize
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

    // Handle scenery upload
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Set loading state to true to show CircularProgress
        setIsLoading(true);

        if (!selectedFile) {
            console.error('No file selected.');
            setErrorSnackbarMessage("No scenery image uploaded.");
            setOpenErrorSnackbar(true);
            return;
        }
        try {
            const formData = new FormData();
            formData.append('SceneryName', sceneryName);
            formData.append('Country', selectedCountry);

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
            // Configure headers with authorization token
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                }
            };
            // Make API call to add scenery
            const response = await agent.addScenery(formData, config);
            if (response.sceneryId) {
                setSuccessSnackbarMessage("Upload successful!");
                setOpenSuccessSnackbar(true);
                // Clear form fields and state
                setSelectedFile(null);
                setImage(undefined);
                setSceneryName('');
                setSelectedCountry('');
                setCity('');
                setComment('');
                setCountryTouched(false);
                setSceneryNameTouched(false);
                setTimeout(() => {
                    navigate(`/about/${response.sceneryId}`);
                }, 1000);
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
        } finally {
            setIsLoading(false);
        }
    }

    // Handle image deletion
    const handleDeleteImage = () => {
        setSelectedFile(null);
        setImage(undefined);
        // Reset file input field
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Redirect to login page if not logged in
    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }

    return (
        <Grid container justifyContent="center" spacing={2} sx={{ mt: 10 }}>
            {/* Form submission handling */}
            <Grid item xs={12}>
                <form onSubmit={handleSubmit}>
                    {/* Displaying the selected image */}
                    <Grid item xs={12}>
                        {image && (
                            <>
                                <img src={image} alt="scenery image" style={{ width: '50%', maxWidth: '100%' }} />
                                <IconButton onClick={handleDeleteImage} sx={{ position: 'relative', mb: '8px', backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
                                    <DeleteIcon />
                                </IconButton>
                            </>
                        )}
                    </Grid>
                    {/* Input for selecting an image file */}
                    <Grid item xs={12} sx={{ mb: 5 }}>
                        <input ref={fileInputRef} type="file" required accept="image/jpeg" onChange={handleFileChange} />
                        {/* Validation message if file is empty */}
                        {selectedFile === null && (
                            <Typography variant="body2" sx={{ color: 'blue', mt: 1 }}>Please select a JPEG image for uploading.</Typography>
                        )}
                    </Grid>

                    <Grid container spacing={2} direction={isMobile ? 'column' : 'row'}>
                        {/* Text field for scenery name */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant='outlined'
                                required
                                type='string'
                                label='Scenery Name'
                                value={sceneryName}
                                onChange={(e) => {
                                    setSceneryName(e.target.value);
                                    setSceneryNameTouched(true);
                                }}
                                fullWidth
                                sx={{ mb: 5 }}
                                id="sceneryNameInput"
                            />
                            {/* Validation message if scenery name is empty after handling */}
                            {sceneryNameTouched && !sceneryName && (
                                <Typography variant="body2" sx={{ color: 'red' }}>Scenery Name can't be empty.</Typography>
                            )}
                        </Grid>
                        {/* Dropdown for selecting country */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant='outlined'
                                select
                                required
                                label='Country'
                                value={selectedCountry}
                                onChange={(e) => {
                                    setSelectedCountry(e.target.value);
                                    setCountryTouched(true);
                                }}
                                fullWidth
                                sx={{ mb: 5 }}
                                id="countryInput"
                            >
                                {/* Mapping countries to options */}
                                {countries.map((country) => (
                                    <MenuItem key={country} value={country}>
                                        {country}
                                    </MenuItem>
                                ))}
                            </TextField>
                            {/* Validation message if country is empty after handling */}
                            {countryTouched && !selectedCountry && (
                                <Typography variant="body2" sx={{ color: 'red' }}>Country can't be empty.</Typography>
                            )}
                        </Grid>

                        <Grid item xs={12} sm={6}>
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
                        <Grid item xs={12} sm={6}>
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
                    {/* Buttons for uploading and returning */}
                    <Grid container spacing={2} direction={isMobile ? 'column' : 'row'}>
                        <Grid item xs={12} sm={6}>
                            {/* Upload button */}
                            <Button
                                type="submit"
                                disabled={!sceneryName || !selectedCountry || !selectedFile}
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
                                    },
                                    width: isMobile ? '100%' : 'auto',
                                }}>
                                Upload
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            {/* Return button */}
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
                                    },
                                    width: isMobile ? '100%' : 'auto',
                                }}>
                                Return
                            </Button>
                        </Grid>
                    </Grid>



                    {/* Snackbar for displaying success message */}
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Snackbar open={openSuccessSnackbar} autoHideDuration={6000} onClose={handleCloseSuccessSnackbar}>
                                <MuiAlert onClose={handleCloseSuccessSnackbar} severity="success" sx={{ width: '100%', backgroundColor: theme.palette.success.main, color: 'white', fontWeight: 'bold' }}>
                                    {successSnackbarMessage}
                                </MuiAlert>
                            </Snackbar>
                        </Grid>
                        {/* Snackbar for displaying error message */}
                        <Grid item xs={12}>
                            <Snackbar open={openErrorSnackbar} autoHideDuration={6000} onClose={handleCloseErrorSnackbar}>
                                <MuiAlert onClose={handleCloseErrorSnackbar} severity="error" sx={{ width: '100%', backgroundColor: theme.palette.error.main, color: 'white', fontWeight: 'bold' }}>
                                    {errorSnackbarMessage}
                                </MuiAlert>
                            </Snackbar>
                        </Grid>
                    </Grid>
                    {/* Circular Progress for loading indicator */}
                    {isLoading && (
                        <Grid item xs={12}>
                            <CircularProgress style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                        </Grid>
                    )}
                </form>
            </Grid >
        </Grid >
    );
}