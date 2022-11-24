import React from "react";
import styled from "styled-components";
import { AiOutlineLink } from "react-icons/ai";
import { BsGear, BsImage, BsJournal } from "react-icons/bs";
import Editor from "Components/Editor";
import { WorkerContentHeader } from "Components/WorkerContentHeader";
import { myColors, tailwindColors } from "styles/colors";
import { PERMISSON_DATA } from "Data/permission";
import { toYYYYMMDD_DOT } from "Utils/time";

function CurationDataDetail({ docs, permission, goDataManage }) {
  return (
    <Wrap>
      <WorkerContentHeader title="큐레이션 상세 조회" Icon={BsJournal}>
        {PERMISSON_DATA[permission] === "관리자" && (
          <EditButton onClick={goDataManage}>
            <BsGear />
            <span>편집</span>
          </EditButton>
        )}
      </WorkerContentHeader>
      <ArticleContainer>
        <ArticleHeader>
          <h3>{docs.doc_kor_title}</h3>
          <h4>{docs.doc_origin_title}</h4>
          {docs.doc_biblio && <p>{docs.doc_biblio}</p>}
        </ArticleHeader>

        <ArticleTopArea>
          <ThumbnailWrap>
            {docs.doc_thumbnail ? (
              <Image src={`http://${docs.doc_thumbnail}`} />
            ) : (
              <div>
                <BsImage size={64} />
              </div>
            )}
          </ThumbnailWrap>
          <ArticleInfoContainer>
            <div>
              <Info>
                <div className="title">
                  <span>•</span>
                  <span>원문 수집일 :</span>
                </div>
                <div className="content">
                  {valueOrDefaultValue(toYYYYMMDD_DOT(docs.doc_collect_date))}
                </div>
              </Info>
              <Info>
                <div className="title">
                  <span>•</span>
                  <span>원문 작성일 :</span>
                </div>
                <div className="content">
                  {valueOrDefaultValue(toYYYYMMDD_DOT(docs.doc_write_date))}
                </div>
              </Info>
              <Info>
                <div className="title">
                  <span>•</span>
                  <span>원문 발행일 :</span>
                </div>
                <div className="content">
                  {valueOrDefaultValue(toYYYYMMDD_DOT(docs.doc_publish_date))}
                </div>
              </Info>
              <Info>
                <div className="title">
                  <span>•</span>
                  <span>문서 서비스 등록일 :</span>
                </div>
                <div className="content">
                  {valueOrDefaultValue(toYYYYMMDD_DOT(docs.doc_publish_date))}
                </div>
              </Info>
              <Info>
                <div className="title">
                  <span>•</span>
                  <span>문서 언어 :</span>
                </div>
                <div className="content">
                  {valueOrDefaultValue(docs.doc_language_list)}
                </div>
              </Info>
              <Info>
                <div className="title">
                  <span>•</span>
                  <span>기관 명 :</span>
                </div>
                <div className="content">
                  {valueOrDefaultValue(docs.doc_publisher)}
                </div>
              </Info>
              <Info>
                <div className="title">
                  <span>•</span>
                  <span>발행 HOST :</span>
                </div>
                <div className="content">
                  {valueOrDefaultValue(docs.doc_host)}
                </div>
              </Info>
              <Info>
                <div className="title">
                  <span>•</span>
                  <span>발행 면수 :</span>
                </div>
                <div className="content">
                  {valueOrDefaultValue(docs.doc_page)}
                </div>
              </Info>
            </div>
            <div>
              <Info>
                <div className="title">
                  <span>•</span>
                  <span>대상 국가 :</span>
                </div>
                <div className="content">
                  {valueOrDefaultValue(docs.doc_country_list)}
                </div>
              </Info>
              <Info>
                <div className="title">
                  <span>•</span>
                  <span>정책 분류 :</span>
                </div>
                <div className="content">
                  {valueOrDefaultValue(docs.doc_category_list)}
                </div>
              </Info>
              <Info>
                <div className="title">
                  <span>•</span>
                  <span>문서 유형 분류 :</span>
                </div>
                <div className="content">
                  {valueOrDefaultValue(docs.doc_content_type_list)}
                </div>
              </Info>
              <Info>
                <div className="title">
                  <span>•</span>
                  <span>내용 구분 분류 :</span>
                </div>
                <div className="content">
                  {valueOrDefaultValue(docs.doc_content_category_list)}
                </div>
              </Info>
              <Info>
                <div className="title">
                  <span>•</span>
                  <span>문서 토픽 분류 :</span>
                </div>
                <div className="content">
                  {valueOrDefaultValue(docs.doc_topic_list)}
                </div>
              </Info>

              <Info>
                <div className="title">
                  <span>•</span>
                  <span>조사 과제 명 :</span>
                </div>
                <div className="content">
                  {valueOrDefaultValue(docs.doc_project)}
                </div>
              </Info>
              <Info>
                <div className="title">
                  <span>•</span>
                  <span>세부과업명 :</span>
                </div>
                <div className="content">
                  {valueOrDefaultValue(docs.doc_publishing)}
                </div>
              </Info>
              <Info>
                <div className="title">
                  <span>•</span>
                  <span>큐레이션 추천문서 :</span>
                </div>
                <div className="content">
                  {valueOrDefaultValue(docs.doc_recomment)}
                </div>
              </Info>
            </div>
          </ArticleInfoContainer>
        </ArticleTopArea>
        <LinkContainer>
          <LinkButton
            title={!docs.doc_url && "원문이 없습니다"}
            className="origin"
            disabled={!docs.doc_url}
            onClick={() => window.open(docs.doc_url)}
          >
            원문보기
          </LinkButton>
          <LinkButton
            title={!docs.doc_url_intro && "원문안내가 없습니다"}
            className="origin-intro"
            disabled={!docs.doc_url_intro}
            onClick={() => window.open(docs.doc_url_intro)}
          >
            원문안내
          </LinkButton>
        </LinkContainer>
        <KeywordContainer>
          <div className="title">키워드</div>
          <div className="contents">
            {docs.doc_keyword &&
              docs.doc_keyword.map((item, index) => {
                return (
                  <div className="badge" key={index}>
                    {item}
                  </div>
                );
              })}
          </div>
        </KeywordContainer>
        <ContentContainer>
          <ContentRow>
            <div className="title">연관문서</div>
            {docs.doc_relate_title && docs.doc_relate_url ? (
              <div className="contents">
                <a target="_blank" rel="noreferrer" href={docs.doc_relate_url}>
                  <AiOutlineLink />
                  {docs.doc_relate_title}
                </a>
              </div>
            ) : (
              "연관문서 없음"
            )}
          </ContentRow>
          <ContentRow>
            <div className="title">묶음문서 이동</div>

            {docs.doc_bundle_title && docs.doc_bundle_url ? (
              <div className="contents">
                <a target="_blank" rel="noreferrer" href={docs.doc_bundle_url}>
                  <AiOutlineLink />
                  {docs.doc_bundle_title}
                </a>
              </div>
            ) : (
              "묶음문서 없음"
            )}
          </ContentRow>
          <ContentRow>
            <div className="title">한글 요약</div>
            <div className="contents">{docs.doc_kor_summary}</div>
          </ContentRow>
          <ContentRow>
            <div className="title">원문 요약</div>
            <div className="contents">{docs.doc_origin_summary}</div>
          </ContentRow>
          <ContentRow>
            <div className="title">본문내용</div>
          </ContentRow>
          <ContentRow>
            <Editor readOnly={true} data={docs.doc_content} />
          </ContentRow>
        </ContentContainer>
      </ArticleContainer>
    </Wrap>
  );
}

