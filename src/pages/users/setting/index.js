import React, { use, useEffect, useState } from 'react';
import './style.scss';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const defaultSettings = {
    headerColor: '#0d0731f3',
    headerTextColor: '#ffffff',
    bodyColor: '#050116',
    bodyTextColor: '#ffffff',
    buttonColor: '#ffffff',
    buttonTextColor: '#000000',
    cardColor: '#060125f3',
    cardTextColor: '#ffffff',
    fontFamily: 'Arial, sans-serif',
};

function Setting() {
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('siteSettings');
        return saved ? JSON.parse(saved) : defaultSettings;
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();


    useEffect(() => {
        document.documentElement.style.setProperty('--header-color', settings.headerColor);
        document.documentElement.style.setProperty('--header-text-color', settings.headerTextColor);
        document.documentElement.style.setProperty('--body-color', settings.bodyColor);
        document.documentElement.style.setProperty('--body-text-color', settings.bodyTextColor);
        document.documentElement.style.setProperty('--button-color', settings.buttonColor);
        document.documentElement.style.setProperty('--button-text-color', settings.buttonTextColor);
        document.documentElement.style.setProperty('--card-color', settings.filmInfoColor);
        document.documentElement.style.setProperty('--card-text-color', settings.filmInfoTextColor);
        document.documentElement.style.setProperty('--main-font', settings.fontFamily);
        localStorage.setItem('siteSettings', JSON.stringify(settings));
    }, [settings]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings((prev) => ({ ...prev, [name]: value }));
    };

    const handleFontChange = (e) => {
        setSettings((prev) => ({ ...prev, fontFamily: e.target.value }));
    };

    const handleReset = () => {
        setSettings(defaultSettings);
        localStorage.removeItem('siteSettings');
    };

    const handleLogout = () => {
        setSettings(defaultSettings);
        localStorage.clear();
        dispatch({ type: 'LOGOUT' });
        navigate('/login');
    };

    return (
        <div className="setting-page animate__animated animate__slideInRight">
            <h2>Cài đặt giao diện</h2>
            <div className="setting-group animate__animated animate__fadeIn">
                <label>Header: <input type="color" name="headerColor" value={settings.headerColor} onChange={handleChange} /></label>
                <label>Header text: <input type="color" name="headerTextColor" value={settings.headerTextColor} onChange={handleChange} /></label>
                <label>Body: <input type="color" name="bodyColor" value={settings.bodyColor} onChange={handleChange} /></label>
                <label>Body text: <input type="color" name="bodyTextColor" value={settings.bodyTextColor} onChange={handleChange} /></label>
                <label>Button: <input type="color" name="buttonColor" value={settings.buttonColor} onChange={handleChange} /></label>
                <label>Button text: <input type="color" name="buttonTextColor" value={settings.buttonTextColor} onChange={handleChange} /></label>
                <label>Card: <input type="color" name="filmInfoColor" value={settings.filmInfoColor} onChange={handleChange} /></label>
                <label>Card text: <input type="color" name="filmInfoTextColor" value={settings.filmInfoTextColor} onChange={handleChange} /></label>
                <label>Font:
                    <select name="fontFamily" value={settings.fontFamily} onChange={handleFontChange}>
                        <option value="Arial, sans-serif">Arial</option>
                        <option value="Tahoma, Geneva, sans-serif">Tahoma</option>
                        <option value="Times New Roman, Times, serif">Times New Roman</option>
                        <option value="Courier New, Courier, monospace">Courier New</option>
                        <option value="Roboto, sans-serif">Roboto</option>
                        <option value="'Segoe UI', Arial, sans-serif">Segoe UI</option>
                        <option value="'Open Sans', Arial, sans-serif">Open Sans</option>
                        <option value="'Noto Sans', Arial, sans-serif">Noto Sans</option>
                        <option value="'Quicksand', Arial, sans-serif">Quicksand</option>
                        <option value="'Montserrat', Arial, sans-serif">Montserrat</option>
                        <option value="'Source Sans Pro', Arial, sans-serif">Source Sans Pro</option>
                        <option value="'Lato', Arial, sans-serif">Lato</option>
                        <option value="'Be Vietnam Pro', Arial, sans-serif">Be Vietnam Pro</option>
                        <option value="'Nunito', Arial, sans-serif">Nunito</option>
                        <option value="'Merriweather', serif">Merriweather</option>
                        <option value="'IBM Plex Sans', Arial, sans-serif">IBM Plex Sans</option>
                        <option value="'Fira Sans', Arial, sans-serif">Fira Sans</option>
                        <option value="'Inter', Arial, sans-serif">Inter</option>
                        <option value="'Poppins', Arial, sans-serif">Poppins</option>
                        <option value="'SF Pro Display', Arial, sans-serif">SF Pro Display</option>
                    </select>
                </label>
                <button className="btn-reset-setting" onClick={handleReset}>
                    Đặt lại mặc định
                </button>
                <button className="btn-reset-setting" onClick={handleLogout}>
                    Đặt lại mặc định và đăng xuất
                </button>
            </div>
        </div>
    );
}

export default Setting;
