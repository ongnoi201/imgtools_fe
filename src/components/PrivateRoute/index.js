import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { ROUTERS } from '@utils/router';


const PrivateRoute = ({ children }) => {
  const user = useSelector((state) => state.user.user);
  if (!user) {
    return <Navigate to={ROUTERS.ADMIN.LOGIN} />;
  }
  return children;
};

export default PrivateRoute;
