import React, { useState } from 'react';
import './style.scss';
import { useNavigate } from 'react-router-dom';
import { ROUTERS } from '@utils/router';
import { addUser } from '@services/userService';
import Message from '@components/Message';

function Register() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('success');
    const [form, setForm] = useState({ name: '', username: '', password: '', confirm: '' });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const togglePassword = () => setShowPassword((prev) => !prev);
    const toggleConfirm = () => setShowConfirm((prev) => !prev);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        if (form.password !== form.confirm) {
            setMessage('Mật khẩu không khớp!');
            setType('error');
            return;
        }
        const res = await addUser(form);
        if (res && res.status === 'success') {
            setMessage('Đăng ký thành công!');
            setType('success');
            setTimeout(() => {
                navigate(ROUTERS.ADMIN.LOGIN);
            }, 3000);
        } else {
            setMessage(res.message || 'Đăng ký thất bại!');
            setType('error');
        }
    };

    return (
        <div className="register-container">
            <form className="register-form" onSubmit={handleSubmit}>
                <h2>Đăng ký</h2>
                <div className="form-group">
                    <label htmlFor="name">Họ và tên</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        autoComplete="name"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="username">Tên đăng nhập</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        required
                        autoComplete="username"
                    />
                </div>
                <div className="form-group password-group">
                    <label htmlFor="password">Mật khẩu</label>
                    <div className="password-input-wrapper">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            autoComplete="new-password"
                        />
                        <span className="toggle-eye" onClick={togglePassword}>
                            <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                        </span>
                    </div>
                </div>
                <div className="form-group password-group">
                    <label htmlFor="confirm">Xác nhận mật khẩu</label>
                    <div className="password-input-wrapper">
                        <input
                            type={showConfirm ? 'text' : 'password'}
                            id="confirm"
                            name="confirm"
                            value={form.confirm}
                            onChange={handleChange}
                            required
                            autoComplete="new-password"
                        />
                        <span className="toggle-eye" onClick={toggleConfirm}>
                            <i className={`bi ${showConfirm ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                        </span>
                    </div>
                </div>
                <button type="submit" className="register-btn">Đăng ký</button>
                <div className="register-link">
                    Đã có tài khoản? <span onClick={()=>navigate(ROUTERS.ADMIN.LOGIN)}>Đăng nhập</span>
                </div>
            </form>
            {message && (<Message type={type} message={message}/>)}
        </div>
    );
}

export default Register;
