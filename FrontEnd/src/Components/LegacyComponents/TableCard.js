import React from "react";
import styled from "styled-components";

function TableCard({ title, subtitle }) {
  return (
    <CardWrapper>
      <div className="title">
        <div className="title-main">{title}</div>
        <div className="title-sub">{subtitle}</div>
      </div>
      <div className="content">
        <table>
          <tr className="table-header">
            <th>작업자 ID</th>
            <th>이름</th>
            <th>권한</th>
            <th>소속</th>
            <th>직책</th>
            <th>작업 ITEM ID</th>
            <th>작업 단계</th>
            <th>작업 일시</th>
          </tr>
          <tr className="table-body">
            <td>test2</td>
            <td>슈퍼관리자</td>
            <td>관리자</td>
            <td></td>
            <td></td>
            <td>2813</td>
            <td>스크리닝</td>
            <td>2022-01-05 13:18:28</td>
          </tr>
          <tr className="table-body">
            <td>test2</td>
            <td>슈퍼관리자</td>
            <td>관리자</td>
            <td></td>
            <td></td>
            <td>2813</td>
            <td>스크리닝</td>
            <td>2022-01-05 13:18:28</td>
          </tr>
          <tr className="table-body">
            <td>test2</td>
            <td>슈퍼관리자</td>
            <td>관리자</td>
            <td></td>
            <td></td>
            <td>2813</td>
            <td>스크리닝</td>
            <td>2022-01-05 13:18:28</td>
          </tr>
        </table>
      </div>
    </CardWrapper>
  );
}

const CardWrapper = styled.div`

  margin: 1rem 0.5rem 1rem 0.5rem;
  border-radius: 4px;
  box-shadow: 0 0 0.875rem 0 rgba(33, 37, 41, 0.05);
  background-color: white;
  .title {
    padding: 1rem;
  }
  .title-main {
    font-size: 18px;
    color: rgb(59, 59, 59);
    padding-bottom: 0.25rem;
  }
  .title-sub {
    font-size: 12px;
    color: #939ba2;
  }
  .content {
    height: 100%;
    table {
      width: 100%;
      border-collapse: collapse;
    }
    tr {
      height: 3rem;
    }
    .table-header {
      background-color: #d8dee6;
      color: #323d4d;
      border-bottom: 2px solid rgba(0, 0, 0, 0.1);
    }
    .table-body {
      text-align: center;
      &:nth-child(odd) {
        background-color: #F4F5F8;
      }
    }
  }
`;
export default TableCard;
