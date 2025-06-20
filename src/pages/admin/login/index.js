import React, { useEffect, useState } from 'react'
import './style.scss';
import { useNavigate } from 'react-router-dom';
import { ROUTERS } from '@utils/router';
import Message from '@components/Message';
import { login } from '@services/userService';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@redux/userSlice';

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const { token, user: currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        if (token && currentUser) {
            navigate('/');
        }
    }, [navigate, token, currentUser]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const togglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); 
        try {
            const res = await login(form.username, form.password);
            if (res.status === 'success') {
                dispatch(setUser({ user: res.user, token: res.token }));
                localStorage.setItem('userInfo', JSON.stringify({ user: res.user, token: res.token }));
                setTimeout(() => {
                    navigate('/');
                }, 0);
            }else{
                setError(res.message || 'Đăng nhập thất bại!');
            }
        } catch (err) {
            console.log('Login error:', err);   
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Đăng nhập</h2>
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
                            autoComplete="current-password"
                        />
                        <span className="toggle-eye" onClick={togglePassword}>
                            <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                        </span>
                    </div>
                </div>
                <button type="submit" className="login-btn">Đăng nhập</button>
                <div className="register-link">
                    Bạn chưa có tài khoản? <span className="link-btn" onClick={() => navigate(ROUTERS.ADMIN.REGISTER)}>Đăng ký</span>
                </div>
            </form>
            {error && <Message type="error" message={error} />}
        </div>
    )
}

export default Login