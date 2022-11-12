import styled from "styled-components";
import { tailwindColors } from "styles/colors";

export const WorkerContentHeader = ({ title, Icon, children }) => {
  return (
    <Container>
      <TitleWrap>
        {Icon && <Icon size={32} />}
        <h2>{title}</h2>
      </TitleWrap>
      <Content>{children}</Content>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  background-color: ${tailwindColors.white};
`;

const TitleWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  white-space: nowrap;

  & h2 {
    font-size: 2rem;
    font-weight: bold;
  }
`;

const Content = styled.div``;
