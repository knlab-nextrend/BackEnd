import React from "react";
import styled from "styled-components";

function ChartCard({ children }) {
  return (
    <CardWrapper>
      <div className="title">
        <div className="title-main">세계 문서 비율</div>
        <div className="title-sub">공정별 세계 비율 입니다.</div>
      </div>
      <div className="chart">{children}</div>
    </CardWrapper>
  );
}

const CardWrapper = styled.div`
  margin: 1rem 0.5rem 1rem 0.5rem;
  border-radius: 4px;
  box-shadow: 0 0 0.875rem 0 rgba(33, 37, 41, 0.05);
  background-color: white;
  color: rgb(59, 59, 59);
  .title {
    border-bottom: 1px solid #e6e9ed;
    padding: 1rem;
  }
  .title-main {
    font-size: 18px;
    padding-bottom: 0.25rem;
  }
  .title-sub {
    font-size: 12px;
    color: #939ba2;
  }
  .chart {
    height: 20rem;
  }
`;
export default ChartCard;
