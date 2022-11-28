import React from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { setLogout } from "../Modules/login";
import { useHistory } from "react-router-dom";
import { myColors, tailwindColors } from "styles/colors";

function Header({ name, logo }) {
  const dispatch = useDispatch();
  const history = useHistory();

  const go메인페이지 = () => {
    history.push("/home");
  };

  /* process.env.PUBLIC_URL 은 /public/ .... 의 경로를 절대경로로 나타냄. 환경변수에요*/

  const logout = () => {
    dispatch(setLogout("NORMAL_LOGOUT"));
  };
  return (
    <>
      <HeaderContainer>
        <ContentWrapper>
          <Logo
            onClick={go메인페이지}
            src={logo ? logo : process.env.PUBLIC_URL + "/img/logo4.png"}
          />
          <LoginInfo>
            <p className="userName">{name}</p>
            <p className="greetings">님 안녕하세요.</p>
            <button onClick={logout}>로그아웃</button>
          </LoginInfo>
        </ContentWrapper>
      </HeaderContainer>
    </>
  );
}

const HeaderContainer = styled.header`
  position: fixed; // 상단고정
  z-index: 999; // 맨 위에
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 6rem;
  background-color: ${tailwindColors.white};
  box-shadow: rgba(99, 99, 99, 0.3) 0px 0px 8px 0px;
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 3rem;
  overflow: hidden;
`;

const Logo = styled.img`
  height: 4rem;
  object-fit: contain;
  cursor: pointer;
`;

const LoginInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  .userName {
    font-weight: bold;
  }
  button {
    margin-left: 1rem;
    height: 2rem;
    border: none;
    padding: 0 1rem 0 1rem;
    background-color: ${myColors.blue500};
    color: ${tailwindColors.white};
    font-weight: bold;
    cursor: pointer;
  }
`;
export default Header;
