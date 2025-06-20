import React, { useState, useRef, useEffect } from 'react';
import './style.scss';
import imgfolder from '@assets/image-folder.png';
import MoreAction from '../MoreAction';
import { useNavigate } from 'react-router-dom';
import { ROUTERS } from '@utils/router';

const VerticalDots = ({ onClick }) => (
    <span className="folder-dots" onClick={onClick} tabIndex={0} role="button" title="More">
        <i className="bi bi-three-dots-vertical"></i>
    </span>
);

const Folder = ({
    folderId,
    type: propType = 'show', 
    typeShow = 'list',
    img = imgfolder,
    name,
    date = '01/01/2025',
    number = 0,
    onNameChange,
    showDetails,
    onEdit,
    onDelete,
    onSubmit,
    isEdit: isEditProp = false,
    setEditFolderId,
    ...props
}) => {
    // Quản lý state type nội bộ
    const [type, setType] = useState(propType);
    useEffect(() => { setType(propType); }, [propType]);

    // Nếu có prop isEdit thì override trạng thái edit
    const isEdit = isEditProp || type === 'edit' || type === 'add';
    const [open, setOpen] = useState(false);
    const dotsRef = useRef(null);
    const actionRef = useRef(null);
    const navigte = useNavigate();

    useEffect(() => {
        if (!open) return;
        const handleClickOutside = (e) => {
            if (
                dotsRef.current &&
                !dotsRef.current.contains(e.target) &&
                actionRef.current &&
                !actionRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    return (
        <div className={`folder-comp ${typeShow} ${type}`}>
            {typeShow === 'list' ? (
                <div className="folder-list">
                    <img className="folder-img" src={img} alt="folder" onClick={()=>navigte(ROUTERS.USER.PICTURE(folderId))}/>
                    <div className="folder-info">
                        {isEdit ? (
                            <>
                                <input
                                    className="folder-name-input"
                                    value={name}
                                    onChange={e => onNameChange && onNameChange(e.target.value)}
                                    placeholder="Folder name"
                                    onKeyDown={e => {
                                        if (e.key === 'Enter' && type === 'add' && onSubmit) {
                                            onSubmit();
                                        } else if (e.key === 'Enter' && (type === 'edit' || isEditProp) && onEdit) {
                                            onEdit(folderId);
                                        }
                                    }}
                                    autoFocus
                                />
                            </>
                        ) : (
                            <>
                                <p className="folder-name">{name}</p>
                                <p className="folder-date">{date} | {number} files</p>
                            </>
                        )}
                    </div>
                    <span ref={dotsRef} style={{ position: 'relative' }}>
                        <VerticalDots onClick={() => setOpen((v) => !v)} />
                        {open && (
                            <div ref={actionRef} style={{ position: 'absolute', top: 30, right: 20, zIndex: 10 }}>
                                <MoreAction
                                    folderId={folderId}
                                    onEdit={(id) => {
                                        setOpen(false);
                                        setEditFolderId && setEditFolderId(id);
                                    }}
                                    onDelete={(id) => {
                                        setOpen(false);
                                        onDelete && onDelete(id);
                                    }}
                                />
                            </div>
                        )}
                    </span>
                </div>
            ) : (
                <div className="folder-grid">
                    <div className="folder-img-wrapper" style={{ position: 'relative' }}>
                        <img className="folder-img" src={img} alt="folder" onClick={()=>navigte(ROUTERS.USER.PICTURE(folderId))} />
                        <span ref={dotsRef}>
                            <VerticalDots onClick={() => setOpen((v) => !v)} />
                            {open && (
                                <div ref={actionRef} style={{ position: 'absolute', top: -47, right: 15, zIndex: 10 }}>
                                    <MoreAction
                                        folderId={folderId}
                                        onEdit={(id) => {
                                            setOpen(false);
                                            setEditFolderId && setEditFolderId(id);
                                        }}
                                        onDelete={(id) => {
                                            setOpen(false);
                                            onDelete && onDelete(id);
                                        }}
                                    />
                                </div>
                            )}
                        </span>
                    </div>
                    <div className="folder-info">
                        {isEdit ? (
                            <>
                                <input
                                    className="folder-name-input"
                                    value={name}
                                    onChange={e => onNameChange && onNameChange(e.target.value)}
                                    placeholder="Folder name"
                                    onKeyDown={e => {
                                        if (e.key === 'Enter' && type === 'add' && onSubmit) {
                                            onSubmit();
                                        } else if (e.key === 'Enter' && (type === 'edit' || isEditProp) && onEdit) {
                                            onEdit(folderId);
                                        }
                                    }}
                                    autoFocus
                                />
                            </>

                        ) : (
                            <p className="folder-name">{name}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Folder;
