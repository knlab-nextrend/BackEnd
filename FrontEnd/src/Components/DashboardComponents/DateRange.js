import React, { useState,useEffect } from "react";
import styled from "styled-components";

function DateRange({setDateGte}) {
  /* 
    all : 전체 범위
    past_week : 최근 1주
    past_month : 최근 1달
    past_3_month : 최근 3달
    past_6_month : 최근 6달
    past_year : 최근 1년
    past_3_year : 최근 3년
    custom_range : 직접 설정
  */
  const [dateRange, setDateRange] = useState("past_3_month");

  const dateRangeHandler = (e) => {
    setDateRange(e.target.value);
  };
  useEffect(()=>{
    const _dateGte = new Date(); // 오늘 날짜
    if(dateRange === "all"){
      _dateGte.setFullYear(_dateGte.getFullYear() - 30); // 30년 전
    }
    if(dateRange === "past_week"){
      _dateGte.setDate(_dateGte.getDate() - 7); // 7일. 1주일 전
    }
    else if(dateRange === "past_month"){
      _dateGte.setMonth(_dateGte.getMonth() - 1); // 1달 전
    }
    else if(dateRange === "past_3_month"){
      _dateGte.setMonth(_dateGte.getMonth() - 3); // 3달 전
    }
    else if(dateRange === "past_6_month"){
      _dateGte.setMonth(_dateGte.getMonth() - 6); // 6달 전
    }
    else if(dateRange === "past_year"){
      _dateGte.setFullYear(_dateGte.getFullYear() - 1); // 1년 전
    }
    else if(dateRange === "past_3_year"){
      _dateGte.setFullYear(_dateGte.getFullYear() - 3); // 3년 전
    }
    setDateGte(_dateGte.toISOString().substring(0,10));
  },[dateRange])
  return (
    <DateRangeContainer>
      <input
        type="radio"
        name="range"
        id="all"
        value="all"
        onChange={dateRangeHandler}
        checked={dateRange==="all"}
      ></input>
      <label htmlFor="all">전체</label>
      <input
        type="radio"
        name="range"
        id="past_week"
        value="past_week"
        onChange={dateRangeHandler}
        checked={dateRange==="past_week"}
      ></input>
      <label htmlFor="past_week">최근 1주일</label>
      <input
        type="radio"
        name="range"
        id="past_month"
        value="past_month"
        onChange={dateRangeHandler}
        checked={dateRange==="past_month"}
      ></input>
      <label htmlFor="past_month">최근 1달</label>
      <input
        type="radio"
        name="range"
        id="past_3_month"
        value="past_3_month"
        onChange={dateRangeHandler}
        checked={dateRange==="past_3_month"}
      ></input>
      <label htmlFor="past_3_month">최근 3달</label>
      <input
        type="radio"
        name="range"
        id="past_6_month"
        value="past_6_month"
        onChange={dateRangeHandler}
        checked={dateRange==="past_6_month"}
      ></input>
      <label htmlFor="past_6_month">최근 6달</label>
      <input
        type="radio"
        name="range"
        id="past_year"
        value="past_year"
        onChange={dateRangeHandler}
        checked={dateRange==="past_year"}
      ></input>
      <label htmlFor="past_year">최근 1년</label>
      <input
        type="radio"
        name="range"
        id="past_3_year"
        value="past_3_year"
        onChange={dateRangeHandler}
        checked={dateRange==="past_3_year"}
      ></input>
      <label htmlFor="past_3_year">최근 3년</label>
    </DateRangeContainer>
  );
}

const DateRangeContainer = styled.div`
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
export default DateRange;
