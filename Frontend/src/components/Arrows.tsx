import React from 'react';

interface ArrowProps {
    style?: React.CSSProperties; 
    onClick?: () => void; 
}

const PrevArrow: React.FC<ArrowProps> = ({ style, onClick }) => (
    <div
        className="slick-prev"
        style={{ ...style, left: '0px', zIndex: 1 }}
        onClick={onClick} 
    />
);

const NextArrow: React.FC<ArrowProps> = ({ style, onClick }) => (
    <div
        className="slick-next"
        style={{ ...style, right: '0px', zIndex: 1 }}
        onClick={onClick} 
    />
);

export { PrevArrow, NextArrow };