import React, { useEffect, useState } from 'react';
import './style.scss';
import logo from 'assets/logo.png';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ROUTERS } from '@utils/router';
import Setting from '@pages/users/setting';

const Header = () => {
    const { token, user: currentUser } = useSelector((state) => state.user);
    const [avatar, setAvatar] = useState('');
    const [openSetting, setOpenSetting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (token && currentUser) {
            setAvatar(currentUser.avatar);
        }
    }, [token, currentUser, currentUser?.avatar]);

    return (
        <header className="header animate__animated animate__slideInDown">
            <div className="header__left animate__animated animate__slideInLeft" onClick={() => navigate(ROUTERS.USER.HOME)}>
                <img src={logo} alt="Logo" className="header__logo" />
                <span className="header__title">Imgtools</span>
            </div>
            <div className="header__right animate__animated animate__slideInRight">
                <i className="bi bi-gear header__icon" title="Settings" onClick={() => setOpenSetting(true)} />
                {avatar && avatar !== ''
                    ? (<img className='avatar-header' src={avatar} alt='icon-avatar' onClick={() => navigate(ROUTERS.USER.PERSONAL)} />)
                    : (<i className="bi bi-person header__icon" title="User" onClick={() => navigate(ROUTERS.ADMIN.LOGIN)}></i>)}
                {/* <i className="bi bi-list header__icon" title="Menu"></i> */}
            </div>
            {openSetting && (
                <div className="setting-overlay" onClick={() => setOpenSetting(false)}>
                    <div className="setting-slide" onClick={e => e.stopPropagation()}>
                        <button
                            className="close-setting"
                            onClick={() => setOpenSetting(false)}
                        >
                            &times;
                        </button>
                        <Setting/>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
