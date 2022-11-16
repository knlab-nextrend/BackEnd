import { SideMenuBar } from "Components";
import Footer from "Components/Footer";
import { shallowEqual, useSelector } from "react-redux";
import styled from "styled-components";

export const WorkerLayout = ({ children }) => {
  const userInfo = useSelector((state) => state.user.user, shallowEqual);
  return (
    <Container>
      <SideMenuBar permission={userInfo.permission} name={userInfo.name} />
      <Contents>{children}</Contents>
    </Container>
  );
};

const Container = styled.div``;

const Contents = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  padding-left: 280px;
`;
