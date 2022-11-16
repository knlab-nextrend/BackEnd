import React from "react";
import styled from "styled-components";

function Footer() {
  return (
    <>
      <Wrapper>
        <FooterContent>
          <Logo src={process.env.PUBLIC_URL + "/img/logo3.jpg"} />
          <FooterContainer>
            <ContentWrapper>
              <div className="title">회사명</div>
              <div>케이앤랩 (KNlab)</div>
            </ContentWrapper>
            <ContentWrapper>
              <div className="title">본사 소재지</div>
              <div>경상북도 구미시 대학로 61, 산학협력관 710호</div>
            </ContentWrapper>
            <ContentWrapper>
              <div className="title">기업부설연구소</div>
              <div>서울특별시 금천구 디지털로 121, 에이스가산타워 601-1호</div>
            </ContentWrapper>
            <ContentWrapper>
              <div>Copyright ⓒ 케이엔랩 All rights reserved. </div>
            </ContentWrapper>
          </FooterContainer>
        </FooterContent>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.footer`
  padding: 2rem 0;
  background-color: #435269;
  color: white;
`;

const Logo = styled.img`
  height: 3rem;
`;
const FooterContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const FooterContent = styled.div`
  width: 90%;
  margin: 0 auto;
  & * {
    margin-right: 3rem;
  }
`;
const ContentWrapper = styled.div`
  display: flex;
  align-items: right;
  font-size: 14px;
  padding-top: 1rem;
  .title {
    font-weight: bold;
    min-width: 8rem;
    text-align: left;
  }
`;

export default Footer;
