import { Box, Typography } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import { PrevArrow, NextArrow } from '../components/Arrows';

export default function HomePage() {

    const settings = {
        dots: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />,
    };

    return (
        <>
            <Slider {...settings}>
                <div>
                    <img src='/assets/1.jpg' alt="hamilton" style={{ display: 'block', width: '100%', maxHeight: 800 }} />
                </div>
                <div>
                    <img src='/assets/2.jpg' alt="nikkou" style={{ display: 'block', width: '100%', maxHeight: 800 }} />
                </div>
                <div>
                    <img src='/assets/3.jpg' alt="tekapo" style={{ display: 'block', width: '100%', maxHeight: 800 }} />
                </div>
                <div>
                    <img src='/assets/4.jpg' alt="nhatrang" style={{ display: 'block', width: '100%', maxHeight: 800 }} />
                </div>
                <div>
                    <img src='/assets/5.jpg' alt="kagoshima" style={{ display: 'block', width: '100%', maxHeight: 800 }} />
                </div>
            </Slider>
            <Box display='flex' justifyContent='center' sx={{ p: 4 }}>
                <Typography variant='h2'>
                    Welcome to share your sceneries!
                </Typography>
            </Box>
            <Box display='flex' justifyContent='center' sx={{ p: 4 }}>
                <Link to="/sceneries" style={{ textDecoration: 'none', color: '#007bff', fontSize: '1.2rem' }}>
                    {"Click to enjoy more!"}
                </Link>
            </Box>
        </>
    )
}
