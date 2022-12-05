import React from "react";
import styled, { css } from "styled-components";
import UserCurationDataListContainer from "../CurationDataList/CurationDataListContainer";
import UserArchiveDataList from "./UserArchiveDataList";
import { HiOutlineArchive, HiOutlineDocumentDuplicate } from "react-icons/hi";
import { LoadingWrapper } from "../../../Components/LoadingWrapper";
import { myColors, tailwindColors } from "styles/colors";

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
  curationRequest,
  selectedMenu,
  onClickAllMenu,
  selectedAll,
}) {
  return (
    <Wrapper>
      <AxisTitle selected={selectedAll} onClick={onClickAllMenu}>
        <div>전체</div>
      </AxisTitle>
      <AxisMenuBar axis="X">
        {axisMenu.X.map((category, index) => {
          return (
            <XAxismenuBarItem
              selected={selectedMenu.X.code === category.x_code}
              key={index}
              onClick={() => {
                menuClickHandler("X", category);
              }}
            >
              {category.ct_name}
            </XAxismenuBarItem>
          );
        })}
      </AxisMenuBar>
      <AxisMenuBar axis="Y">
        {axisMenu.Y.map((category, index) => {
          return (
            <YAxisMenuBarItem
              selected={selectedMenu.Y.code === category.x_code}
              key={index}
              onClick={() => {
                menuClickHandler("Y", category);
              }}
            >
              {category.ct_name}
            </YAxisMenuBarItem>
          );
        })}
      </AxisMenuBar>
      <LoadingWrapper>
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
            <UserCurationDataListContainer className="list" axisObj={axisObj} />
          )}
        </ContentBody>
      </LoadingWrapper>
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
  grid-column: 1 / 2;
  grid-row: 1 / 2;
  background-color: ${myColors.blue500};
  color: #ffffff;

  cursor: pointer;

  & > div {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    :hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
  }

  ${(props) =>
    props.selected &&
    css`
      & > div {
        background-color: #ffffff;
        color: ${myColors.blue500};
        font-weight: bold;

        :hover {
          background-color: #ffffff;
        }
      }
    `}
`;

const AxisMenuBar = styled.div`
  ${(props) =>
    props.axis === "X" &&
    css`
      display: flex;
      align-items: center;
      flex-direction: row;
      grid-column: 2 / 3;
      grid-row: 1 / 2;
      background-color: ${myColors.blue500};
      color: white;
    `}
  ${(props) =>
    props.axis === "Y" &&
    css`
      display: flex;
      flex-direction: column;
      background-color: ${tailwindColors["grey-100"]};
      grid-column: 1 / 2;
      grid-row: 2 / 3;
    `}
`;

const XAxismenuBarItem = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  padding-left: 2rem;
  padding-right: 2rem;
  text-align: center;
  cursor: pointer;
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
  ${(props) =>
    props.selected &&
    css`
      background-color: #ffffff;
      color: ${myColors.blue500};
      font-weight: bold;
      &:hover {
        background-color: #ffffff;
      }
    `};
`;

const YAxisMenuBarItem = styled.div`
  padding: 1rem 0.5rem 1rem 0.5rem;
  text-align: center;
  cursor: pointer;
  &:hover {
    background-color: #d6d6d6;
  }
  ${(props) =>
    props.selected &&
    css`
      background-color: ${myColors.blue100};
      &:hover {
        background-color: ${myColors.blue100};
      }
      font-weight: bold;
    `};
`;

const ContentBody = styled.div`
  display: flex;
  justify-content: center;
`;

export default UserOnlyDataLookUpPage;
