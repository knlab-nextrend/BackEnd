/* 그냥 단순 버튼 컴포넌트임 ... */
import React from "react";
import styled from "styled-components";
import { tailwindColors } from "styles/colors";

function Button({ color, children, ...rest }) {
  return (
    <CustomButton color={color} {...rest}>
      {children}
    </CustomButton>
  );
}

const CustomButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 10rem;
  padding: 0.5rem 1rem;
  border: none;
  background-color: ${(props) => props.color || tailwindColors["grey-600"]};
  color: white;
  cursor: pointer;
  p {
    margin-left: 0.5rem;
    font-weight: bold;
  }
`;
export default Button;
