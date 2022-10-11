import React, { useEffect } from "react";
import styled from "styled-components";
import { HiOutlineDocumentSearch } from "react-icons/hi";
import Pagination from "../../../Components/Pagination";
import NoData from "../../../Components/NoData";
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
    <Wrapper>
      {archiveData.length === 0 ? (
        <NoData />
      ) : (
        <>
          {" "}
          <RowContainer>
            <Row>
              <div className="result-count">
                <HiOutlineDocumentSearch />
                검색 결과 ({dcCount}건)
              </div>
              <div className="action-group">
                <select className="list-size" onChange={listSizeHandler}>
                  <option disabled>리스트 사이즈</option>
                  <option value={10}>10건</option>
                  <option value={30}>30건</option>
                  <option value={50}>50건</option>
                </select>
              </div>
            </Row>
          </RowContainer>
          <ArchiveDataTable>
            <colgroup>
              <col style={{ width: "10%" }} />
              <col style={{ width: "40%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "10%" }} />
            </colgroup>
            <thead>
              <tr>
                <th>순번</th>
                <th>원문 제목</th>
                <th>발행 기관명</th>
                <th>원문 발행일</th>
                <th>페이지 수</th>
                <th>큐레이션 선정</th>
              </tr>
            </thead>
            <tbody>
              {archiveData.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{index+1}</td>
                    <td>
                      <a href={item.doc_url} target="_blank">
                        {item.doc_origin_title}
                      </a>
                    </td>
                    <td></td>
                    <td>{item.doc_publish_date}</td>
                    <td>{item.doc_page}</td>
                    <td>{item.status===6?<button onClick={()=>{curationRequest(item._id)}}>큐레이션 신청</button>:<Badge>큐레이션 신청됨</Badge>}</td>
                  </tr>
                );
              })}
            </tbody>
          </ArchiveDataTable>
          <Pagination
            dcCount={dcCount}
            listSize={listSize}
            pageNo={pageNo}
            setPageNo={setPageNo}
          />
        </>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;
const ArchiveDataTable = styled.table`
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  text-align: left;
  font-size: 14px;
  color: rgb(59, 59, 59);
  th {
    color: #323d4d;
    background-color: #d8dee6;
  }
  th,
  td {
    border-bottom: 1px solid #d6d6d6;
    padding: 10px;
    a {
      color: rgb(59, 59, 59);
      text-decoration: none;
    }
    a:hover {
      color: #009999;
      text-decoration: underline;
    }
  }

  tr:first-child,
  tr:last-child {
    border: none;
  }
  input[type="text"] {
    width: 100%;
  }
  button{
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border: solid 1px rgba(0,0,0,0.1);
    border-radius: 4px;
    text-align:center;
    &:hover{
      cursor: pointer;
      background-color:#d6d6d6;
    }
  }
`;

const RowContainer = styled.div`
  border: solid 1px #d6d6d6;
  margin-top: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  width: 100%;
`;
const Row = styled.div`
  display: flex;
  color: rgb(59, 59, 59);
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: solid 1px #d6d6d6;
  &:last-child {
    border: none;
  }
  .result-count {
    font-size: 16px;
    font-weight: bold;
    * {
      padding-right: 0.5rem;
    }
  }
  .action-group {
    display: flex;
  }
  .list-size {
    margin: 0 0.5rem 0 0.5rem;
    padding: 0.5rem;
    border: solid 1px #d6d6d6;
  }
`;
const Badge = styled.div`
  background-color:rgba(67,82,105,0.5);
  font-weight: bold;
  color: rgba(67,82,105,1);
  border-radius: 2px;
  padding: 2px;
  text-align:center;
`;
export default UserArchiveDataList;
