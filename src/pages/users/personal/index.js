import React, { useState, useEffect, useRef } from 'react';
import './style.scss';
import { editUser, deleteUser } from '@services/userService';
import { useSelector, useDispatch } from 'react-redux';
import Message from '@components/Message';
import { ROUTERS } from '@utils/router';
import { useNavigate } from 'react-router-dom';
import ImageGridView from '@components/CardImage/ImageGridView';
import LargeImage from '@components/LargeImage';
import { setUser } from '@redux/userSlice';
import {
    fetchFavoritePictures,
    fetchPictures,
    fetchUser,
    formatDateTime,
    updateAvatarFrameState,
    updateAvatarLocalStorage
} from '@tools/function';

export default function PersonalPage() {
    const PICTURES_PAGE_SIZE = 30;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const avatarListRef = useRef(null);
    const [tab, setTab] = useState('recent');
    const [message, setMessage] = useState('');
    const [pictures, setPictures] = useState([]);
    const [userData, setUserData] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [picturePage, setPicturePage] = useState(1);
    const [isDeleting, setIsDeleting] = useState(false);
    const { token } = useSelector((state) => state.user);
    const [recentPictures, setRecentPictures] = useState([]);
    const [favoritePictures, setFavoritePictures] = useState([]);
    const [largeImageIndex, setLargeImageIndex] = useState(0);
    const [recentLoading, setRecentLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);
    const [messageType, setMessageType] = useState('success');
    const [pictureHasMore, setPictureHasMore] = useState(true);
    const [showLargeImage, setShowLargeImage] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [editFields, setEditFields] = useState({
        name: '',
        username: '',
        password: '',
        avatar: ''
    });

    useEffect(() => {
        fetchUser(token, setUserData, setMessage, setMessageType)
    }, [token]);

    useEffect(() => {
        if (editMode) {
            setPictures([]);
            setPicturePage(1);
            setPictureHasMore(true);
        }
    }, [editMode]);

    useEffect(() => {
        if (editMode) {
            fetchPictures(token, picturePage, PICTURES_PAGE_SIZE, setPictures, setPictureHasMore, setMessage, setMessageType, setLoading);
        }
    }, [editMode, token, picturePage]);

    useEffect(() => {
        if (token) fetchPictures(token, 1, 30, setRecentPictures, setPictureHasMore, setMessage, setMessageType, setRecentLoading);
    }, [token]);

    useEffect(() => {
        if (tab === 'favorite' && token) {
            fetchFavoritePictures(token, setFavoritePictures, setFavoriteLoading);
        }

    }, [tab, token]);

    const handleAvatarListScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (pictureHasMore && scrollHeight - scrollTop - clientHeight < 10) {
            setPicturePage(prev => prev + 1);
        }
    };

    const handleEditClick = () => {
        setEditFields({
            name: userData.name || '',
            username: userData.username || '',
            password: '',
            avatar: userData.avatar || ''
        });
        setEditMode(true);
    };

    const handleInputChange = (e) => {
        setEditFields({
            ...editFields,
            [e.target.name]: e.target.value
        });
    };

    const handleAvatarSelect = (url) => {
        setEditFields({
            ...editFields,
            avatar: url
        });
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        setEditFields({
            name: '',
            username: '',
            password: '',
            avatar: ''
        });
    };

    const handleSaveEdit = async () => {
        setMessage('');
        try {
            const payload = {
                name: editFields.name,
                username: editFields.username,
            };
            if (editFields.password && editFields.password.length > 0) {
                payload.password = editFields.password;
            }
            if (editFields.avatar) {
                payload.avatar = editFields.avatar;
            }
            const res = await editUser(payload, token);
            if (res && res.status === 'success') {
                setUserData({ ...userData, ...payload, avatar: editFields.avatar || userData.avatar });
                dispatch(setUser({ user: { ...userData, ...payload, avatar: editFields.avatar || userData.avatar }, token }));
                const { _id, name, username, avatar, avatar_frame, createdAt } = userData;
                localStorage.setItem('userInfo', JSON.stringify({ user: { _id, name, username, avatar, avatar_frame, createdAt }, token }));

                setEditMode(false);
                setEditFields({ name: '', username: '', password: '', avatar: '' });
                setMessage(res.message || 'Cập nhật thành công');
                setMessageType('success');
            } else {
                setMessage(res.message || 'Có lỗi xảy ra');
                setMessageType('error');
            }
        } catch (error) {
            console.log('Error saving user data:', error);
        }
    };

    const handleDelete = async () => {
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        setMessage('');
        setMessageType('success');
        setShowDeleteConfirm(false);
        try {
            const res = await deleteUser(token);
            if (res && res.status === 'success') {
                setMessage(res.message || 'Xóa tài khoản thành công');
                setMessageType('success');
                navigate(ROUTERS.ADMIN.LOGIN);
            } else {
                setMessage(res.message || 'Có lỗi xảy ra khi xóa tài khoản');
                setMessageType('error');
            }
        } catch (error) {
            console.log('Error deleting user:', error);

        }
        setIsDeleting(false);
    };

    const handleRecentImageClick = (idx) => {
        setLargeImageIndex(idx);
        setShowLargeImage(true);
    };

    const handleCloseLargeImage = () => {
        setShowLargeImage(false);
    };

    const handleLogout = () => {
        dispatch(setUser([]));
        localStorage.removeItem('userInfo');
        navigate(ROUTERS.ADMIN.LOGIN);
    };

    if (!userData) return <Message type="loading" message="Đang tải dữ liệu người dùng..." />;
    return (
        <div className="personal-page">
            <div className='logout-icon'>
                <i
                    className="bi bi-box-arrow-right text-success"
                    title="Đăng xuất"
                    onClick={handleLogout}
                ></i>
            </div>
            <div className="cover-img">
                <img src={userData.avatar_frame} alt="cover" />
                <div className="avatar-wrapper">
                    <img className="avatar" src={editMode ? (editFields.avatar || userData.avatar) : userData.avatar} alt="avatar" />
                </div>
            </div>
            <div className="info">
                <div className="name">
                    {editMode ? (
                        <input
                            type="text"
                            name="name"
                            value={editFields.name}
                            onChange={handleInputChange}
                        />
                    ) : (
                        userData.name
                    )}
                </div>
                <div className="username">
                    {editMode ? (
                        <input
                            type="text"
                            name="username"
                            value={editFields.username}
                            onChange={handleInputChange}
                        />
                    ) : (
                        <>@{userData.username}</>
                    )}
                </div>
                <div className="created-at">
                    {formatDateTime(userData.createdAt)}
                </div>
                {editMode ? (
                    !loading ? (
                        <>
                            <div className="edit-fields">
                                <input
                                    type="password"
                                    name="password"
                                    value={editFields.password}
                                    onChange={handleInputChange}
                                    placeholder="New password"
                                />
                            </div>
                            <div className="avatar-select">
                                <div className='box-title'>Chọn avatar từ ảnh của bạn</div>
                                <div
                                    ref={avatarListRef}
                                    className='avatar-select-list'
                                    onScroll={handleAvatarListScroll}
                                >
                                    {pictures.map(pic => (
                                        <img
                                            key={pic.pictureUrl}
                                            src={pic.pictureUrl}
                                            alt="avatar-option"
                                            style={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: '50%',
                                                border: editFields.avatar === pic.pictureUrl ? '2px solid #1976d2' : '2px solid transparent',
                                                cursor: 'pointer',
                                                objectFit: 'cover'
                                            }}
                                            onClick={() => handleAvatarSelect(pic.pictureUrl)}
                                        />
                                    ))}
                                    {pictureHasMore && (
                                        <div style={{ width: '100%', textAlign: 'center', padding: 8, color: '#888' }}>
                                            Đang tải thêm...
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>) : (<div className='text-center mb-3'>Đang tải...</div>)
                ) : null}
                {message && (
                    <Message type={messageType} message={message} />
                )}
                {showDeleteConfirm && (
                    <Message
                        type="confirm"
                        message="Bạn có chắc chắn muốn xóa tài khoản?"
                        onConfirm={handleConfirmDelete}
                        onClose={() => setShowDeleteConfirm(false)}
                    />
                )}
                <div className="actions">
                    {editMode ? (
                        <>
                            <button className="save" onClick={handleSaveEdit}>Save</button>
                            <button className="cancel" onClick={handleCancelEdit}>Cancel</button>
                        </>
                    ) : (
                        <>
                            <button onClick={handleEditClick}>Edit</button>
                            {userData.role === 'admin' && <button className='btn-manage' onClick={() => navigate(ROUTERS.ADMIN.MANAGE)}>Manage</button>}
                            <button
                                className="delete"
                                onClick={handleDelete}
                                disabled={isDeleting}
                                style={{ background: '#d32f2f' }}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </>
                    )}
                </div>
            </div>
            <div className="tabs">
                <button
                    className={tab === 'recent' ? 'active' : ''}
                    onClick={() => setTab('recent')}
                >
                    Ảnh gần đây
                </button>
                <button
                    className={tab === 'favorite' ? 'active' : ''}
                    onClick={() => setTab('favorite')}
                >
                    Ảnh yêu thích
                </button>
            </div>
            <div className="tab-content">
                {tab === 'recent' ? (
                    <div className="recent-pictures">
                        {recentLoading ? (
                            <div className='text-center'>Đang tải ảnh...</div>
                        ) : recentPictures.length === 0 ? (
                            <div className='text-center'>Không có ảnh nào.</div>
                        ) : (
                            <ImageGridView
                                images={recentPictures}
                                onImageClick={handleRecentImageClick}
                            />
                        )}
                        {showLargeImage && (
                            <LargeImage
                                images={recentPictures.map(img => ({
                                    url: img.pictureUrl,
                                    publicId: img.puclicId,
                                    id: img._id || img.id,
                                    favorite: img.favorite
                                }))}
                                currentIndex={largeImageIndex}
                                onClose={handleCloseLargeImage}
                                token={token}
                                onAvatarChange={(imgUrl) => updateAvatarLocalStorage(imgUrl, setUser, dispatch)}
                                onAvatarFrameChange={(imgUrl) => updateAvatarFrameState(imgUrl, userData, setUserData)}
                            />
                        )}
                    </div>
                ) : (
                    <div className="favorite-pictures">
                        {favoriteLoading ? (
                            <div className='text-center'>Đang tải ảnh...</div>
                        ) : favoritePictures.length === 0 ? (
                            <div className='text-center'>Không có ảnh nào.</div>
                        ) : (
                            <ImageGridView
                                images={favoritePictures}
                                onImageClick={handleRecentImageClick}
                            />
                        )}

                        {showLargeImage && (
                            <LargeImage
                                images={favoritePictures.map(img => ({
                                    url: img.pictureUrl,
                                    publicId: img.puclicId,
                                    id: img._id || img.id,
                                    favorite: img.favorite
                                }))}
                                currentIndex={largeImageIndex}
                                onClose={handleCloseLargeImage}
                                token={token}
                                onAvatarChange={(imgUrl) => updateAvatarLocalStorage(imgUrl, setUser, dispatch)}
                                onAvatarFrameChange={(imgUrl) => updateAvatarFrameState(imgUrl, userData, setUserData)}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}