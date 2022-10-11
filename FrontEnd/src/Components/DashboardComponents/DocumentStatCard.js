import React from "react";
import styled from "styled-components";

function DocumentStatCard({ countryDocumentData }) {
  return (
    <CardWrapper>
      <div className="title">
        {countryDocumentData === null ? (
          <div className="title-main">국가를 지도에서 선택해주세요!</div>
        ) : (
          <>
            <div className="title-main">{countryDocumentData.country}</div>
            <div className="title-sub">의 문서 현황입니다.</div>
          </>
        )}
      </div>
      {countryDocumentData === null ? (
          <div className="stat-list">표시할 값이 없습니다.</div>
        ) : (
          <div className="stat-list">
          <div className="stat">
            <div className="stat-title">수집 문서 수</div>
            <div className="stat-count">{countryDocumentData.data.collect}</div>
          </div>
          <div className="stat">
            <div className="stat-title">스크리닝 완료 (정제) 문서 수</div>
            <div className="stat-count">{countryDocumentData.data.screening}</div>
          </div>
          <div className="stat">
            <div className="stat-title">정제 완료 (등록) 문서 수</div>
            <div className="stat-count">{countryDocumentData.data.refine}</div>
          </div>
          <div className="stat">
            <div className="stat-title">등록 완료 (아카이브) 문서 수</div>
            <div className="stat-count">{countryDocumentData.data.register}</div>
          </div>
          <div className="stat">
            <div className="stat-title">큐레이션 완료 (큐레이션) 문서 수</div>
            <div className="stat-count">{countryDocumentData.data.curation}</div>
          </div>
        </div>
        )}

     
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
  .stat {
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .stat-title {
      font-size: 14px;
    }
    .stat-count {
      font-size: 20px;
      font-weight: bold;
      color: #435269;
    }
  }
  .stat-list {
    padding: 1rem;
    min-height:10rem;
  }
`;
export default DocumentStatCard;
