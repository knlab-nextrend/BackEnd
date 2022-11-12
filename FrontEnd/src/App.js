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
            <AdminBody isLogin={isLogin}>
              <SideMenuBar
                permission={userInfo.permission}
                name={userInfo.name}
              />
              <Section>
                {userInfo.permission === 1 && <WorkerSection />}
                {userInfo.permission === 2 && <WorkerSection />}
                {userInfo.permission === 3 && <WorkerSection />}
                {userInfo.permission === 4 && <WorkerSection />}
                {userInfo.permission === 9 && (
                  <>
                    <WorkerSection />
                    <ManagerSection />
                  </>
                )}
                <PrivateRoute path="/home" exact>
                  <MainPage />
                </PrivateRoute>
              </Section>
            </AdminBody>
          ) : (
            <>
              <Header logo={userInfo.logo} name={userInfo.name} />
              <UserBody isLogin={isLogin}>
                <UserSection />
              </UserBody>
            </>
          )}
          <Footer />
        </>
      )}
      <GlobalModal /> {/* 모달 전역 제어 */}
      <TopButton /> {/* 전역 탑 버튼 */}
    </>
  );
}

const AdminBody = styled.div`
  display: ${(props) => (props.isLogin ? "grid" : "none")};
  grid-template-columns: minmax(260px, 1fr) 8fr;
  min-height: 1280px;
  overflow-x: hidden;
`;
const UserBody = styled.div`
  padding-top: ${(props) => (!props.isLogin ? "0rem" : "6.5rem")};
  min-height: 1280px;
`;

const Section = styled.section`
  padding-left: 280px;
  width: calc(100vw - 280px);
`;

export default App;
