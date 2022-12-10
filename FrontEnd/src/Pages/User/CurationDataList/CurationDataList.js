import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { HiOutlineDocumentSearch } from "react-icons/hi";

import Pagination from "Components/Pagination";
import CurationDataCard from "Components/CurationDataCard";
import CurationDataCard2 from "Components/CurationDataCard2";
import NoData from "Components/NoData";
import { myColors } from "styles/colors";

import { CurationTable } from "./_CurationTable";
import { CurationSearch } from "./_Search";
import { CategorySelect } from "../CategorySelect";

function UserCurationDataList({
  curationDataList,
  dcCount,
  listSize,
  pageNo,
  setPageNo,
  viewType,
  viewTypeHandler,
  handleRowClick,
  userInfo,
  onChangeListSize,
  setSearchInput,
  onSearch,
  axisMenu,
  axisObj,
  selectedMenu,
  menuClickHandler,
}) {
  const onSubmitSearch = (e) => {
    e.preventDefault();
    onSearch();
  };

  const onChangeSearch = (e) => {
    setSearchInput(e.target.value);
  };

  return (
    <Wrap>
      <ResultWrap>
        <HiOutlineDocumentSearch />
        <span> 검색 결과</span> <span>({dcCount}건)</span>
        {/* <ViewType>
          <input
            onChange={viewTypeHandler}
            type="radio"
            value="card1"
            id="card1"
            name="view-type"
            checked={viewType === "card1"}
          />
          <label htmlFor="card1">
            <MdCalendarViewDay />
            카드형1
          </label>
          <input
            onChange={viewTypeHandler}
            type="radio"
            value="card2"
            id="card2"
            name="view-type"
            checked={viewType === "card2"}
          />
          <label htmlFor="card2">
            <MdCalendarViewDay />
            카드형2
          </label>
          <input
            onChange={viewTypeHandler}
            type="radio"
            value="list"
            id="list"
            name="view-type"
            checked={viewType === "list"}
          />
          <label htmlFor="list">
            <RiFileList2Line />
            목록형
          </label>
        </ViewType> */}
      </ResultWrap>

      <CagetorySelectWrap>
        <CategorySelect
          axisObj={axisObj}
          axisMenu={axisMenu}
          selectedMenu={selectedMenu}
          menuClickHandler={menuClickHandler}
        />
      </CagetorySelectWrap>
      <CurationSearch
        onChangeSearchInput={onChangeSearch}
        onSubmitSearch={onSubmitSearch}
      />
      <RowWrap justify="flex-end">
        <select
          className="list-size"
          value={listSize}
          onChange={onChangeListSize}
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
      {curationDataList.length !== 0 ? (
        <>
          {viewType === "list" && (
            <CurationTable
              curationData={curationDataList}
              handleRowClick={handleRowClick}
            />
          )}
          {viewType === "card1" && (
            <CurationCard1Wrapper>
              {curationDataList.map((item, index) => {
                return (
                  <CustomLink
                    to={`/${
                      userInfo.permission !== 0 ? "curation" : "library"
                    }/${item._id}`}
                  >
                    <CurationDataCard
                      curationDataItem={item}
                    ></CurationDataCard>
                  </CustomLink>
                );
              })}
            </CurationCard1Wrapper>
          )}
          {viewType === "card2" && (
            <CurationCard2Wrapper>
              {curationDataList.map((item, index) => {
                return (
                  <CustomLink
                    to={`/${
                      userInfo.permission !== 0 ? "curation" : "library"
                    }/${item._id}`}
                  >
                    <CurationDataCard2
                      curationDataItem={item}
                    ></CurationDataCard2>
                  </CustomLink>
                );
              })}
            </CurationCard2Wrapper>
          )}
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
        <NoData />
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

const ViewType = styled.div`
  display: flex;
  font-size: 14px;
  margin-left: auto;

  input[type="radio"] {
    display: none;
    &:checked + label {
      color: white;
      font-weight: bold;
      background-color: ${myColors.blue500};
    }
  }
  label {
    display: flex;
    align-items: center;
    gap: 0.2rem;
    padding: 0.25rem 1rem;
    cursor: pointer;
  }
`;

const CagetorySelectWrap = styled.div`
  margin-bottom: 1rem;
`;

const RowWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${(props) => props.justify};
  gap: ${(props) => props.gap};
  width: 100%;
  padding: 1rem 0 0.5rem;

  .list-size {
    padding: 0.5rem;
    border: solid 1px #d6d6d6;
  }
`;

const CurationCard1Wrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
`;
const CurationCard2Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const CustomLink = styled(Link)`
  text-decoration: none;
  color: black;
`;

const PaginationWrap = styled.div`
  margin-top: 1.5rem;
`;

export default UserCurationDataList;
