import React from "react";
import styled from "styled-components";
import { AiOutlineCheck } from "react-icons/ai";
import { BsEye } from "react-icons/bs";

import Pagination from "Components/Pagination";
import NoData from "Components/NoData";
import DataFilter from "Components/DataFilter";
import { WorkerContentHeader } from "Components/WorkerContentHeader";
import { SearchResultCount } from "Components/SearchResultCount";
import { Tab } from "Components/Tab";
import { myColors } from "styles/colors";
import { ScreeningTable } from "./_table";

function CrawlDataScreening({
  dcCount,
  listSize,
  onChangeListSize,
  pageNo,
  setPageNo,
  screeningData,
  stageScreeningData,
  stageDataList,
  keepDataList,
  deleteDataList,
  onChangeCheckedAll,
  checkedAll,
  onChangeEach,
  selectedTab,
  onClickTab,
  dataFilterFetch,
  sort,
  sortState,
}) {
  return (
    <Wrap>
      <WorkerContentHeader title="크롤 데이터 스크리닝" Icon={BsEye} />
      <Content>
        <SearchResultCount count={dcCount} />
        <RowContainer>
          <Row>
            <DataFilter type={"screening"} dataFilterFetch={dataFilterFetch} />
          </Row>
        </RowContainer>
        <RowWrap justify="space-between">
          <Tab>
            <Tab.Item
              label="대기"
              selected={selectedTab === "스크리닝 대기"}
              onClick={() => onClickTab("스크리닝 대기")}
            />
            <Tab.Item
              label="보류"
              selected={selectedTab === "스크리닝 보류"}
              onClick={() => onClickTab("스크리닝 보류")}
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
        {screeningData.length !== 0 ? (
          <>
            <ScreeningTable
              screeningData={screeningData}
              stageDataList={stageDataList}
              keepDataList={keepDataList}
              deleteDataList={deleteDataList}
              onChangeCheckedAll={onChangeCheckedAll}
              checkedAll={checkedAll}
              onChangeEach={onChangeEach}
              sort={sort}
              sortState={sortState}
            />
            <BottomWrap>
              <ScreeningButton onClick={stageScreeningData}>
                <AiOutlineCheck />
                스크리닝 완료
              </ScreeningButton>
              <Pagination
                dcCount={dcCount}
                listSize={listSize}
                pageNo={pageNo}
                setPageNo={setPageNo}
              />
            </BottomWrap>
          </>
        ) : (
          <NoData />
        )}
      </Content>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-width: 52rem;
  padding: 1.5rem 3rem;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  font-size: 14px;
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

const BottomWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 1rem;
`;

const ScreeningButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background-color: ${myColors.blue500};
  color: white;
  font-weight: bold;
  cursor: pointer;
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
`;

export default CrawlDataScreening;
