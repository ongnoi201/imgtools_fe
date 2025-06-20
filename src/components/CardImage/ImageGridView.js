import React from 'react';
import './style.scss';

function ImageGridView({ images, onImageClick }) {
    return (
        <div className="picture-grid-view">
            {images.map((img, idx) => (
                <div className="picture-grid-item" key={img._id || img.id}>
                    <img
                        src={img.pictureUrl}
                        alt={img.puclicId}
                        className="picture-grid-img"
                        onClick={() => onImageClick(idx)}
                    />
                </div>
            ))}
        </div>
    );
}

export default ImageGridView;
