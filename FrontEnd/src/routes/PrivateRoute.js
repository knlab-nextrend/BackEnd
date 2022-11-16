import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "../Components/Loading";
import styled from "styled-components";

/* 
    로그인한 상태에서만 접근 가능한 페이지다.
    로그인하지 않은 상태로 페이지에 접근하려 하면 로그인 화면으로 리다이렉트 시킨다.
*/

function PrivateRoute({ component: Component, ...rest }) {
  const isLogin = useSelector((state) => state.login.isLogin);

  return (
    <Route
      {...rest}
      component={(props) =>
        isLogin ? (
          <Wrap>
            {/* <Loading /> */}
            <Component {...props} />
          </Wrap>
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
}

const Wrap = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;
export default PrivateRoute;
