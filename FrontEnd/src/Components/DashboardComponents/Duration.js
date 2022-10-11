import React, { useState,useEffect } from "react";
import styled from "styled-components";

function Duration({setDuration}) {
  /* 
    daily : 일간
    weekly : 주간
    month : 월간
  */
  const [currentDuration, setCurrentDuration] = useState("weekly");

  const currentDurationHandler = (e) => {
    setCurrentDuration(e.target.value);
  };
  useEffect(()=>{
    setDuration(currentDuration)
  },[currentDuration])

  return (
    <DateRangeContainer>
      <input
        type="radio"
        name="duration"
        id="daily"
        value="daily"
        onChange={currentDurationHandler}
        checked={currentDuration==="daily"}
      ></input>
      <label htmlFor="daily">일간</label>
      <input
        type="radio"
        name="duration"
        id="weekly"
        value="weekly"
        onChange={currentDurationHandler}
        checked={currentDuration==="weekly"}
      ></input>
      <label htmlFor="weekly">주간</label>
      <input
        type="radio"
        name="duration"
        id="month"
        value="month"
        onChange={currentDurationHandler}
        checked={currentDuration==="month"}
      ></input>
      <label htmlFor="month">월간</label>
    </DateRangeContainer>
  );
}

const DateRangeContainer = styled.div`
  display: inline-block;
  padding: 8px;
  background-color: #eee;
  font-size: 12px;
  border-radius: 0.5rem;
  margin-left:1rem;

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
export default Duration;
