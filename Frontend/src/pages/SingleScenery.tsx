import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, CircularProgress, Typography } from "@mui/material";
import { Scenery } from "../models/Scenery";
import { renderImageDataToImageUrl } from "../tools/RenderImageData";
import { Link } from "react-router-dom";
import { useState } from "react";


interface Props {
    scenery: Scenery;
}

export default function SingleScenery({ scenery }: Props) {
    const [imageLoading, setImageLoading] = useState(true);
    const image = renderImageDataToImageUrl(scenery.imageData);

    return (
        <Card>
            <CardHeader
                title={scenery.country}
                titleTypographyProps={{
                    sx: { fontWeight: 'bold', color: 'primary.main' }
                }}
            />
            <CardMedia style={{ position: 'relative', paddingTop: '56.25%' }}>
                {imageLoading && <CircularProgress style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />}
                <img
                    src={image}
                    alt={scenery.sceneryName}
                    onLoad={() => setImageLoading(false)}
                    style={{ display: imageLoading ? 'none' : 'block', width: '100%' }}
                />
            </CardMedia>

            <CardContent>
                <Typography gutterBottom color='secondary' variant="h4">
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