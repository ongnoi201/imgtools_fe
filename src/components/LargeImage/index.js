import React, { useState } from 'react';
import './style.scss';
import { editUser } from '@services/userService';
import Message from '@components/Message';
import { updateFavoriteStatus } from '@services/pictureService';

export default function LargeImage({
    images = [],
    currentIndex = 0,
    onClose,
    onDelete,
    token,
    onAvatarChange,
    onAvatarFrameChange
}) {
    const [showHeaderFooter, setShowHeaderFooter] = useState(true);
    const [index, setIndex] = useState(currentIndex);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showMoreModal, setShowMoreModal] = useState(false);
    const [updating, setUpdating] = useState(false);
    const slideInterval = React.useRef(null);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');
    // Thêm state để trigger re-render khi favorite thay đổi
    const [favoriteLoading, setFavoriteLoading] = useState(false);

    // Thêm state cho touch
    const touchStartX = React.useRef(null);
    const touchEndX = React.useRef(null);

    const handleToggleHeaderFooter = () => {
        setShowHeaderFooter((prev) => !prev);
    };

    const handlePrev = () => {
        setIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    };

    const handleNext = () => {
        setIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    };

    const handlePlay = () => {
        if (isPlaying) {
            clearInterval(slideInterval.current);
            setIsPlaying(false);
        } else {
            setIsPlaying(true);
            slideInterval.current = setInterval(() => {
                setIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
            }, 2000);
        }
    };

    React.useEffect(() => {
        return () => {
            clearInterval(slideInterval.current);
        };
    }, []);

    const handleDelete = () => {
        if (onDelete) onDelete(index);
    };

    // Xử lý bắt đầu chạm
    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    // Xử lý khi di chuyển ngón tay
    const handleTouchMove = (e) => {
        touchEndX.current = e.touches[0].clientX;
    };

    // Xử lý khi kết thúc chạm
    const handleTouchEnd = () => {
        if (touchStartX.current !== null && touchEndX.current !== null) {
            const diff = touchEndX.current - touchStartX.current;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    handlePrev();
                } else {
                    handleNext();
                }
            }
        }
        touchStartX.current = null;
        touchEndX.current = null;
    };

    // Đặt làm avatar
    const handleSetAvatar = async (img) => {
        setMessage('');
        if (!token || !img) return;
        setUpdating(true);
        try {
            const res = await editUser({ avatar: img.url }, token);
            if (res && res.status === 'success') {
                setMessage(res.message || 'Cập nhật avatar thành công');
                setMessageType('success');
                if (onAvatarChange) onAvatarChange(img.url);
            }else {
                setMessage(res.message || 'Cập nhật avatar thất bại');
                setMessageType('error');
            }
        } catch (e) {}
        setUpdating(false);
    };

    // Đặt làm avatar_frame
    const handleSetAvatarFrame = async (img) => {
        setMessage('');
        if (!token || !img) return;
        setUpdating(true);
        try {
            const res = await editUser({ avatar_frame: img.url }, token);
            if (res && res.status === 'success') {
                setMessage(res.message || 'Cập nhật khung nền thành công');
                setMessageType('success');
                if (onAvatarFrameChange) onAvatarFrameChange(img.url);
            }else {
                setMessage(res.message || 'Cập nhật khung nền thất bại');
                setMessageType('error');
            }
        } catch (e) {}
        setUpdating(false);
    };

    const handleToggleFavorite = async () => {
        setMessage('');
        if (!images[index] || !token) return;
        setFavoriteLoading(true);
        const img = images[index];
        const newFavorite = img.favorite === 1 ? 0 : 1;
        try {
            const res = await updateFavoriteStatus(img._id || img.id, newFavorite, token);
            if (res && res.status === 'success') {
                img.favorite = newFavorite;
                setMessage(newFavorite === 1 ? 'Đã thêm vào yêu thích' : 'Đã bỏ khỏi yêu thích');
                setMessageType('success');
                setIndex(i => i);
            } else {
                setMessage(res.message || 'Cập nhật yêu thích thất bại');
                setMessageType('error');
            }
        } catch (e) {
            setMessage('Có lỗi xảy ra');
            setMessageType('error');
        }
        setFavoriteLoading(false);
    };

    return (
        <div className={`large-image-container${showHeaderFooter ? ' show-header-footer' : ''} animate__animated animate__zoomIn`}>
            {showHeaderFooter && (
                <div className="large-image-header" onClick={()=>setShowMoreModal(false)}>
                    <button className="btn text-dark" onClick={onClose}>
                        <i className="bi bi-arrow-left text-dark"></i> Back
                    </button>
                    <div className="more-options">
                        <button className="btn text-dark"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowMoreModal(true);
                            }}
                        >
                            <i className="bi bi-three-dots-vertical text-dark"></i>
                        </button>
                    </div>
                </div>
            )}
            <div
                className="large-image-main"
                onClick={handleToggleHeaderFooter}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <img src={images[index]?.url} alt={`img-${index}`}/>
            </div>
            {showHeaderFooter && (
                <div className="large-image-footer">
                    <button
                        className="btn text-dark"
                        onClick={handleToggleFavorite}
                        disabled={favoriteLoading}
                        style={{ marginRight: 8 }}
                        title={images[index]?.favorite === 1 ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                    >
                        <i
                            className={`animate__animated bi ${images[index]?.favorite === 1 ? 'bi-heart-fill text-danger animate__bounceIn' : 'bi-heart text-danger animate__bounceIn'}`}
                            style={{ fontSize: 22 }}
                        ></i>
                    </button>
                    <button className="btn text-dark" onClick={handlePrev}>
                        <i className="bi bi-caret-left text-dark"></i>
                    </button>
                    <button className="btn text-dark" onClick={handlePlay}>
                        <i className={`text-dark bi ${isPlaying ? 'bi-pause-circle' : 'bi-play-circle'}`}></i>
                    </button>
                    <button className="btn text-dark" onClick={handleNext}>
                        <i className="bi bi-caret-right text-dark"></i>
                    </button>
                    <button className="btn text-dark" onClick={handleDelete}>
                        <i className="bi bi-trash text-dark"></i>
                    </button>
                </div>
            )}
            {showMoreModal && (
                <div className="large-image-more-modal animate__animated animate__bounceIn">
                    <div
                        className="large-image-more-modal-content"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            className="btn btn-light"
                            disabled={updating}
                            onClick={() => {
                                setShowMoreModal(false);
                                handleSetAvatar(images[index]);
                            }}
                        >
                            Đặt làm ảnh nền
                        </button>
                        <button
                            className="btn btn-light"
                            disabled={updating}
                            onClick={() => {
                                setShowMoreModal(false);
                                handleSetAvatarFrame(images[index]);
                            }}
                        >
                            Đặt làm khung nền
                        </button>
                    </div>
                </div>
            )}

            {message && (<Message type={messageType} message={message}/>)}
        </div>
    );
}
