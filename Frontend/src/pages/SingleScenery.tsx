import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, CircularProgress, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Scenery } from "../models/Scenery";
import { Link } from "react-router-dom";
import { useState } from "react";
import { ConvertByteToImageUrl } from "../tools/ConvertByteToImageUrl";

interface Props {
    scenery: Scenery;
}

export default function SingleScenery({ scenery }: Props) {
    // Responsive styling
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isPad = useMediaQuery(theme.breakpoints.down('md'));
    // State to manage image loading state
    const [imageLoading, setImageLoading] = useState(true);
    // Convert scenery byte data from backend to image URL
    const imageUrl = ConvertByteToImageUrl(scenery);

    return (
        <Card style={{ display: 'flex', flexDirection: 'column' }} className="single-scenery">
            {/* Scenery header with country name */}
            <CardHeader
                title={scenery.country}
                className="scenery-country"
                titleTypographyProps={{
                    sx: { fontWeight: 'bold', color: 'primary.main' }
                }}
                sx={isMobile ? { marginBottom: '-250px' } : isPad ? {marginBottom: '-80px'} : {marginBottom: '-110px'}}
            />
            {/* Scenery media section with loading indicator */}
            <CardMedia style={{ position: 'relative', paddingTop: '56.25%' }}>
                {imageLoading && <CircularProgress style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />}
                <img
                    src={imageUrl}
                    alt={scenery.sceneryName}
                    onLoad={() => setImageLoading(false)}
                    style={{ display: imageLoading ? 'none' : 'block', width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </CardMedia>
            {/* Scenery content with scenery name and city */}
            <CardContent style={{ height: '10vh' }}>
                <Typography gutterBottom color='secondary' variant="h5" className="scenery-name">
                    {scenery.sceneryName}
                </Typography>
                <Typography variant="body1" color="text.secondary" className="scenery-city">
                    {scenery.city}
                </Typography>
            </CardContent>
            {/* Actions section with a button to view details */}
            <CardActions>
                <Button component={Link} to={`/about/${scenery.sceneryId}`}>View</Button>
            </CardActions>
        </Card>
    )
}