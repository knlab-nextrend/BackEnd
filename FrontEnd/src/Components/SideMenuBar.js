import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";

import {
  BsFillCaretDownFill,
  BsTable,
  BsBarChart,
  BsEye,
  BsFileEarmarkDiff,
  BsInboxes,
  BsSave,
  BsJournals,
  BsTranslate,
  BsFillDiagram3Fill,
  BsPersonLinesFill,
  BsRulers,
} from "react-icons/bs";
import { BiLogOut } from "react-icons/bi";
import { AiOutlineRobot } from "react-icons/ai";

import { setLogout } from "Modules/login";
import { myColors, tailwindColors } from "styles/colors";
import { PERMISSON_DATA } from "Data/permission";

export const SideMenuBar = ({ permission, name }) => {
  const dispatch = useDispatch();
  const logout = () => dispatch(setLogout("NORMAL_LOGOUT"));

  return (
    <Container>
      <Header>
        <NavLink to="/">
          <Logo src={process.env.PUBLIC_URL + "/img/logo4.png"} alt="로고" />
        </NavLink>
        <LoginInfo>
          <span>{name}님</span>
          <span>안녕하세요.</span>
          <button onClick={logout}>
            <BiLogOut size={18} />
            <span>Logout</span>
          </button>
        </LoginInfo>
      </Header>
      <MenuList>
        {PERMISSON_DATA[permission] === "관리자" && (
          <>
            <Menu to="/dashboard" name="대시보드" Icon={BsBarChart} />
            <Menu to="/excel/register" name="엑셀 데이터 등록" Icon={BsTable} />
          </>
        )}
        <MenuGroup title="DATA WORK">
          <>
            {PERMISSON_DATA[permission] !== "사용자" &&
              PERMISSON_DATA[permission] !== "정제 작업자" && (
                <Menu
                  to="/crawl/screening"
                  name="크롤 데이터 스크리닝"
                  Icon={BsEye}
                />
              )}
            {PERMISSON_DATA[permission] !== "사용자" && (
              <Menu
                to="/crawl/2"
                name="크롤 데이터 정제"
                Icon={BsFileEarmarkDiff}
              />
            )}
            {PERMISSON_DATA[permission] !== "사용자" &&
              PERMISSON_DATA[permission] !== "정제 작업자" && (
                <Menu to="/crawl/4" name="크롤 데이터 등록" Icon={BsSave} />
              )}
            {(PERMISSON_DATA[permission] === "관리자" ||
              PERMISSON_DATA[permission] === "큐레이션 작업자") && (
              <Menu to="/archive" name="아카이브" Icon={BsInboxes} />
            )}
            {(PERMISSON_DATA[permission] === "관리자" ||
              PERMISSON_DATA[permission] === "큐레이션 작업자") && (
              <Menu to="/curation" name="큐레이션" Icon={BsJournals} />
            )}
          </>
        </MenuGroup>
        <MenuGroup title="CATEGORY MANAGE">
          {PERMISSON_DATA[permission] === "관리자" && (
            <>
              <Menu
                to="/category"
                name="카테고리 관리"
                Icon={BsFillDiagram3Fill}
              />
              <Menu to="/hsot" name="HOST 목록 관리" Icon={AiOutlineRobot} />
              <Menu
                to="/dictionary"
                name="다국어 사전 관리"
                Icon={BsTranslate}
              />
            </>
          )}
        </MenuGroup>
        <MenuGroup title="USER MANAGE">
          {PERMISSON_DATA[permission] === "관리자" && (
            <>
              <Menu to="/user" name="사용자 관리" Icon={BsPersonLinesFill} />
              <Menu
                to="/user-custom-menu"
                name="맞춤형 화면 생성"
                Icon={BsRulers}
              />
            </>
          )}
        </MenuGroup>
      </MenuList>
    </Container>
  );
};

const Container = styled.aside`
  position: fixed;
  z-index: 100;
  display: flex;
  flex-direction: column;
  width: 280px;
  height: 100vh;
  background-color: ${tailwindColors.white};
  box-shadow: rgba(99, 99, 99, 0.3) 0px 0px 8px 0px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 15%;
  padding: 1rem;
  border-bottom: 1px solid ${tailwindColors["grey-300"]};
`;

const Logo = styled.img``;

const LoginInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: bold;
  color: ${tailwindColors["grey-600"]};

  & > span:first-of-type {
    color: ${tailwindColors["grey-800"]};
  }

  & button {
    display: flex;
    align-items: center;
    gap: 0.2rem;
    color: ${tailwindColors["grey-800"]};
    transition: color 0.2s;

    :hover {
      color: ${myColors.red};
    }
  }
`;

const MenuList = styled.ul`
  height: 85%;
  overflow-y: auto;
  padding-bottom: 4rem;
  & > * + * {
    border-top: 1px solid ${tailwindColors["grey-300"]};
  }
  & > *:last-child {
    border-bottom: 1px solid ${tailwindColors["grey-300"]};
  }
`;

// <----- start of MenuGroup ----->

export const MenuGroup = ({ title, children }) => {
  const [open, setOpen] = useState(true);
  const [height, setHeight] = useState(0);

  const ref = useRef();

  useEffect(() => {
    console.log(ref.current.offsetHeight);
    setHeight(ref.current.offsetHeight);
  }, []);

  const toggleGroup = () => {
    setOpen((prev) => !prev);
  };

  return (
    <MenuGroupContainer open={open}>
      <div onClick={toggleGroup}>
        <BsFillCaretDownFill />
        <h3>{title}</h3>
      </div>
      <MenuGroupList ref={ref} height={height} open={open}>
        {children}
      </MenuGroupList>
    </MenuGroupContainer>
  );
};

const MenuGroupContainer = styled.div`
  & > div {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    color: ${tailwindColors["grey-800"]};
    cursor: pointer;

    :hover {
      color: ${myColors.blue300};
    }

    svg {
      transition: transform 0.2s;
      transform: ${(props) => !props.open && "rotate(-90deg)"};
    }

    h3 {
      font-weight: bold;
      user-select: none;
    }
  }
`;

const MenuGroupList = styled.ul`
  display: flex;
  flex-direction: column;
  max-height: ${(props) => (props.open ? "100vh" : "0")};
  overflow: hidden;
  transition: all 0.2s linear;
`;

// <----- end of MenuGroup ----->

// <----- start of Menu ----->

/**
 *
 * @param {import("react-icons").IconType} Icon
 * @param {string} name
 * @param {string} to
 * @returns
 */
const Menu = ({ to, name, Icon }) => {
  return (
    <MenuContainer>
      <MenuLink to={to} activeClassName="active">
        <Icon size={24} />
        <span>{name}</span>
      </MenuLink>
    </MenuContainer>
  );
};

const MenuContainer = styled.li`
  cursor: pointer;
`;

const MenuLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  width: 100%;
  padding: 1rem 1.5rem;
  font-weight: bold;
  color: ${tailwindColors["grey-800"]};
  transition: all 0.2s;

  &:hover {
    background-color: ${myColors.blue100};
  }

  &.active {
    background-color: ${myColors.blue400};
    color: ${tailwindColors.white};
  }
`;

// <----- end of Menu ----->
