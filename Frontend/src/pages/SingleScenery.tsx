import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, CircularProgress, Typography } from "@mui/material";
import { Scenery } from "../models/Scenery";
import { Link } from "react-router-dom";
import { useState } from "react";


interface Props {
    scenery: Scenery;
}

export default function SingleScenery({ scenery }: Props) {
    const [imageLoading, setImageLoading] = useState(true);

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
        <Card style={{ display: 'flex', flexDirection: 'column' }}>
            <CardHeader
                title={scenery.country}
                titleTypographyProps={{ 
                    sx: { fontWeight: 'bold', color: 'primary.main' }
                }}
            />
            <CardMedia style={{ position: 'relative', paddingTop: '56.25%' }}>
                {imageLoading && <CircularProgress style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />}
                <img
                    src={imageUrl}
                    alt={scenery.sceneryName}
                    onLoad={() => setImageLoading(false)}
                    style={{ display: imageLoading ? 'none' : 'block', width: '100%', height: '10vh', objectFit: 'cover' }}
                />
            </CardMedia>

            <CardContent style={{ height:'10vh' }}>
                <Typography gutterBottom color='secondary' variant="h5">
                    {scenery.sceneryName}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {scenery.city}
                </Typography>
            </CardContent>

            <CardActions>
                <Button component={Link} to={`/about/${scenery.sceneryId}`}>View</Button>
            </CardActions>
        </Card>
    )
}