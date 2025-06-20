import React, { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import './style.scss'
import { getAllImageByUserAndFolder, uploadImage } from '../../../services/pictureService'
import { deleteImage } from '../../../services/pictureService';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '@redux/userSlice';
import Message from '@components/Message';
import LargeImage from '@components/LargeImage';
import ImageListView from '../../../components/CardImage/ImageListView';
import ImageGridView from '../../../components/CardImage/ImageGridView';

function Picture() {
    const { folderId } = useParams();
    const [images, setImages] = useState([]);
    const [viewMode, setViewMode] = useState(() => localStorage.getItem('viewModeImg') || 'grid');
    const { token, user: currentUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const fileInputRef = React.useRef();
    const [message, setMessage] = useState('');
    const [typeMessage, setTypeMessage] = useState('');
    const [showLargeImage, setShowLargeImage] = useState(false);
    const [largeImageIndex, setLargeImageIndex] = useState(0);
    const [confirmDeleteIdx, setConfirmDeleteIdx] = useState(null);
    const [loading, setLoading] = useState(false);
    // Thêm các state cho phân trang
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const PAGE_SIZE = 30;

    const handleUploadClick = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    // Load ảnh lần đầu hoặc khi đổi folder
    const fetchImages = useCallback(async () => {
        setLoading(true);
        setPage(1);
        setHasMore(true);
        try {
            if (!token || !currentUser) {
                setImages([]);
                setLoading(false);
                return;
            }
            const res = await getAllImageByUserAndFolder(folderId, token, 1, PAGE_SIZE);
            if (res.status === 'success') {
                setImages(res.data);
                setHasMore(res.data.length < res.total ? true : false);
                setPage(2);
            } else {
                setImages([]);
                setHasMore(false);
            }
        } catch (error) {
            setImages([]);
            setHasMore(false);
        }
        setLoading(false);
    }, [folderId, token, currentUser]);

    // Load thêm ảnh khi scroll
    const fetchMoreImages = async () => {
        if (!hasMore || loadingMore) return;
        setLoadingMore(true);
        try {
            const res = await getAllImageByUserAndFolder(folderId, token, page, PAGE_SIZE);
            if (res.status === 'success' && res.data.length > 0) {
                setImages(prev => [...prev, ...res.data]);
                setHasMore((page * PAGE_SIZE) < res.total);
                setPage(prev => prev + 1);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            setHasMore(false);
        }
        setLoadingMore(false);
    };

    // Infinite scroll event
    useEffect(() => {
        const handleScroll = () => {
            if (loading || loadingMore || !hasMore) return;
            const scrollY = window.scrollY || window.pageYOffset;
            const windowHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight;
            if (scrollY + windowHeight >= docHeight - 100) {
                fetchMoreImages();
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    // eslint-disable-next-line
    }, [loading, loadingMore, hasMore, page, folderId, token]);

    // Khi đổi folder hoặc user, reset lại ảnh
    useEffect(() => {
        if (folderId) fetchImages();
    }, [folderId, token, currentUser, fetchImages]);

    useEffect(() => {
        localStorage.setItem('viewModeImg', viewMode);
    }, [viewMode]);

    const handleImageClick = (idx) => {
        setLargeImageIndex(idx);
        setShowLargeImage(true);
    };

    const handleCloseLargeImage = () => {
        setShowLargeImage(false);
    };

    // LargeImage sẽ truyền index ảnh cần xóa
    const handleDeleteLargeImage = (idx) => {
        setConfirmDeleteIdx(idx);
    };

    const handleConfirmDelete = async () => {
        setMessage('');
        const idx = confirmDeleteIdx;
        const img = images[idx];
        
        if (!img) {
            setConfirmDeleteIdx(null);
            return;
        }
        try {
            const publicId = img.publicId || img.puclicId || img.public_id;
            const res = await deleteImage(img._id || img.id, publicId, token);
            if (res.status === 'success') {
                setImages(prev => prev.filter((_, i) => i !== idx));
                if (images.length <= 1) {
                    setShowLargeImage(false);
                } else if (idx >= images.length - 1) {
                    setLargeImageIndex(images.length - 2);
                }
                setMessage(res.message || 'Xóa ảnh thành công');
                setTypeMessage('success');
            } else {
                setMessage(res.message || 'Xóa ảnh thất bại');
                setTypeMessage('error');
            }
        } catch (error) {
            setMessage('Xóa ảnh thất bại');
            setTypeMessage('error');
        }
        setConfirmDeleteIdx(null);
    };

    const handleCancelDelete = () => {
        setConfirmDeleteIdx(null);
    };

    const handleFileChange = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        if (!token) return;
        setLoading(true);
        const formData = new FormData();
        Array.from(files).forEach(file => {
            formData.append('images', file);
        });
        formData.append('folderId', folderId);
        const res = await uploadImage(formData, token);
        if (res.status === 'success') {
            setMessage(res.message || 'Tải lên thành công');
            setTypeMessage('success');
            await fetchImages(); // reset lại danh sách ảnh
        } else {
            setMessage(res.message || 'Tải lên thất bại');
            setTypeMessage('error');
        }
        setLoading(false);
        e.target.value = '';
    };

    // Callback khi cập nhật avatar/avatar_frame từ LargeImage
    const handleAvatarChange = (newUser) => {
        const { _id, name, username, avatar, avatar_frame, createdAt } = newUser;
        dispatch(setUser({ user: newUser, token }));
        localStorage.setItem('userInfo', JSON.stringify({ user: {_id, name, username, avatar, avatar_frame, createdAt}, token }));
    };
    const handleAvatarFrameChange = (newUser) => {
        const { _id, name, username, avatar, avatar_frame, createdAt } = newUser;
        dispatch(setUser({ user: newUser, token }));
        localStorage.setItem('userInfo', JSON.stringify({ user: {_id, name, username, avatar, avatar_frame, createdAt}, token }));
    };

    return (
        <>
            <div className="picture-toolbar">
                <div>
                    <i
                        className="bi bi-upload icon-upload"
                        onClick={handleUploadClick}
                    ></i>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>
                <div>
                    <i
                        className={`bi bi-list-ul icon-list${viewMode === 'list' ? ' active' : ''}`}
                        onClick={() => setViewMode('list')}
                    ></i>
                    <i
                        className={`bi bi-grid icon-grid${viewMode === 'grid' ? ' active' : ''}`}
                        onClick={() => setViewMode('grid')}
                    ></i>
                </div>
            </div>
            <div className='picture-container'>
                {loading && (
                    <Message type='loading' message='Đang tải ảnh...' />
                )}
                {viewMode === 'list' ? (
                    <ImageListView images={images} onImageClick={handleImageClick} />
                ) : (
                    <ImageGridView images={images} onImageClick={handleImageClick} />
                )}
                {loadingMore && !loading && <Message type='loading' message='Đang tải thêm ảnh...' />}
                {!hasMore && !loading && images.length > 0 && (
                    <div style={{ textAlign: 'center', color: '#888', margin: '16px 0' }}>Đã tải hết ảnh</div>
                )}
                {message && (<Message type={typeMessage} message={message} />)}
            </div>
            {showLargeImage && (
                <LargeImage
                    images={images.map(img => ({
                        url: img.pictureUrl,
                        publicId: img.puclicId,
                        id: img._id || img.id,
                        favorite: img.favorite
                    }))}
                    currentIndex={largeImageIndex}
                    onClose={handleCloseLargeImage}
                    onDelete={handleDeleteLargeImage}
                    token={token}
                    onAvatarChange={handleAvatarChange}
                    onAvatarFrameChange={handleAvatarFrameChange}
                />
            )}
            {confirmDeleteIdx !== null && (
                <Message
                    type="confirm"
                    message="Bạn có chắc chắn muốn xóa ảnh này không?"
                    onConfirm={handleConfirmDelete}
                    onClose={handleCancelDelete}
                />
            )}
        </>
    )
}

export default Picture