import React from "react";
import styled from "styled-components";
function CurationDataCard({ curationDataItem }) {
  return (
    <>
      <CardWrapper>
        <ImageContainer>
          <Image src={
                          curationDataItem.doc_thumbnail !== null
                            ? `http://${curationDataItem.doc_thumbnail}`
                            : process.env.PUBLIC_URL +
                              `/img/curation_default_image.png`
                        } />
        </ImageContainer>
      
        <ContentContainer>
          <Title>
            <div>[{curationDataItem.doc_country_list}]</div>
            <div>{curationDataItem.doc_kor_title}</div>
          </Title>
          <SubTitle>{curationDataItem.doc_origin_title}</SubTitle>
          <Info>
            <CategoryBadge color="grey">
              {curationDataItem.doc_category_list}
            </CategoryBadge>
            <CountryBadge color="grey">
              {curationDataItem.doc_publish_country_list}
            </CountryBadge>
            <PublisherBadge color="grey">
              {curationDataItem.doc_publisher}
            </PublisherBadge>
          </Info>
          <Info>
            <PageBadge color="grey">{curationDataItem.doc_page}쪽</PageBadge>
            <RegiDateBadge color="grey">
              {curationDataItem.doc_register_date}
            </RegiDateBadge>
          </Info>
          <Content>{curationDataItem.doc_content}</Content>
        </ContentContainer>
      </CardWrapper>
    </>
  );
}

const CardWrapper = styled.div`
  width:inherit;
  display: flex;
  padding: 1rem;
  box-shadow: rgb(9 30 66 / 25%) 0px 1px 1px;
  border-radius: 4px;
  margin: 1rem;
  transition: all 0.3s ease-in-out; /* 부드러운 모션을 위해 추가*/
  &:hover {
    transform: scale(1.02);
    cursor: pointer;
  }
  background-color: white;
`;
const ImageContainer = styled.div`
  min-width: 12rem;
  max-width: 12rem;
  height: 100%;
  overflow: hidden;
  box-shadow: rgb(9 30 66 / 25%) 0px 1px 1px;
`;
const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const ContentContainer = styled.div`
  p {
    padding: 0;
    margin: 0;
  }
  div {
    margin-bottom: 0.5rem;
  }
  display: flex;
  flex-direction: column;
  padding: 1rem;
`;
const Title = styled.div`
  display: flex;
  div:nth-child(1){
    min-width:5rem;
  }
  div {
    margin-right: 0.5rem;
    font-weight: bold;
    font-size: 20px;
  }
  /* p태그 첫번째 요소는 말머리 */
  /* div:nth-child(1) {
    color: black;
  } */
  /* p태그 두번째 요소는 한글 제목*/
  div:nth-child(1) {
    color: #435269;
  }
`;
const SubTitle = styled.div`
  /* p태그 세번째 요소는 원문 제목*/
  font-size: 14px;
  color: grey;
  word-break:break-all;
  word-wrap:break-word;
`;
const Info = styled.div`
  font-size: 12px;
  display: flex;

  div {
    align-items: center;
    padding: 0.5rem;
    margin: 0;
  }
`;
const Badge = styled.div`
  &:before {
    content: "";
    color: white;
    font-weight: bold;
    font-size: 12px;
    padding-left: 5px;
    padding-right: 5px;
    margin-right: 5px;
    border-radius: 3px;
    background-color: ${(props) => props.color || "grey"};
  }
`;
const CategoryBadge = styled(Badge)`
  &:before {
    content: "주제";
  }
`;
const CountryBadge = styled(Badge)`
  &:before {
    content: "발행 국가";
  }
`;
const PageBadge = styled(Badge)`
  &:before {
    content: "페이지수";
  }
`;
const PublisherBadge = styled(Badge)`
  &:before {
    content: "발행기관명";
  }
`;
const RegiDateBadge = styled(Badge)`
  &:before {
    content: "데이터 등록 일자";
  }
`;
const Content = styled.div`
  overflow: hidden;

  text-overflow: ellipsis;

  display: -webkit-box;

  -webkit-line-clamp: 5; /* 라인수 */

  -webkit-box-orient: vertical;

  word-wrap: break-word;
  word-break:break-all;
`;
export default CurationDataCard;
