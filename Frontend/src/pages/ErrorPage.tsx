import { Button, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";


export default function ErrorPage() {
    // Hook for navigation
    const navigate = useNavigate();
    // Handler for the "Go Back" button click event
    const handleGoBack = () => {
        navigate('/homepage')
    };

    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: '50vh' }}
        >
            <Grid item justifyContent="center">
                {/* Display the error code */}
                <Typography variant="h1" color="primary" gutterBottom>
                    404
                </Typography>
                {/* Display the error message */}
                <Typography variant="h4" color="textSecondary" sx={{mb:10}}>
                    Oops! Page not found.
                </Typography>
                {/* Button to navigate back to the homepage */}
                <Button variant="contained" color="primary" onClick={handleGoBack}>
                    Go Back
                </Button>
            </Grid>
        </Grid>
    );
};