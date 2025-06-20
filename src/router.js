import React from "react";
import { Route, Routes } from "react-router-dom";
import { ROUTERS } from "@utils/router"; 
import Home from "@pages/users/home";  
import Picture from "@pages/users/picture";
import Setting from "@pages/users/setting";
import Register from "@pages/admin/register";
import Login from "@pages/admin/login";
import Manage from "@pages/admin/manage";
import Personal from "@pages/users/personal";
import MasterLayout from "@pages/theme/masterLayout";
import PrivateRoute from "@components/PrivateRoute";

const RenderUserRouter = () => {
  return (
    <MasterLayout>
      <Routes>
        <Route
          path={ROUTERS.USER.HOME}
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path={ROUTERS.USER.PICTURE(":folderId")}
          element={
            <PrivateRoute>
              <Picture />
            </PrivateRoute>
          }
        />
        <Route
          path={ROUTERS.USER.SETTING}
          element={
            <PrivateRoute>
              <Setting />
            </PrivateRoute>
          }
        />

        <Route
          path={ROUTERS.USER.PERSONAL}
          element={
            <PrivateRoute>
              <Personal/>
            </PrivateRoute>
          }
        />

        <Route path={ROUTERS.ADMIN.LOGIN} element={<Login />} />
        <Route path={ROUTERS.ADMIN.REGISTER} element={<Register />} />
        <Route
          path={ROUTERS.ADMIN.MANAGE}
          element={
            <PrivateRoute>
              <Manage />
            </PrivateRoute>
          }
        />
      </Routes>
    </MasterLayout>
  );
};

const RouterCustom = () => <RenderUserRouter />;

export default RouterCustom;
