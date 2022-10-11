import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import CrawlDataCard from "../../../Components/LegacyComponents/CrawlDataCard";
import FormHeader from "../../../Components/FormHeader";
import Pagination from "../../../Components/Pagination";
import Tab from "../../../Components/LegacyComponents/Tab";
import NoData from "../../../Components/NoData";
import DataFilter from "../../../Components/DataFilter";
import { HiOutlineDocumentSearch } from "react-icons/hi";
import ToggleButton from "../../../Components/ToggleButton";
import DataTable from "../../../Components/DataTable";
function CrawlDataList({
  statusCode,
  dcCount,
  setListSize,
  listSize,
  pageNo,
  setPageNo,
  crawlDataList,
  STATUS_CODE_SET,
  onChangeKeepToggle,
  isKeep,
  dataFilterFetch,
}) {
  const _listSizeHandler = (e) => {
    setListSize(e.target.value);
  };
  return (
    <>
      <FormHeader type="view" title={STATUS_CODE_SET[statusCode].mainTitle} />
      <Wrapper>
        <RowContainer>
          <Row>
            <div className="result-count">
              <HiOutlineDocumentSearch />
              검색 결과 ({dcCount}건)
            </div>
            <div className="action-group">
              <ToggleButton
                mode1={"대기"}
                mode2={"보류"}
                action={onChangeKeepToggle}
                checked={isKeep}
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
            <DataFilter
              type={STATUS_CODE_SET[statusCode].type}
              dataFilterFetch={dataFilterFetch}
            />
          </Row>
        </RowContainer>
        {crawlDataList.length !== 0 ? (
          <>
            <SearchResult>
              <DataTable
                tableData={crawlDataList}
                type={STATUS_CODE_SET[statusCode].type}
                statusCode={statusCode}
              />
            </SearchResult>
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

/* status에 따라 라우팅을... 다르게 해야하네요 ㅎ; */

const CustomLink = styled(Link)`
  color: black;
  &:link {
    text-decoration: none;
  }
  &:visited {
    text-decoration: none;
  }
  &:hover {
    text-decoration: none;
  }
`;
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 5rem 0 5rem;
`;
const SearchResultTitle = styled.div`
  width: 100%;
  p {
    &:nth-child(1) {
      font-size: 20px;
      font-weight: bold;
    }
    &:nth-child(2) {
      font-size: 14px;
    }
  }
`;
const SearchResult = styled.div`
  width: 100%;
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

export default CrawlDataList;
