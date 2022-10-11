import React from "react";
import styled, { css } from "styled-components";
import CurationDataListContainer from "../../Common/CurationDataList/CurationDataListContainer";
import UserArchiveDataList from "./UserArchiveDataList";
import { HiOutlineArchive, HiOutlineDocumentDuplicate } from "react-icons/hi";
function UserOnlyDataLookUpPage({
  axisMenu,
  menuClickHandler,
  axisObj,
  dataMode,
  modeSwitchHandler,
  dcCount,
  listSize,
  listSizeHandler,
  pageNo,
  setPageNo,
  archiveData,
  curationRequest
}) {
  return (
    <Wrapper>
      <AxisTitle>전체</AxisTitle>
      <AxisMenuBar axis="X">
        {axisMenu.X.map((category, index) => {
          return (
            <div
              key={index}
              onClick={() => {
                menuClickHandler("X", category);
              }}
            >
              {category.ct_nm}
            </div>
          );
        })}
      </AxisMenuBar>
      <AxisMenuBar axis="Y">
        {axisMenu.Y.map((category, index) => {
          return (
            <div
              key={index}
              onClick={() => {
                menuClickHandler("Y", category);
              }}
            >
              {category.ct_nm}
            </div>
          );
        })}
      </AxisMenuBar>
      <ContentBody>
        {dataMode === "archive" ? (
          <UserArchiveDataList
            dcCount={dcCount}
            listSize={listSize}
            pageNo={pageNo}
            setPageNo={setPageNo}
            listSizeHandler={listSizeHandler}
            archiveData={archiveData}
            curationRequest={curationRequest}
          />
        ) : (
          <CurationDataListContainer
            className="list"
            axisObj={axisObj}
          />
        )}
      </ContentBody>
      <ModeSwitchButton onClick={modeSwitchHandler}>
        {dataMode === "archive" ? (
          <>
            <HiOutlineDocumentDuplicate size="18" />
            큐레이션 보기
          </>
        ) : (
          <>
            <HiOutlineArchive size="18" />
            아카이브 보기
          </>
        )}
      </ModeSwitchButton>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 200px auto;
  grid-template-rows: 50px minmax(1280px, auto);
`;
const ModeSwitchButton = styled.button`
  display: flex;
  position: fixed;
  align-items: center;
  justify-content: center;
  min-width: 10rem;
  height: 3rem;
  border: none;
  border-radius: 3rem;
  font-size: 14px;
  background-color: #435269;
  color: white;
  border: solid 1px #d6d6d6;
  box-shadow: 0 0 0.875rem 0 rgba(33, 37, 41, 0.05);
  z-index: 999;
  right: 3.5rem;
  bottom: 0;
  margin: 2rem;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background-color: #d8dee6;
    color: #435269;
    font-weight: bold;
  }
  & * {
    margin: 4px;
  }
`;
const AxisTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  grid-column: 1 / 2;
  grid-row: 1 / 2;
  color: #009999;
  font-weight: bold;
`;
const AxisMenuBar = styled.div`
  ${(props) =>
    props.axis === "X" &&
    css`
      display: flex;
      align-items: center;
      flex-direction: row;
      color: white;
      background-color: #435269;
      grid-column: 2 / 3;
      grid-row: 1 / 2;
      div {
        display: flex;
        align-items: center;
        height: 100%;
        padding-left: 2rem;
        padding-right: 2rem;
        text-align: center;
        &:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
      }
    `}
  ${(props) =>
    props.axis === "Y" &&
    css`
      display: flex;
      flex-direction: column;
      background-color: #eee;
      grid-column: 1 / 2;
      grid-row: 2 / 3;
      div {
        padding: 1rem 0.5rem 1rem 0.5rem;
        text-align: center;
        &:hover {
          background-color: #d6d6d6;
        }
      }
    `}
`;

const ContentBody = styled.div`
  grid-column: 2 / 3;
  grid-row: 2 / 3;
  display: flex;
  justify-content: center;
  margin: 0 5rem 0 5rem;
`;

export default UserOnlyDataLookUpPage;
