import React from 'react';
import './style.scss';

const MoreAction = ({ onEdit, onDelete, folderId }) => (
  <div className="more-action-box">
    <button
      className="action-btn"
      onClick={() => onEdit && onEdit(folderId)}
      title="Sửa"
    >
      <i className="bi bi-pencil"></i> Sửa
    </button>
    <button
      className="action-btn"
      onClick={() => onDelete && onDelete(folderId)}
      title="Xóa"
    >
      <i className="bi bi-trash"></i> Xóa
    </button>
  </div>
);

export default MoreAction;
