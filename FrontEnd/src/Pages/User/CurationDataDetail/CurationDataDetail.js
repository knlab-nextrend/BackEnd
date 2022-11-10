import React from "react";
import FormHeader from "../../../Components/FormHeader";
import styled from "styled-components";
import { GrFormView } from "react-icons/gr";
import { AiOutlineLink } from "react-icons/ai";
import Editor from "../../../Components/Editor";

function UserCurationDataDetail({ docs, permission, goDataManage }) {
  return (
    <>
      <FormHeader type="view" title={"큐레이션 데이터 상세 조회"} />
      <Wrapper>
        <ArticleInfoWrapper>
          <ImageContainer>
            {docs.doc_thumbnail && (
              <Image src={`http://${docs.doc_thumbnail}`} />
            )}
          </ImageContainer>
          <ArticleInfoContainer>
            <ArticleHeader>
              <SubTitle>[{docs.doc_country_list}]</SubTitle>
              <Title>{docs.doc_kor_title}</Title>
              <div>{docs.doc_origin_title}</div>
            </ArticleHeader>
            {
              // 권한이 관리자일 경우
              permission === 9 && (
                <ArticleActions>
                  <button onClick={goDataManage}>관리</button>
                </ArticleActions>
              )
            }
            <ArticleInfo>
              <Info>
                <GrFormView size="24" color="#d6d6d6" />
                <div className="content">{docs.dc_hits || 0}</div>
              </Info>
              <Info>
                <div className="title">
                  ▶ 원문 수집일 / 원문 작성일 / 원문 발행일
                </div>
                <div className="content">
                  {`${docs.doc_collect_date ? docs.doc_collect_date : " - "}
                  / ${docs.doc_write_date ? docs.doc_write_date : " - "}
                  /
                  ${docs.doc_publish_date ? docs.doc_publish_date : " - "}`}
                </div>
              </Info>
              <Info>
                <div className="title">▶ 문서 서비스 등록일</div>
                <div className="content">{docs.doc_publish_date}</div>
              </Info>
              <Info>
                <div className="title">▶ 문서 언어</div>
                <div className="content">{docs.doc_language_list}</div>
              </Info>
              <Info>
                <div className="title">▶ 기관 명 / 발행 HOST</div>
                <div className="content">
                  {`${docs.doc_publisher ? docs.doc_publisher : " - "} / ${
                    docs.doc_host ? docs.doc_host : " - "
                  }`}
                </div>
              </Info>
              <Info>
                <div className="title">▶ 발행 면수</div>
                <div className="content">{docs.doc_page}</div>
              </Info>
              <Info>
                <div className="title">▶ 발행 국가</div>
                <div className="content">{docs.doc_publish_country_list}</div>
              </Info>
              <Info>
                <div className="title">▶ 정책 분류</div>
                <div className="content">{docs.doc_category_list}</div>
              </Info>
              <Info>
                <div className="title">▶ 문서 유형 분류 / 내용 구분 분류</div>
                <div className="content">
                  {`${
                    docs.doc_content_type_list
                      ? docs.doc_content_type_list
                      : " - "
                  } /
                  ${
                    docs.doc_content_category_list
                      ? docs.doc_content_category_list
                      : " - "
                  }`}
                </div>
              </Info>
              <Info>
                <div className="title">▶ 문서 토픽 분류</div>
                <div className="content">{docs.doc_topic_list}</div>
              </Info>

              <Info>
                <div className="title">
                  ▶ 조사 과제 명 / 주문형 조사과제명의 세부과업명
                </div>
                <div className="content">
                  {`${docs.doc_project ? docs.doc_project : " - "} /${
                    docs.doc_publishing ? docs.doc_publishing : " - "
                  }`}
                </div>
              </Info>
              <Info>
                <div className="title">▶ 큐레이션 추천문서</div>
                <div className="content">{docs.doc_recomment}</div>
              </Info>
            </ArticleInfo>
          </ArticleInfoContainer>
        </ArticleInfoWrapper>
        <ContentRow>
          <div className="title">▶ 키워드</div>
          <div className="contents">
            {docs.doc_keyword &&
              docs.doc_keyword.map((item, index) => {
                return (
                  <div className="chip" key={index}>
                    {item}
                  </div>
                );
              })}
          </div>
        </ContentRow>
        <ContentRow>
          <div className="title">▶ 서지사항</div>
          <div className="contents">{docs.doc_biblio}</div>
        </ContentRow>
        <ContentRow>
          <div className="title">▶ 문서 URL</div>
          <div className="contents">
            <a target="_blank" rel="noreferrer" href={docs.doc_url}>
              {docs.doc_url}
            </a>
          </div>
        </ContentRow>
        <ContentRow>
          <div className="title">▶ 문서 안내 URL</div>
          <div className="contents">
            <a target="_blank" rel="noreferrer" href={docs.doc_url_intro}>
              {docs.doc_url_intro}
            </a>
          </div>
        </ContentRow>
        <ContentRow>
          <div className="title">▶ 연관문서 이동</div>
          {docs.doc_relate_title && docs.doc_relate_url ? (
            <div className="contents">
              <a
                className="chip"
                target="_blank"
                rel="noreferrer"
                href={docs.doc_relate_url}
              >
                <AiOutlineLink />
                {docs.doc_relate_title} ({docs.doc_relate_url})
              </a>
            </div>
          ) : (
            "연관문서 없음"
          )}
        </ContentRow>
        <ContentRow>
          <div className="title">▶ 묶음문서 이동</div>

          {docs.doc_bundle_title && docs.doc_bundle_url ? (
            <div className="contents">
              <a
                className="chip"
                target="_blank"
                rel="noreferrer"
                href={docs.doc_bundle_url}
              >
                <AiOutlineLink />
                {docs.doc_bundle_title} ({docs.doc_bundle_url})
              </a>
            </div>
          ) : (
            "묶음문서 없음"
          )}
        </ContentRow>
        <ContentRow>
          <div className="title">▶ 한글 요약</div>
          <div className="contents">{docs.doc_kor_summary}</div>
        </ContentRow>
        <ContentRow>
          <div className="title">▶ 원문 요약</div>
          <div className="contents">{docs.doc_origin_summary}</div>
        </ContentRow>
        <ContentRow>
          <div className="title">▶ 본문내용</div>
        </ContentRow>
        <ContentRow>
          <Editor readOnly={true} data={docs.doc_content} />
        </ContentRow>
      </Wrapper>
    </>
  );
}
const ArticleActions = styled.div`
  padding: 1rem 0 1rem 0;
  border-bottom: solid 1px #d6d6d6;
  button {
    cursor: pointer;
    margin-right: 1rem;
    border: none;
    width: 80px;
    height: 35px;
  }
`;
const Wrapper = styled.div`
  width: 90%;
  margin: 3rem auto;
  display: flex;
  flex-direction: column;
`;
const ArticleInfoWrapper = styled.div`
  display: flex;
  min-height: 27rem;
  margin-bottom: 3rem;
`;
const SubTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;
const Title = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #009999;
  margin-bottom: 0.5rem;
