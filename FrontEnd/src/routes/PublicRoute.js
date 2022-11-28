import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
/* 
    restricted 는 로그인 한 상태에서는 접근할 수 없는 사이트이며, 
    로그인 상태에서 해당 페이지에 접근하려 하면 메인페이지로 리다이렉트 시킨다.
*/
function PublicRoute({ component: Component, restricted, ...rest }) {

  const isLogin = useSelector((state) => state.login.isLogin);
  const userInfo = useSelector((state) => state.user.user);

  return (
    <Route
      {...rest}
      component={(props) =>
        isLogin && restricted ? (
          <Redirect to={userInfo!==null ? userInfo.permission !== 0 ? "/home" : "/library" : "/"} />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
}
export default PublicRoute;
