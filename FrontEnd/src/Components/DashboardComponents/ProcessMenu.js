import React from "react";
import styled, { css } from "styled-components";

function ProcessMenu({process,processHandler}) {
  
  const _processHandler = (value) => {
    processHandler(value);
  };
  return (
    <CardWrapper>
      <div className="title">
        <div className="title-main">단계 선택</div>
        <div className="title-sub">통계를 확인할 단계를 선택하세요.</div>
      </div>
      <ul>

        <MenuItem
          onClick={() => {
            _processHandler(1);
          }}
          active={process === 1}
        >
          스크리닝
        </MenuItem>
        <MenuItem
          onClick={() => {
            _processHandler(2);
          }}
          active={process === 2}
        >
          정제
        </MenuItem>
        <MenuItem
          onClick={() => {
            _processHandler(4);
          }}
          active={process === 4}
        >
          등록(아카이브)
        </MenuItem>
        <MenuItem
          onClick={() => {
            _processHandler(6);
          }}
          active={process === 6}
        >
          큐레이션
        </MenuItem>
      </ul>
    </CardWrapper>
  );
}
const CardWrapper = styled.div`
  margin: 1rem 0.5rem 0 0.5rem;
  border-radius: 4px;
  box-shadow: 0 0 0.875rem 0 rgba(33, 37, 41, 0.05);
  background-color: white;
  .title {
    border-bottom: 1px solid #e6e9ed;
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
  ul {
    display: flex;
    margin: 0;
    padding: 0;
  }
`;
const MenuItem = styled.li`
  height: 100%;
  text-align: center;
  min-width: 150px;
  list-style-type: none;
  padding: 1rem 1.5rem 1rem 1.5rem;
  cursor: pointer;
  &:hover {
    background-color: #435269;
    color: white;
    font-weight: bold;
  }
  ${(props) =>
    props.active &&
    css`
      background-color: ${(props) => (props.active ? "#435269" : "white")};
      color: white;
      font-weight: bold;
    `};
`;

export default ProcessMenu;
