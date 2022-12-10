import React from "react";
import styled from "styled-components";
import Pagination from "Components/Pagination";
import NoData from "Components/NoData";
import { SearchResultCount } from "Components/SearchResultCount";
import { myColors, tailwindColors } from "styles/colors";
import { toYYMMDD_DOT } from "Utils/time";

function UserArchiveDataList({
  dcCount,
  listSize,
  pageNo,
  setPageNo,
  listSizeHandler,
  archiveData,
  curationRequest,
}) {
  return (
    <Wrap>
      <SearchResultCount count={dcCount} />
      {archiveData.length === 0 ? (
        <NoData />
      ) : (
        <>
          <ActionGroup>
            <select className="list-size" onChange={listSizeHandler}>
              <option disabled>리스트 사이즈</option>
              <option value={10}>10건</option>
              <option value={30}>30건</option>
              <option value={50}>50건</option>
            </select>
          </ActionGroup>
          <ArchiveDataTable>
            <colgroup>
              <col />
              <col />
              <col />
              <col />
              <col />
              <col />
              <col />
            </colgroup>
            <thead>
              <tr>
                <th>순번</th>
                <th>대상 국가</th>
                <th>원문 제목</th>
                <th>발행기관 명</th>
                <th>원문 발행일</th>
                <th>페이지 수</th>
                <th>큐레이션 신청</th>
              </tr>
            </thead>
            <tbody>
              {archiveData.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{listSize * (pageNo - 1) + index + 1}</td>
                    <td className="country-list">{item.doc_country_list}</td>
                    <td className="origin-title">
                      <a href={item.doc_url} rel="noreferrer" target="_blank">
                        {item.doc_origin_title}
                      </a>
                    </td>
                    <td className="publisher">{item.doc_publisher}</td>
                    <td className="publish-date">
                      {toYYMMDD_DOT(item.doc_publish_date)}
                    </td>
                    <td className="page">
                      {item.doc_page && `${item.doc_page}p`}
                    </td>
                    <td className="curation-request">
                      {item.status === 6 ? (
                        <button
                          onClick={() => {
                            curationRequest(item._id);
                          }}
                        >
                          신청하기
                        </button>
                      ) : (
                        <div>신청완료</div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </ArchiveDataTable>
          <PaginationWrap>
            <Pagination
              dcCount={dcCount}
              listSize={listSize}
              pageNo={pageNo}
              setPageNo={setPageNo}
            />
          </PaginationWrap>
        </>
      )}
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 1024px;
  width: 100%;
  padding: 1.5rem 3rem;
`;

const ActionGroup = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 0.5rem;
  & select {
    padding: 0.5rem;
    margin-left: auto;
    border: solid 1px #d6d6d6;
  }
`;

const ArchiveDataTable = styled.table`
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  text-align: center;
  font-size: 14px;

  col {
    :nth-of-type(1) {
      width: 4.5rem;
    }
    :nth-of-type(2) {
      width: 15%;
    }
    :nth-of-type(3) {
      width: 40%;
    }
    :nth-of-type(4) {
      width: 20%;
    }
    :nth-of-type(5) {
      width: 6rem;
    }
    :nth-of-type(6) {
      width: 4.5rem;
    }
    :nth-of-type(7) {
      width: 6rem;
    }
  }

  thead {
    border-bottom: 1px solid ${tailwindColors["grey-400"]};
    background-color: ${tailwindColors["grey-100"]};
    font-weight: bold;
    text-align: center;
    white-space: nowrap;

    th {
      padding: 0.5rem;
    }
  }
  & tbody {
    width: 100%;

    tr {
      width: 100%;
      height: 2.5rem;
      border-bottom: 1px solid ${tailwindColors["grey-400"]};
      background-color: ${tailwindColors.white};

      td {
        padding: 0.3rem;

        &.country-list {
        }
        &.origin-title {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

          a:hover {
            color: ${myColors.blue500};
            text-decoration: underline;
          }
        }
        &.publisher {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        &.publish-date {
        }
        &.page {
          min-width: 4.5rem;
        }
        &.curation-request {
          & > * {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            width: max-content;
            margin: 0 auto;
            padding: 0.2rem 0.5rem;
            font-weight: bold;
            white-space: nowrap;
          }

          & > button {
            border: solid 1px ${tailwindColors["grey-400"]};
            &:hover {
              cursor: pointer;
              background-color: ${tailwindColors["grey-200"]};
            }
          }

          & > div {
            background-color: ${myColors.green300};
            color: ${tailwindColors.white};
          }
        }
      }
    }
  }
`;

const PaginationWrap = styled.div`
  margin-top: 1.5rem;
`;

export default UserArchiveDataList;
