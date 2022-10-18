import styled from "styled-components";
import Loading from "./Loading";

export const LoadingWrapper = ({ children }) => {
  return (
    <Wrap>
      <Loading />
      {children}
    </Wrap>
  );
};

const Wrap = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;
