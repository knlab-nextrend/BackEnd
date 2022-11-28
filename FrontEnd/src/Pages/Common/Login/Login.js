import React from "react";
import styled from "styled-components";
import { myColors } from "styles/colors";
function Login({ _inputIDHandler, _inputPWHandler, loginFunc, errorMsg }) {
  return (
    <>
      <Wrap>
        <LoginContainer onSubmit={(e) => loginFunc(e)}>
          <LogoContainer>
            <img src={"../../img/logo4.png"} alt="넥스트렌드 로고" />
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
          <LoginButton>로그인</LoginButton>
        </LoginContainer>
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
      </Wrap>
    </>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  padding: 1rem;
  background-image: url("../../img/login_back.jpg");
  background-repeat: no-repeat;
  background-size: cover;
`;

const LoginContainer = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 30rem;
  align-items: center;
  justify-content: center;
`;

const LogoContainer = styled.div`
  img {
    max-width: 100%;
  }
  margin-bottom: 1rem;
`;
const CustomInput = styled.input`
  border-radius: 1.5rem;
  width: 90%;
  height: 3rem;
  border: solid 1px #d6d6d6;
  padding-left: 1rem;
  font-size: 16px;
  margin: 0.5rem 0 0.5rem 0;
`;

const LoginButton = styled.button`
  width: 90%;
  height: 3rem;
  border-radius: 1.5rem;
  border: solid 1px #d6d6d6;
  padding: 0 1rem;
  margin: 0.5rem 0;
  font-size: 16px;

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

const PageIngoContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  row-gap: 1rem;
  column-gap: 10rem;
  max-width: 30rem;
  width: 100%;
  & > p:hover {
    text-decoration: underline;
  }
`;

const ErrorMsg = styled.p`
  color: ${myColors.red};
`;

export default Login;
