import { Button, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";


export default function ErrorPage() {
    const navigate = useNavigate();

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
                <Typography variant="h1" color="primary" gutterBottom>
                    404
                </Typography>
                <Typography variant="h4" color="textSecondary" sx={{mb:10}}>
                    Oops! Page not found.
                </Typography>
                <Button variant="contained" color="primary" onClick={handleGoBack}>
                    Go Back
                </Button>
            </Grid>
        </Grid>
    );
};