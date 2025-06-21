import Folder from '@components/Folder'
import React, { useState, useEffect, useCallback } from 'react'
import './style.scss'
import { addFolder, editFolder, getFoldersByUserId, deleteFolder } from '@services/folderService'
import { useSelector } from 'react-redux'
import Message from '@components/Message'
import { getAllImageByUserAndFolder } from '@services/pictureService'
import imgfolder from '@assets/image-folder.png';


function Home() {
    const [type, setType] = useState(() => localStorage.getItem('folder_view_type') || 'list')
    const [folders, setFolders] = useState([]);
    const [folderImages, setFolderImages] = useState({}); // { [folderId]: { count, latestImageUrl } }
    const { token, user: currentUser } = useSelector((state) => state.user);
    const [showAdd, setShowAdd] = useState(false);
    const [name, setName] = useState('');
    const [editFolderId, setEditFolderId] = useState(null);
    const [nameEdit, setNameEdit] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchFolders = useCallback(async () => {
        setLoading(true);
        try {
            if (token && currentUser) {
                const res = await getFoldersByUserId(token)
                setFolders(res.data)
                if (res.data && Array.isArray(res.data)) {
                    const folderImagePromises = res.data.map(async (folder) => {
                        const folderId = folder.id || folder._id;
                        const imgRes = await getAllImageByUserAndFolder(folderId, token);
                        let count = 0;
                        let latestImageUrl = '';
                        if (imgRes && imgRes.status==='success' && imgRes.data && Array.isArray(imgRes.data) && imgRes.data.length > 0) {
                            count = imgRes.data.length;
                            const latestImg = imgRes.data[0];
                            latestImageUrl = latestImg.pictureUrl || '';
                        }
                        return { folderId, count, latestImageUrl };
                    });
                    const folderImagesArr = await Promise.all(folderImagePromises);
                    const folderImagesObj = {};
                    folderImagesArr.forEach(({ folderId, count, latestImageUrl }) => {
                        folderImagesObj[folderId] = { count, latestImageUrl };
                    });
                    setFolderImages(folderImagesObj);
                }
            }
            else {
                setFolders([])
                setFolderImages({})
            }
        } catch (e) {
            console.log('Lỗi khi lấy danh sách thư mục:', e);
        } finally {
            setLoading(false);
        }
    }, [token, currentUser])

    useEffect(() => {
        fetchFolders()
    }, [fetchFolders])

    const handleTypeChange = (newType) => {
        setType(newType)
        localStorage.setItem('folder_view_type', newType)
    }

    const handleAddFolder = () => {
        setShowAdd(!showAdd);
    };

    const onChangeSubmit = (value) => {
        setName(value);
    };

    const onAddFolder = async () => {
        setMessage('');
        setLoading(true);
        try {
            const newFolder = await addFolder({ name: name, desc: '' }, token)
            if (newFolder && newFolder.data && newFolder.status === 'success') {
                setFolders(prev => [newFolder.data, ...prev])
                setMessage(newFolder.message );
                setMessageType('success');
                setName('');
                setShowAdd(false);
            }else {
                setMessage(newFolder.message);
                setMessageType('error');
            }
        } catch (e) {
            console.log('Error adding folder:', e);
        } finally {
            setLoading(false);
        }
    }

    const handleEdit = async (folderId) => {
        setMessage('');
        setLoading(true);
        try {
            const folderData = {
                folderId: folderId,
                name: nameEdit,
            }
            const newFolder = await editFolder(folderData, token)
            if (newFolder && newFolder.data && newFolder.status === 'success') {
                setFolders(prev =>
                    prev.map(f =>
                        (f.id || f._id) === folderId ? newFolder.data : f
                    )
                );
                setMessage(newFolder.message);
                setMessageType('success');
                setNameEdit('');
                setEditFolderId(null);
            }else {
                setMessage(newFolder.message);
                setMessageType('error');
            }
        } catch (e) {
            console.log('Error adding folder:', e);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (folderId) => {
        setEditFolderId(folderId);
        const folder = folders.find(f => (f.id || f._id) === folderId);
        setNameEdit(folder ? folder.name : '');
    };

    const handleDelete = async (folderId) => {
        setMessage('');
        setLoading(true);
        try {
            const res = await deleteFolder(folderId, token);
            if (res && res.status === 'success') {
                setFolders(prev => prev.filter(f => (f.id || f._id) !== folderId));
                setMessage(res.message);
                setMessageType('success');
                if (editFolderId === folderId) {
                    setEditFolderId(null);
                    setNameEdit('');
                }
            } else {
                setMessage(res.message);
                setMessageType('error');
            }
        } catch (e) {
            console.log('Error deleting folder:', e);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (folderId) => {
        setConfirmDeleteId(folderId);
    };

    const handleConfirmDelete = () => {
        if (confirmDeleteId) {
            handleDelete(confirmDeleteId);
            setConfirmDeleteId(null);
        }
    };

    const handleCancelDelete = () => {
        setConfirmDeleteId(null);
    };

    return (
        <div>
            <div className="home-toolbar">
                <button className="home-toolbar-btn-add" onClick={handleAddFolder}>
                    <i className="bi bi-plus home-toolbar-icon"></i>
                </button>
                <div>
                    <button
                        className={`home-toolbar-btn home-toolbar-btn--mr${type === 'list' ? ' active' : ''}`}
                        onClick={() => handleTypeChange('list')}
                    >
                        <i className="bi bi-list-ul home-toolbar-icon"></i>
                    </button>
                    <button
                        className={`home-toolbar-btn${type === 'grid' ? ' active' : ''}`}
                        onClick={() => handleTypeChange('grid')}
                    >
                        <i className="bi bi-grid home-toolbar-icon"></i>
                    </button>
                </div>
            </div>
            <div className={`home-folder${type === 'grid' ? ' home-folder--grid' : ' home-folder--list'}`}>
                {showAdd && (
                    <Folder
                        type="add"
                        name={name}
                        typeShow={type}
                        onNameChange={(value) => onChangeSubmit(value)}
                        onSubmit={onAddFolder}
                    />
                )}
                {folders && folders.map(folder => {
                    const folderId = folder.id || folder._id;
                    const isEdit = editFolderId === folderId;
                    const folderImgInfo = folderImages[folderId] || { count: 0, latestImageUrl: '' };
                    return (
                        <Folder
                            key={folderId}
                            folderId={folderId}
                            name={isEdit ? nameEdit : folder.name}
                            date={folder.createdAt ? new Date(folder.createdAt).toLocaleDateString() : ''}
                            number={folderImgInfo.count}
                            img={folderImgInfo.latestImageUrl ? folderImgInfo.latestImageUrl: imgfolder}
                            typeShow={type}
                            isEdit={isEdit}
                            onNameChange={isEdit ? setNameEdit : undefined}
                            onEdit={handleEdit}
                            setEditFolderId={handleEditClick}
                            onDelete={() => handleDeleteClick(folderId)}
                        />
                    );
                })}
            </div>
            {message && (<Message type={messageType} message={message}/>)}
            {confirmDeleteId && (
                <Message
                    type="confirm"
                    message="Xóa thư mục cũng sẽ xóa ảnh trong thư mục này. Bạn có chắc chắn muốn xóa không?"
                    onConfirm={handleConfirmDelete}
                    duration={0}
                    onClose={handleCancelDelete}
                />
            )}
            {loading && (
                <Message type='loading' message='Đang tải...'/>
            )}
        </div>
    )
}

export default Home