const valueOrDefaultValue = (value) => {
  return value ? value : "-";
};

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 1.5rem 3rem;
`;

const EditButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.5rem 1rem;
  background-color: ${myColors.blue500};
  color: ${tailwindColors.white};
  cursor: pointer;
`;

const ArticleContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 3rem;
`;
const ArticleTopArea = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 3rem;
  width: 100%;
  margin-bottom: 4rem;
`;

const ThumbnailWrap = styled.div`
  display: flex;
  align-items: center;
  max-width: 12rem;
  width: 100%;
  overflow: hidden;

  & > div {
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 12rem;
    width: 100%;
    height: 16rem;
    background-color: ${tailwindColors["grey-100"]};
    color: ${tailwindColors["grey-600"]};
  }
`;
const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;
const ArticleHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-bottom: 1.5rem;

  & h3 {
    font-size: 2rem;
    color: ${tailwindColors.black};
    font-weight: bold;
  }

  & h4 {
    color: ${tailwindColors["grey-700"]};
  }

  & p {
    color: ${tailwindColors.black};
    width: 100%;
  }
`;

const ArticleInfoContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-grow: 1;

  & > div {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 50%;
  }
`;

const Info = styled.div`
  display: flex;
  gap: 0.5rem;
  font-size: 14px;
  white-space: nowrap;
  .title {
    display: flex;
    gap: 0.2rem;
    font-weight: bold;
  }
`;

const LinkContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 3rem;
`;

const LinkButton = styled.button`
  height: 3rem;
  padding: 0.5rem 1.5rem;
  background-color: ${tailwindColors.white};
  font-weight: bold;

  &.origin {
    background-color: ${myColors.blue500};
    color: ${tailwindColors.white};
  }

  &.origin-intro {
    background-color: ${tailwindColors["grey-300"]};
  }

  &.relate {
    border: 1px solid ${tailwindColors["grey-700"]};
  }

  &.bundle {
    border: 1px solid ${tailwindColors["grey-700"]};
  }

  &:disabled {
    opacity: 0.2;
    cursor: not-allowed;
  }
`;

const KeywordContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 3rem;

  .title {
    color: ${tailwindColors.black};
    font-size: 1.2rem;
    font-weight: bold;
  }
  .contents {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    row-gap: 0.5rem;
    column-gap: 0.625rem;
  }
  .badge {
    height: 2.4rem;
    padding: 0.5rem 2rem;
    border-radius: 1.25rem;
    background-color: ${tailwindColors["grey-200"]};
    font-size: 14px;
    font-weight: bold;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ContentRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: ${tailwindColors.black};

  .title {
    width: 100%;
    font-weight: bold;
    font-size: 1.2rem;
    padding: 0.5rem 0;
    :not(div:last-of-type) {
      border-bottom: 1px solid ${tailwindColors["grey-300"]};
    }
  }
  .contents {
    display: flex;
    align-content: space-around;
    flex-wrap: wrap;

    a {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      :hover {
        text-decoration: underline;
      }
    }
  }
`;

export default CurationDataDetail;
