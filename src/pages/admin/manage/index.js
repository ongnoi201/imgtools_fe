import React, { useEffect, useState } from 'react';
import CardUser from '@components/CardUser';
import { deleteUserById, getAllUsers } from '@services/userService';
import { deleteFolder } from '@services/folderService';
import { useSelector } from 'react-redux';
import Message from '@components/Message';
import './style.scss';

function Manage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');
    const { token } = useSelector((state) => state.user);

    const [confirmUser, setConfirmUser] = useState(false);
    const [confirmFolder, setConfirmFolder] = useState(false);

    const [idUser, setIdUser] = useState('');
    const [idFolder, setIdFolder] = useState('');

    const [folderDeleteResolve, setFolderDeleteResolve] = useState(null);

    useEffect(() => {
        async function fetchUsers() {
            setMessage('');
            setLoading(true);
            try {
                const res = await getAllUsers(token);
                if (res && res.status === 'success' && Array.isArray(res.data)) {
                    setUsers(res.data);
                } else {
                    setMessage(res.message || 'Không có dữ liệu người dùng');
                    setMessageType('error');
                }
            } catch (e) {
                console.log('Lỗi khi lấy danh sách user:', e);
                setMessage('Lỗi khi lấy danh sách người dùng');
                setMessageType('error');
            }
            setLoading(false);
        }
        fetchUsers();
    }, [token]);

    // --- User ---
    const userDelete = (userId) => {
        setIdUser(userId);
        setConfirmUser(true);
    };

    const confirmDeleteUser = async () => {
        const res = await deleteUserById(idUser, token);
        if (res && res.status === 'success') {
            setMessage(res.message);
            setMessageType('success');
            setUsers((prev) => prev.filter((u) => (u.id || u._id) !== idUser));
        } else {
            setMessage(res.message || 'Xóa thất bại');
            setMessageType('error');
        }
        setConfirmUser(false);
    };

    const cancelDeleteUser = () => setConfirmUser(false);

    // --- Folder ---
    const folderDelete = (folderId) => {
        setIdFolder(folderId);
        setConfirmFolder(true);
        return new Promise((resolve) => {
            setFolderDeleteResolve(() => resolve);
        });
    };

    const confirmDeleteFolder = async () => {
        const res = await deleteFolder(idFolder, token);
        if (res && res.status === 'success') {
            setMessage(res.message);
            setMessageType('success');
        } else {
            setMessage(res.message || 'Xóa thư mục thất bại');
            setMessageType('error');
        }
        setConfirmFolder(false);
        if (folderDeleteResolve) {
            folderDeleteResolve(res);
            setFolderDeleteResolve(null);
        }
        return res;
    };

    const cancelDeleteFolder = () => {
        setConfirmFolder(false);
        if (folderDeleteResolve) {
            folderDeleteResolve(null);
            setFolderDeleteResolve(null);
        }
    };

    // --- Update role ---
    const updateUserRole = (userId, newRole) => {
        setUsers((prevUsers) =>
            prevUsers.map((u) =>
                (u.id || u._id) === userId ? { ...u, role: newRole } : u
            )
        );
    };

    return (
        <div className="manage-page">
            <>
                {loading ? (
                    <div className="text-center">Đang tải dữ liệu...</div>
                ) : (
                    users.map((user) => (
                        <CardUser
                            key={user.id || user._id}
                            user={user}
                            token={token}
                            handleDeleteUser={userDelete}
                            handleDeleteFolder={folderDelete}
                            onRoleChange={updateUserRole}
                        />
                    ))
                )}

                {confirmUser && (
                    <Message
                        type="confirm"
                        message="Bạn muốn xóa người dùng này?"
                        onConfirm={confirmDeleteUser}
                        duration={0}
                        onClose={cancelDeleteUser}
                    />
                )}

                {confirmFolder && (
                    <Message
                        type="confirm"
                        message="Bạn muốn xóa thư mục này?"
                        onConfirm={confirmDeleteFolder}
                        duration={0}
                        onClose={cancelDeleteFolder}
                    />
                )}
            </>
            {message && <Message type={messageType} message={message} />}
        </div>
    );
}

export default Manage;
