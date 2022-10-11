import React from "react";
import styled from "styled-components";
function Login({
  _inputIDHandler,
  _inputPWHandler,
  loginFunc,
  errorMsg,
  onKeyPress,
}) {
  return (
    <>
      <BackgroundContainer>
        <LoginContainer>
          <LogoContainer>
            <img src={"../../img/logo4.png"} />
          </LogoContainer>
          <CustomInput
            type="text"
            onChange={_inputIDHandler}
            placeholder="아이디를 입력하세요"
          />
          <CustomInput
            type="password"
            onChange={_inputPWHandler}
            placeholder="패스워드를 입력하세요"
          />
          {errorMsg !== "" ? <ErrorMsg>{errorMsg}</ErrorMsg> : null}
          <LoginButton
            onKeyPress={onKeyPress}
            onClick={loginFunc}
            value="로그인"
            type="button"
          />
          <PageIngoContainer>
            <p>
              <a href="http://knlab.co.kr/?act=info.page&pcode=sub3_1">
                서비스 소개
              </a>
            </p>
            <p>
              powered by <a href="http://knlab.co.kr/">KN Lab.Inc</a>
            </p>
          </PageIngoContainer>
        </LoginContainer>
      </BackgroundContainer>
    </>
  );
}

const ErrorMsg = styled.p`
  color: red;
`;
const PageIngoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 90%;
`;
const BackgroundContainer = styled.div`
  height: 100vh;
  background-image: url("../../img/login_back.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  margin: 0;
  padding: 0;
`;

const LoginContainer = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 30rem;
  position: relative;
  top: 35vh;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
`;

const LogoContainer = styled.div`
  img {
    max-width: 100%;
  }
  margin-bottom: 1rem;
`;
const CustomInput = styled.input`
  border-radius: 30px;
  min-width: 90%;
  min-height: 3rem;
  border: solid 1px #d6d6d6;
  padding-left: 1rem;
  font-size: 16px;
  margin: 0.5rem 0 0.5rem 0;
  &:focus {
    outline: none;
  }
`;

const LoginButton = styled(CustomInput)`
  border: none;
  cursor: pointer;
  background-color: #435269;
  color: white;
  font-weight: bold;
  &:hover {
    filter: brightness(150%);
    transition: all 0.5s;
  }
  &:active {
    filter: brightness(50%);
    transition: all 0.2s;
  }
`;
export default Login;
