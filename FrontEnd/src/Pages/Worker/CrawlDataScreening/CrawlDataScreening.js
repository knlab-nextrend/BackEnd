import React from "react";
import styled from "styled-components";
import { AiOutlineCheck } from "react-icons/ai";
import { BsEye } from "react-icons/bs";

import Pagination from "Components/Pagination";
import NoData from "Components/NoData";
import DataFilter from "Components/DataFilter";
import DataTable from "Components/DataTable";
import { WorkerContentHeader } from "Components/WorkerContentHeader";
import { SearchResultCount } from "Components/SearchResultCount";
import { Tab } from "Components/Tab";

function CrawlDataScreening({
  dcCount,
  listSize,
  setListSize,
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
}) {
  const _listSizeHandler = (e) => {
    setListSize(e.target.value);
  };
  return (
    <Wrap>
      <WorkerContentHeader title="크롤 데이터 스크리닝" Icon={BsEye} />
      <Content>
        <SearchResultCount count={dcCount} />
        <RowContainer>
          <Row>
            <div className="action-group">
              <ScreeningButton
                className="screening-button"
                onClick={stageScreeningData}
              >
                <AiOutlineCheck />
                스크리닝 완료
              </ScreeningButton>
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
            <DataFilter type={"screening"} dataFilterFetch={dataFilterFetch} />
          </Row>
        </RowContainer>
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
        {screeningData.length !== 0 ? (
          <>
            <DataTable
              tableData={screeningData}
              stageDataList={stageDataList}
              keepDataList={keepDataList}
              deleteDataList={deleteDataList}
              onChangeCheckedAll={onChangeCheckedAll}
              checkedAll={checkedAll}
              onChangeEach={onChangeEach}
              type="screening"
            />
            <BottomWrap>
              <ScreeningButton
                className="screening-button"
                onClick={stageScreeningData}
              >
                <AiOutlineCheck />
                스크리닝 완료
              </ScreeningButton>
            </BottomWrap>

            <Pagination
              dcCount={dcCount}
              listSize={listSize}
              pageNo={pageNo}
              setPageNo={setPageNo}
            />
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

const ScreeningButton = styled.button`
  margin: 0 0.5rem 0 0.5rem;
  padding: 0.5rem;
  color: white;
  font-weight: bold;
  background-color: #435269;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;
const BottomWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: right;
  margin-top: 1rem;
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

export default CrawlDataScreening;
