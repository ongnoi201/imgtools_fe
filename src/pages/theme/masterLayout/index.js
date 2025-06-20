import React, { memo, useEffect } from 'react';
import Header from '../header';
import { useDispatch } from 'react-redux';
import { setUser } from '@redux/userSlice';
import './style.scss'

const MasterLayout = ({ children, ...props }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem('userInfo'));
        if (savedUser && savedUser.token && savedUser.user) {
            dispatch(setUser(savedUser));
        }
    }, [dispatch]);

    return (
        <div {...props}>
            <Header />
            <div className='all'>
                {children}
            </div>
        </div>
    )
}


export default memo(MasterLayout);