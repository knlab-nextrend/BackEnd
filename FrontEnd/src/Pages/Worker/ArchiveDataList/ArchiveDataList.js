import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { CgFileDocument } from "react-icons/cg";
import { BsInboxes } from "react-icons/bs";

import Pagination from "Components/Pagination";
import DataFilter from "Components/DataFilter";
import DataTable from "Components/DataTable";
import ToggleButton from "Components/ToggleButton";
import { WorkerContentHeader } from "Components/WorkerContentHeader";
import { SearchResultCount } from "Components/SearchResultCount";

function ArchiveDataList({
  archiveDataList,
  statusCode,
  dcCount,
  setListSize,
  listSize,
  pageNo,
  setPageNo,
  dataFilterFetch,
  onChangeRequestToggle,
  isRequest,
}) {
  const _listSizeHandler = (e) => {
    setListSize(e.target.value);
  };
  return (
    <Wrap>
      <WorkerContentHeader title="아카이브" Icon={BsInboxes} />
      <Content>
        <SearchResultCount count={dcCount} />
        <RowContainer>
          <Row>
            <div className="action-group">
              <ToggleButton
                mode1={"아카이브 문서"}
                mode2={"큐레이션 선정 문서"}
                action={onChangeRequestToggle}
                checked={isRequest}
              />
              <select
                className="list-size"
                value={listSize}
                onChange={_listSizeHandler}
              >
                <option disabled>리스트 사이즈</option>
                <option value={2}>2건</option>
                <option value={10}>10건</option>
                <option value={30}>30건</option>
                <option value={50}>50건</option>
                <option value={75}>75건</option>
                <option value={100}>100건</option>
              </select>
            </div>
          </Row>
          <Row>
            <DataFilter dataFilterFetch={dataFilterFetch} type="archive" />
          </Row>
        </RowContainer>
        {archiveDataList.length !== 0 ? (
          <>
            <DataTable
              type="archive"
              tableData={archiveDataList}
              statusCode={statusCode}
            />
            <Pagination
              dcCount={dcCount}
              listSize={listSize}
              pageNo={pageNo}
              setPageNo={setPageNo}
            />
          </>
        ) : (
          <>
            <SearchResultNotthingContainer>
              <CgFileDocument size="100" color="#d6d6d6" />
              <div className="comment">등록된 데이터가 없습니다.</div>
            </SearchResultNotthingContainer>
          </>
        )}
      </Content>
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

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  font-size: 14px;
`;

const SearchResultNotthingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 10rem;
  .comment {
    font-size: 30px;
    color: #d6d6d6;
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

const TableWrapper = styled.div`
  width: 100%;
  max-height: 65rem;
  overflow: auto;
  box-shadow: rgb(9 30 66 / 25%) 0px 1px 1px;
`;
const CustomTable = styled.table`
  width: 100%;
  text-align: center;
  border-collapse: collapse;
  tr {
    height: 3rem;
  }
  thead {
    border-bottom: solid 1px #d6d6d6;
    position: sticky;
    top: 0px;
    background-color: white;
  }
  tbody {
    tr:nth-child(2n) {
      background-color: #eee;
    }
    tr {
      &:hover {
        cursor: pointer;
        background-color: #d6d6d6;
      }
    }

    tr > td > span {
      margin: 0.2rem;
    }
  }
`;
const CustomLink = styled(Link)`
  color: black;
`;
const SearchResultTitle = styled.div`
  width: 100%;
  p {
    font-size: 20px;
    font-weight: bold;
  }
`;

export default ArchiveDataList;
