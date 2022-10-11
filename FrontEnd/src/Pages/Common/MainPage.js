import React from "react";
import styled from "styled-components";

function MainPage() {
  return (
    <Wrapper>
      <h1>Nextrend.kr 임시 메인페이지. 이 곳에 페이지 메인 기능 설명</h1>
      <iframe src="http://knlab.co.kr/?act=info.page&pcode=sub3_1" title="nextrend서비스 개요" width="100%" height="700px"></iframe>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 90%;
  margin: 0 auto;
`;
export default MainPage;
