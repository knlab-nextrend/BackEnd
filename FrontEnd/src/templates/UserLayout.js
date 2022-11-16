import Footer from "Components/Footer";
import Header from "Components/Header";
import { shallowEqual, useSelector } from "react-redux";
import styled from "styled-components";

export const UserLayout = ({ children }) => {
  const userInfo = useSelector((state) => state.user.user, shallowEqual);
  return (
    <Container>
      <Header logo={userInfo.logo} name={userInfo.name} />
      <Contents>
        {children}
        <Footer />
      </Contents>
    </Container>
  );
};

const Container = styled.div``;

const Contents = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  padding-top: 6rem;

  & footer {
    margin-top: auto;
  }
`;
