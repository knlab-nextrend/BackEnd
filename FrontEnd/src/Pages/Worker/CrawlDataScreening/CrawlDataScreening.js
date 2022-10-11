import React from "react";
import FormHeader from "../../../Components/FormHeader";
import styled from "styled-components";
import Pagination from "../../../Components/Pagination";
import NoData from "../../../Components/NoData";
import { AiOutlineCheck } from "react-icons/ai";
import { HiOutlineDocumentSearch } from "react-icons/hi";
import DataFilter from "../../../Components/DataFilter";
import DataTable from "../../../Components/DataTable";
import ToggleButton from "../../../Components/ToggleButton";
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
  isKeep,
  onChangeKeepToggle,
  dataFilterFetch,
}) {
  const _listSizeHandler = (e) => {
    setListSize(e.target.value);
  };
  return (
    <>
      <FormHeader type="view" title={"크롤데이터 스크리닝 진행"} />
      <Wrapper>
        <RowContainer>
          <Row>
            <div className="result-count">
              <HiOutlineDocumentSearch />
              검색 결과 ({dcCount}건)
            </div>
            <div className="action-group">
              <ToggleButton
                mode1={"스크리닝 대기"}
                mode2={"스크리닝 보류"}
                action={onChangeKeepToggle}
                checked={isKeep}
              />
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
      </Wrapper>
    </>
  );
}
const Wrapper = styled.div`
  margin: 0 5rem 5rem 5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
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
