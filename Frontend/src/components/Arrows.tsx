import React from 'react';

export interface ArrowProps {
    // Custom style for the arrow
    style?: React.CSSProperties; 
    // Click handler for the arrow
    onClick?: () => void; 
}

// Previous arrow component for slider
const PrevArrow: React.FC<ArrowProps> = ({ style, onClick }) => (
    <div
        className="slick-prev"
        style={{ ...style, left: '0px', zIndex: 1 }}
        onClick={onClick} 
    />
);

// Next arrow component for slider
const NextArrow: React.FC<ArrowProps> = ({ style, onClick }) => (
    <div
        className="slick-next"
        style={{ ...style, right: '0px', zIndex: 1 }}
        onClick={onClick} 
    />
);

// Export both arrow components
export { PrevArrow, NextArrow };