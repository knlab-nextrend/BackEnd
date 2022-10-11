/* 그냥 단순 버튼 컴포넌트임 ... */
import React from "react";
import styled from "styled-components";

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
  padding: 0.3rem 1rem 0.3rem 1rem;
  border-radius: 5px;
  border: none;
  background-color: ${(props) => props.color || "grey"};
  cursor: pointer;
  min-width: 10rem;
  p {
    margin-left: 0.5rem;
    font-size: 14px;
    font-weight: bold;
    color: white;
  }
`;
export default Button;
