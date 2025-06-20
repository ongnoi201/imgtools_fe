import React, { useEffect, useState } from 'react';
import './style.scss';

const Message = ({ type = 'success', message, onConfirm, duration = 3000, onClose }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (type === 'success' || type === 'error') {
            const timer = setTimeout(() => {
                setVisible(false);
                if (onClose) onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [type, duration, onClose]);

    const handleClose = () => {
        setVisible(false);
        if (onClose) onClose();
    };

    if (!visible) return null;
    return (
        <div className={`message message--${type}`}>
            <div className={`message__content${type === 'confirm' ? ' message__content--confirm' : ''}`}>{message}</div>
            {type === 'confirm' && (
                <div className="message__actions message__actions--confirm">
                    <button className="message__btn message__btn--confirm" onClick={onConfirm}>Xác nhận</button>
                    <button className="message__btn message__btn--close" onClick={handleClose}>Đóng</button>
                </div>
            )}
        </div>
    );
};

export default Message;
