import React from "react";
import styled from "styled-components";

/* 
    타입에 따라 헤더의 디자인이 다름. 
    type - plus .. view.... 걍 아이콘 이미지 불러오려고 ㅠ 
*/
function FormHeader({ type, title}) {
  return (
    <>
      <HeaderWrapper>
        <img
          className="icon"
          src={process.env.PUBLIC_URL + `/img/icon_${type}.png`}
        />
        <div className="title">{title}</div>
      </HeaderWrapper>
    </>
  );
}

const HeaderWrapper = styled.div`
  padding: 1rem;
  display: flex;
  align-items: center;
  border-bottom: solid 2px #bfbfbf;
  .icon {
    width: 2rem;
    height: 2rem;
    margin-right: 0.5rem;
  }
  .title {
    color: #009999;
    font-size: 24px;
    font-weight: bold;
  }
`;

export default FormHeader;
