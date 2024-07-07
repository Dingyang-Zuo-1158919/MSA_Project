import { RootState } from "../Redux/store";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Scenery } from "../models/Scenery";
import agent from "../api/agent";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Button, CircularProgress, Grid, IconButton, MenuItem, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Delete as DeleteIcon } from '@mui/icons-material';
import compressImage from 'browser-image-compression';
import { ConvertByteToImageUrl } from "../tools/ConvertByteToImageUrl";

export default function UpdatePage() {
    // Responsive styling
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    // Get the scenery ID from the URL parameters
    const { Id } = useParams<{ Id: string }>();
    // Navigation hook
    const navigate = useNavigate();
    // Get user information from Redux store
    const userId = useSelector((state: RootState) => state.auth.userId);
    const token = useSelector((state: RootState) => state.auth.token);
    // State variables
    const [sceneryName, setSceneryName] = useState<string>('');
    const [country, setCountry] = useState<string>('');
    const [city, setCity] = useState<string>('');
    const [comment, setComment] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [image, setImage] = useState<string | undefined>(undefined);
    const [scenery, setScenery] = useState<Scenery | null>(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [countries, setCountries] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    // Maximum image file size allowed in MB
    const MAX_FILE_SIZE_MB = 1;
    // Ref for file input
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch scenery data and countries list on component mount or when ID changes
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
    }, [Id, navigate]);

    // Close snackbar handler
    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    // Handle file input change (including image compression if needed)
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];

            // Validate file type
            if (!file.type.match('image/jpeg')) {
                console.error('Only JPEG files are allowed.');
                setSnackbarMessage("Only JPEG files are allowed.");
                setOpenSnackbar(true);
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

    // Handle scenery update
    const handleUpdate = async () => {
        try {
            setIsLoading(true);

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
            // Configure headers with authorization token
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                }
            };
            // Make API call to update scenery
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
        } finally {
            setIsLoading(false);
        }
    };

    // Handle image deletion
    const handleDeleteImage = () => {
        setSelectedFile(null);
        setImage(undefined);
        // Reset file input field
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    if (!scenery) {
        return <CircularProgress style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
    }

    // Handle unauthorized access if user is not the uploader of the scenery
    if (scenery.userId !== userId) {
        setSnackbarMessage("User can only update sceneries uploaded by the user");
        setOpenSnackbar(true);
        return <div>Unauthorized: You are not allowed to update this scenery.</div>
    }

    return (
        <Grid container justifyContent="center" spacing={2} sx={{ mt: 10 }}>
            {/* Form submission handling */}
            <form onSubmit={(e) => e.preventDefault()}>
                <Grid item xs={12}>
                    {/* Displaying the selected image */}
                    <Grid item xs={12}>
                        {image && (
                            <>
                                <img src={image} alt="scenery image" style={{ width: '40%' }} />
                                <IconButton onClick={handleDeleteImage} sx={{ position: 'relative', ml: '8px',  mb: '8px', backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
                                    <DeleteIcon />
                                </IconButton>
                            </>
                        )}
                    </Grid>
                    {/* Input for selecting an image file */}
                    <Grid item xs={12} sx={{ mb: 5 }}>
                        <input type="file" accept="image/jpeg" onChange={handleFileChange} />
                        {/* Validation message if file is empty */}
                        {selectedFile === null && (
                            <Typography variant="body2" sx={{ color: 'blue', mt: 1 }}>Select a JPEG image for updating if necessary.</Typography>
                        )}
                    </Grid>

                    <Grid container spacing={2} direction={isMobile ? 'column' : 'row'}>
                        {/* Text field for scenery name */}
                        <Grid item xs={12} sm={6}>
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
                            {/* Validation message if scenery name is empty */}
                            {!sceneryName && (
                                <p style={{ color: 'red' }}>Scenery Name can't be empty.</p>
                            )}
                        </Grid>
                        {/* Dropdown for selecting country */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant='outlined'
                                type='string'
                                label='Country'
                                select
                                required
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
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
                            {/* Validation message if country is empty */}
                            {!country && (
                                <p style={{ color: 'red' }}>Country can't be empty.</p>
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

                    {/* Buttons for saving and returning */}
                    <Grid container spacing={2} direction={isMobile ? 'column' : 'row'}>
                        <Grid item xs={12} sm={6}>
                            {/* Save button */}
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
                                    },
                                    width: isMobile ? '100%' : 'auto',
                                }}>
                                Save
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            {/* Return button */}
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
                                    },
                                    width: isMobile ? '100%' : 'auto',
                                }}>
                                Return
                            </Button>
                        </Grid>
                    </Grid>

                    {/* Snackbar for displaying success message */}
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                                <MuiAlert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                                    {snackbarMessage}
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
                </Grid>
            </form>
        </Grid>
    )
}