`;

const ImageContainer = styled.div`
  overflow: hidden;
  box-shadow: rgb(9 30 66 / 25%) 0px 1px 1px;
  display: flex;
  align-items: center;
  max-width: 18rem;
  max-height: 26rem;
`;
const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const ArticleHeader = styled.div`
  padding-bottom: 2rem;
  border-bottom: solid 1px #d6d6d6;
`;
const ArticleInfoContainer = styled.div`
  margin-left: 3rem;
  width: 100%;
`;

const ArticleInfo = styled.div`
  margin-top: 1rem;
  width: 100%;
`;
const Info = styled.div`
  display: flex;
  font-size: 14px;
  margin-bottom: 1rem;
  .title {
    font-weight: bold;
    color: rgb(153, 153, 153);
    width: 30%;
  }
`;

const ContentRow = styled.div`
  display: flex;
  align-items: top;
  font-size: 14px;
  margin-bottom: 1rem;
  .title {
    font-weight: bold;
    font-size: 16px;
    color: rgb(153, 153, 153);
    width: 10%;
  }
  .contents {
    width: 90%;
    display: flex;
    align-content: space-around;
    flex-wrap: wrap;
  }
  .chip {
    padding: 3px 12px;
    margin-bottom: 12px;
    background-color: #eee;
    margin-right: 1rem;
    color: black;
    text-decoration: none;
    display: flex;
    align-items: center;
    * {
      margin-right: 4px;
    }
  }
`;

export default UserCurationDataDetail;
