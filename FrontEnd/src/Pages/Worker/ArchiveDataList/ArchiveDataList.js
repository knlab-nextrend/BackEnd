import React from "react";
import styled from "styled-components";
import { CgFileDocument } from "react-icons/cg";
import { BsInboxes } from "react-icons/bs";

import Pagination from "Components/Pagination";
import DataFilter from "Components/DataFilter";
import DataTable from "Components/DataTable";
import { WorkerContentHeader } from "Components/WorkerContentHeader";
import { SearchResultCount } from "Components/SearchResultCount";
import { Tab } from "Components/Tab";

function ArchiveDataList({
  archiveDataList,
  statusCode,
  dcCount,
  onChangeListSize,
  listSize,
  pageNo,
  setPageNo,
  dataFilterFetch,
  selectedTab,
  onClickTab,
}) {
  return (
    <Wrap>
      <WorkerContentHeader title="아카이브" Icon={BsInboxes} />
      <Content>
        <SearchResultCount count={dcCount} />
        <RowContainer>
          <Row></Row>
          <Row>
            <DataFilter dataFilterFetch={dataFilterFetch} type="archive" />
          </Row>
        </RowContainer>
        <RowWrap justify="space-between">
          <Tab>
            <Tab.Item
              label="아카이브 문서"
              selected={selectedTab === "아카이브 문서"}
              onClick={() => onClickTab("아카이브 문서")}
            />
            <Tab.Item
              label="큐레이션 선정 문서"
              onClick={() => onClickTab("큐레이션 선정 문서")}
              selected={selectedTab === "큐레이션 선정 문서"}
            />
          </Tab>
          <select
            className="list-size"
            value={listSize}
            onChange={(e) => onChangeListSize(e)}
          >
            <option disabled>리스트 사이즈</option>
            <option value={2}>2건</option>
            <option value={10}>10건</option>
            <option value={30}>30건</option>
            <option value={50}>50건</option>
            <option value={75}>75건</option>
            <option value={100}>100건</option>
          </select>
        </RowWrap>
        {archiveDataList.length !== 0 ? (
          <>
            <DataTable
              type="archive"
              tableData={archiveDataList}
              statusCode={statusCode}
            />
            <PaginationWrap>
              <Pagination
                dcCount={dcCount}
                listSize={listSize}
                pageNo={pageNo}
                setPageNo={setPageNo}
              />
            </PaginationWrap>
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

const RowWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${(props) => props.justify};
  gap: ${(props) => props.gap};
  width: 100%;
  margin-top: 1rem;

  .list-size {
    padding: 0.5rem;
    border: solid 1px #d6d6d6;
    font-size: 1rem;
  }
`;

const PaginationWrap = styled.div`
  margin-top: 1.5rem;
`;

export default ArchiveDataList;
