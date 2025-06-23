import React from 'react';
import './style.scss';

function ImageListView({ images, onImageClick }) {
    return (
        <div className="picture-list-view">
            {images.map((img, idx) => (
                <div className="picture-list-item animate__animated animate__zoomIn" key={img._id || img.id}>
                    <img
                        src={img.pictureUrl}
                        alt={img.puclicId}
                        className="picture-list-img"
                        onClick={() => onImageClick(idx)}
                    />
                </div>
            ))}
        </div>
    );
}

export default ImageListView;
