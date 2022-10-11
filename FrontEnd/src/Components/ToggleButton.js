import React from "react";
import styled from "styled-components";

function ToggleButton({mode1,mode2,action,checked}) {
  return (
    <ToggleButtonWrapper>
      <input
        type="radio"
        name="toggle"
        id={mode1}
        value={mode1}
        onChange={action}
        checked={!checked}
      />
      <label htmlFor={mode1}>{mode1}</label>
      <input
        type="radio"
        name="toggle"
        id={mode2}
        value={mode2}
        onChange={action}
        checked={checked}
      />
      <label htmlFor={mode2}>{mode2}</label>
    </ToggleButtonWrapper>
  );
}

const ToggleButtonWrapper = styled.div`
  display: inline-block;
  padding: 8px;
  background-color: #eee;
  font-size: 12px;
  border-radius: 0.5rem;

  label {
    padding: 0.25rem 0.5rem 0.25rem 0.5rem;
    cursor: pointer;
  }
  input[type="radio"] {
    display: none;
  }
  input[type="radio"]:checked + label {
    transition: ease-in-out 0.2s;
    background-color: rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 0.875rem 0 rgba(33, 37, 41, 0.05);
    color: white;
    border-radius: 0.5rem;
  }
`;

export default ToggleButton