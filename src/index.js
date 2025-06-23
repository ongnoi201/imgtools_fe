import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import RouterCustom from './router';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min";
import './globalStyle.scss';
import { Provider } from 'react-redux';
import store from './redux/store';
import { suppressWarnings } from "@utils/suppressWarnings";

suppressWarnings();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <BrowserRouter>
            <RouterCustom />
        </BrowserRouter>
    </Provider>
);

const saved = localStorage.getItem('siteSettings');
if (saved) {
    try {
        const settings = JSON.parse(saved);
        if (settings.headerColor) document.documentElement.style.setProperty('--header-color', settings.headerColor);
        if (settings.headerTextColor) document.documentElement.style.setProperty('--header-text-color', settings.headerTextColor);
        if (settings.bodyColor) document.documentElement.style.setProperty('--body-color', settings.bodyColor);
        if (settings.bodyTextColor) document.documentElement.style.setProperty('--body-text-color', settings.bodyTextColor);
        if (settings.buttonColor) document.documentElement.style.setProperty('--button-color', settings.buttonColor);
        if (settings.buttonTextColor) document.documentElement.style.setProperty('--button-text-color', settings.buttonTextColor);
        if (settings.filmInfoColor) document.documentElement.style.setProperty('--card-color', settings.filmInfoColor);
        if (settings.filmInfoTextColor) document.documentElement.style.setProperty('--card-text-color', settings.filmInfoTextColor);
        if (settings.fontFamily) document.documentElement.style.setProperty('--main-font', settings.fontFamily);
    } catch (e) { }
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw-img-cache.js')
      .then(reg => console.log('[SW] Registered'))
      .catch(err => console.error('[SW] Register error:', err));
  });
}
