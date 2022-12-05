import React from "react";
import styled from "styled-components";
import { HiOutlineDocumentSearch } from "react-icons/hi";
import Pagination from "../../../Components/Pagination";
import NoData from "../../../Components/NoData";
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
      <ResultWrap>
        <HiOutlineDocumentSearch />
        <span> 검색 결과</span> <span>({dcCount}건)</span>
      </ResultWrap>

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
              <col style={{ width: "10%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "30%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "10%" }} />
            </colgroup>
            <thead>
              <tr>
                <th>순번</th>
                <th>대상 국가</th>
                <th>원문 제목</th>
                <th>발행기관 명</th>
                <th>원문 발행일</th>
                <th>페이지 수</th>
                <th>큐레이션 선정</th>
              </tr>
            </thead>
            <tbody>
              {archiveData.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.doc_country_list}</td>
                    <td>
                      <a href={item.doc_url} target="_blank">
                        {item.doc_origin_title}
                      </a>
                    </td>
                    <td>{item.doc_publisher}</td>
                    <td>{toYYMMDD_DOT(item.doc_publish_date)}</td>
                    <td>{item.doc_page}</td>
                    <td>
                      {item.status === 6 ? (
                        <button
                          onClick={() => {
                            curationRequest(item._id);
                          }}
                        >
                          큐레이션 신청
                        </button>
                      ) : (
                        <Badge>큐레이션 신청됨</Badge>
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

const ResultWrap = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 1rem 0;
  font-size: 1.5rem;
  font-weight: bold;
  white-space: nowrap;

  & > span:nth-of-type(2) {
    color: ${myColors.red};
  }
`;

const ArchiveDataTable = styled.table`
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  text-align: center;
  font-size: 14px;

  thead {
    border-bottom: 1px solid ${tailwindColors["grey-400"]};
    background-color: ${tailwindColors["grey-100"]};
    font-weight: bold;
    text-align: center;
    white-space: nowrap;
  }

  th,
  td {
    padding: 0.5rem;
    word-break: break-all;
  }

  & tbody {
    width: 100%;

    tr {
      width: 100%;
      height: 2.5rem;
      border-bottom: 1px solid ${tailwindColors["grey-400"]};
      background-color: ${tailwindColors.white};
    }
  }

  th,
  td {
    border-bottom: 1px solid #d6d6d6;
    padding: 10px;
    a {
    }
    a:hover {
      color: ${myColors.blue500};
      text-decoration: underline;
    }
  }

  button {
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border: solid 1px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    text-align: center;
    &:hover {
      cursor: pointer;
      background-color: #d6d6d6;
    }
  }
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

const Badge = styled.div`
  background-color: ${myColors.green300};
  font-weight: bold;
  color: ${tailwindColors.white};
  padding: 2px;
  text-align: center;
`;

const PaginationWrap = styled.div`
  margin-top: 1.5rem;
`;
export default UserArchiveDataList;
