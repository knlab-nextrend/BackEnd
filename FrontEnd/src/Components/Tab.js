import styled from "styled-components";
import { myColors, tailwindColors } from "styles/colors";

export const Tab = ({ children }) => {
  return <TabGroup>{children}</TabGroup>;
};

const TabItem = ({ selected, onClick, label }) => {
  return (
    <Item selected={selected} onClick={onClick}>
      {label}
    </Item>
  );
};

Tab.Item = TabItem;

const TabGroup = styled.div`
  display: flex;
  align-items: center;
  align-self: flex-start;
`;

const Item = styled.div`
  padding: 0.5rem 1rem;
  border-bottom: 0.2rem solid ${tailwindColors.white};
  border-bottom-color: ${(props) => props.selected && myColors.blue400};
  font-size: 1.2rem;
  font-weight: bold;
  color: ${(props) =>
    props.selected ? myColors.blue400 : tailwindColors["grey-600"]};
  cursor: pointer;
`;
