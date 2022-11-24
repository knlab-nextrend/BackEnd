import { shallowEqual, useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { FaBars } from "react-icons/fa";

import { openSidebar } from "Modules/sidebar";
import { tailwindColors } from "styles/colors";
import { SideMenuBar } from "Components";

export const WorkerLayout = ({ children }) => {
  const dispatch = useDispatch();
  const sidebarWidth = useSelector((state) => state.sidebar.width);
  const userInfo = useSelector((state) => state.user.user, shallowEqual);

  return (
    <Container>
      <Button onClick={() => dispatch(openSidebar())}>
        <FaBars size={20} />
      </Button>
      <SideMenuBar permission={userInfo.permission} name={userInfo.name} />
      <Contents width={sidebarWidth}>{children}</Contents>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
`;

const Button = styled.button`
  position: fixed;
  top: 0.3rem;
  left: 0.3rem;
  z-index: 10;
  padding: 0.5rem;
  color: ${tailwindColors["grey-600"]};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${tailwindColors["grey-300"]};
  }
`;

const Contents = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  padding-left: ${(props) => props.width ?? "280px"};
  transition: padding 0.5s;
`;
