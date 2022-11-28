import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { LoginApi } from "Utils/api";
import { setLogin } from "Modules/login";

import Login from "./Login";
import { LoadingWrapper } from "Components/LoadingWrapper";
import { trackPromise } from "react-promise-tracker";

function LoginContainer() {
  const dispatch = useDispatch();

  const [inputID, setInputID] = useState("");
  const [inputPW, setInputPW] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const _inputIDHandler = (e) => {
    setInputID(e.target.value);
  };
  const _inputPWHandler = (e) => {
    setInputPW(e.target.value);
  };

  const loginFunc = (e) => {
    e.preventDefault();
    if (inputID === "") {
      setErrorMsg("아이디를 입력해주세요.");
    } else if (inputPW === "") {
      setErrorMsg("비밀번호를 입력해주세요.");
    } else {
      setErrorMsg("");
      trackPromise(
        LoginApi(inputID, inputPW)
          .then((res) => {
            const _token = res.data.token;
            const _refreshToken = res.data.refreshToken;
            // 토큰 정보를 담는 객체
            const _tokensObj = {
              token: _token,
              refreshToken: _refreshToken,
            };

            dispatch(setLogin(_tokensObj));
          })
          .catch((err) => {
            if (err.response.status === 401) {
              alert("아이디 또는 비밀번호가 일치하지 않습니다.");
            }
          })
      );
    }
  };

  return (
    <>
      <LoadingWrapper>
        <Login
          _inputIDHandler={_inputIDHandler}
          _inputPWHandler={_inputPWHandler}
          errorMsg={errorMsg}
          loginFunc={loginFunc}
        />
      </LoadingWrapper>
    </>
  );
}

export default LoginContainer;
