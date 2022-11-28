import React, { useEffect } from "react";
import styled from "styled-components";

/* components */
import Header from "./Components/Header";
import MainPage from "./Pages/Common/MainPage";
import { SideMenuBar } from "Components";
import Footer from "./Components/Footer";
import GlobalModal from "./Components/ModalComponents/GlobalModal";
import TopButton from "./Components/TopButton";

/* body */
import LoginContainer from "./Pages/Common/Login/LoginContainer";
import WorkerSection from "./Pages/Worker/WorkerSection";
import UserSection from "./Pages/User/UserSection";
import ManagerSection from "./Pages/Manager/ManagerSection";

/* route components */
import PublicRoute from "routes/PublicRoute";
import PrivateRoute from "routes/PrivateRoute";

import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { userAuthApi, sessionHandler } from "./Utils/api";
import { setUser } from "./Modules/user";
import { trackPromise } from "react-promise-tracker";
import { WorkerLayout } from "templates/WorkerLayout";
import { UserLayout } from "templates/UserLayout";

function App() {
  const isLogin = useSelector((state) => state.login.isLogin, shallowEqual);
  const userInfo = useSelector((state) => state.user.user, shallowEqual);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isLogin) {
      trackPromise(
        userAuthApi()
          .then((res) => {
            dispatch(
              setUser({
                name: res.data.Name,
                permission: Number(res.data.Category),
                id: res.data.id,
                logo: res.data.logo,
              })
            );
          })
          .catch((err) => {
            sessionHandler(err, dispatch);
          })
      );
    }
  }, [isLogin]);

  return (
    <>
      <PublicRoute
        restricted={true}
        path="/"
        component={LoginContainer}
        exact
      />
      {isLogin && userInfo !== null && (
        <>
          {userInfo.permission !== 0 ? (
            <WorkerLayout>
              {[1, 2, 3, 4].some((v) => v === userInfo.permission) && (
                <WorkerSection />
              )}
              {userInfo.permission === 9 && (
                <>
                  <WorkerSection />
                  <ManagerSection />
                </>
              )}
              <PrivateRoute path="/home" exact>
                <MainPage />
              </PrivateRoute>
            </WorkerLayout>
          ) : (
            <>
              <UserLayout>
                <UserSection />
              </UserLayout>
            </>
          )}
        </>
      )}
      <GlobalModal />
      <TopButton />
    </>
  );
}
export default App;
