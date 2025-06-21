import React, { useState, useEffect } from 'react';
import './style.scss';
import LargeImage from '@components/LargeImage';
import { getFoldersByUserIdPostApi } from '@services/folderService';
import { deleteImage, getImagesByUserAndFolderApi } from '@services/pictureService';
import { editUser } from '@services/userService';
import imgFolder from '@assets/image-folder.png';
import { useDispatch } from 'react-redux';
import { setUser } from '@redux/userSlice';
import Message from '@components/Message';
import {  updateAvatarLocalStorage } from '@tools/function';

export default function CardUser({ user, token, handleDeleteUser, handleDeleteFolder,onRoleChange  }) {
    const [folders, setFolders] = useState([]);
    const [imagesByFolder, setImagesByFolder] = useState({});
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');
    const [showFolders, setShowFolders] = useState(false);
    const [openFolderId, setOpenFolderId] = useState(null);
    const [largeImageOpen, setLargeImageOpen] = useState(false);
    const [largeImageIndex, setLargeImageIndex] = useState(0);
    const [largeImageList, setLargeImageList] = useState([]);
    const [confirmImage, setConfirmImage] = useState(false);
    const [indexImage, setIndexImage] = useState(null);
    const [avt, setAvt] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        let isMounted = true;

        async function fetchFoldersAndImages() {
            setLoading(true);
            setMessage('');
            const folderRes = await getFoldersByUserIdPostApi(user._id || user.id, token);
            if (folderRes && folderRes.status === 'success') {
                const foldersData = folderRes?.data || [];
                if (isMounted) {
                    setFolders(foldersData);
                    setImagesByFolder({});
                }

                const imagesPromises = foldersData.map(folder =>
                    getImagesByUserAndFolderApi(user._id || user.id, folder.id || folder._id, token, 1, 30)
                        .then(res => ({ folderId: folder.id || folder._id, images: res?.data || [] }))
                        .catch(() => ({ folderId: folder.id || folder._id, images: [] }))
                );
                const allImages = await Promise.all(imagesPromises);
                if (isMounted) {
                    const imagesObj = {};
                    allImages.forEach(({ folderId, images }) => {
                        imagesObj[folderId] = images;
                    });
                    setImagesByFolder(imagesObj);
                }
            } else {
                setMessage(folderRes?.message || 'Lỗi tải thư mục');
                setMessageType('error');
            }

            if (isMounted) setLoading(false);
        }

        if (user) fetchFoldersAndImages();
        return () => { isMounted = false; };
    }, [user, token]);

    const handleImageClick = (imgs, idx) => {
        setLargeImageList(imgs);
        setLargeImageIndex(idx);
        setLargeImageOpen(true);
    };

    const handleRoleChangeLocal = async (e) => {
        const newRole = e.target.value;
        const body = {
            userId: user._id || user.id,
            role: newRole
        };

        const res = await editUser(body, token);
        if (res?.status === 'success') {
            setMessage(res?.message || 'Cập nhật thành công');
            setMessageType('success');
            onRoleChange(user._id || user.id, newRole);
        } else {
            setMessage(res?.message || 'Cập nhật quyền thất bại');
            setMessageType('error');
        }
    };


    const deleteFolder = async (folderId) => {
        const res = await handleDeleteFolder(folderId);
        if (res?.status === 'success') {
            setMessage(res?.message || 'Xóa thành công');
            setMessageType('success');
            setFolders(prev => prev.filter(f => (f.id || f._id) !== folderId));
        } else {
            setMessage(res?.message || 'Xóa thất bại');
            setMessageType('error');
        }
    };

    const confirmDeleteImage = async () => {
        setMessage('');
        const deletedImage = largeImageList[indexImage];
        if (!deletedImage) return;

        const res = await deleteImage(deletedImage.id || deletedImage._id, deletedImage.publicId, token);
        if (res && res.status === 'success') {
            setConfirmImage(false);
            const newList = [...largeImageList];
            newList.splice(indexImage, 1);
            const newIndex = Math.max(0, Math.min(indexImage, newList.length - 1));
            setLargeImageList(newList);
            if (newList.length === 0) {
                setLargeImageOpen(false);
            } else {
                setLargeImageIndex(newIndex);
            }

            const folderId = openFolderId;
            if (folderId && imagesByFolder[folderId]) {
                const newImages = imagesByFolder[folderId].filter(img =>
                    (img._id || img.id) !== (deletedImage.id || deletedImage._id)
                );
                setImagesByFolder(prev => ({
                    ...prev,
                    [folderId]: newImages,
                }));
            }

            setMessage(res.message);
            setMessageType('success');
        } else {
            setMessage(res.message || 'Xóa ảnh thất bại');
            setMessageType('error');
        }
    };

    if (!user) return null;
    if (loading) return <div className="card-user-box">Đang tải...</div>;

    return (
        <div className="card-user-box">
            <div className="user-info-row">
                <img className="avatar" src={avt || user.avatar} alt="avatar" />
                <div className="user-info">
                    <div className="name">{user.name}</div>
                    <div className="username">@{user.username}</div>
                    <select
                        className="role-select"
                        value={user.role}
                        onChange={handleRoleChangeLocal}
                    >
                        <option value="admin">admin</option>
                        <option value="user">user</option>
                    </select>
                </div>
                <div className="user-actions">
                    <i className="bi bi-trash delete-icon" onClick={() => handleDeleteUser(user._id || user.id)}></i>
                    <i
                        className={`bi ${showFolders ? 'bi-chevron-up' : 'bi-chevron-down'} v-icon`}
                        onClick={() => setShowFolders(v => !v)}
                    ></i>
                </div>
            </div>

            {showFolders && (
                folders.length === 0 ? (
                    <div className='text-center'>Không có thư mục</div>
                ) : (
                    <div className="folders-list">
                        {folders.map(folder => {
                            const folderId = folder.id || folder._id;
                            const images = imagesByFolder[folderId] || [];
                            const folderImgSrc = images.length > 0 && images[0].pictureUrl ? images[0].pictureUrl : imgFolder;
                            return (
                                <div key={folderId} className="folder-box">
                                    <div className="folder-row">
                                        <img className="folder-img" src={folderImgSrc} alt="folder" />
                                        <div className="folder-name">{folder.name}</div>
                                        <div className="folder-actions">
                                            <i
                                                className={`bi ${openFolderId === folderId ? 'bi-chevron-up' : 'bi-chevron-down'} v-icon`}
                                                onClick={() => setOpenFolderId(openFolderId === folderId ? null : folderId)}
                                            ></i>
                                            <i className="bi bi-trash delete-icon" onClick={() => deleteFolder(folderId)}></i>
                                        </div>
                                    </div>
                                    {openFolderId === folderId && (
                                        images.length === 0 ? (
                                            <div className='text-center'>Không có ảnh</div>
                                        ) : (
                                            <div className="folder-images-grid">
                                                {images.map((img, idx, arr) => (
                                                    <img
                                                        key={img.id || img._id}
                                                        className="folder-img-thumb"
                                                        src={img.pictureUrl}
                                                        alt=""
                                                        onClick={() => handleImageClick(arr, idx)}
                                                    />
                                                ))}
                                            </div>
                                        )
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )
            )}

            {largeImageOpen && (
                <LargeImage
                    images={largeImageList.map(img => ({
                        url: img.pictureUrl,
                        publicId: img.publicId,
                        id: img._id || img.id,
                        favorite: img.favorite
                    }))}
                    currentIndex={largeImageIndex}
                    token={token}
                    onAvatarChange={(imgUrl)=>{
                        updateAvatarLocalStorage(imgUrl, setUser, dispatch);
                        setAvt(imgUrl);
                    }}
                    onDelete={(index) => {
                        setIndexImage(index);
                        setConfirmImage(true);
                    }}
                    onClose={() => setLargeImageOpen(false)}
                />
            )}

            {confirmImage && (
                <Message
                    type="confirm"
                    message="Bạn muốn xóa ảnh này?"
                    onConfirm={confirmDeleteImage}
                    duration={0}
                    onClose={() => setConfirmImage(false)}
                />
            )}

            {message && <Message type={messageType} message={message} />}
        </div>
    );
}
