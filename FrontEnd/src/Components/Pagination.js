import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  BsChevronDoubleLeft,
  BsChevronDoubleRight,
  BsChevronLeft,
  BsChevronRight,
} from "react-icons/bs";
import { myColors, tailwindColors } from "styles/colors";

function Pagination({ dcCount, listSize, pageNo, setPageNo, pageSize = 10 }) {
  /* 
    pageNo 현재 클릭한 페이지의 No
    listSize 한 페이지에 보여질 document의 개수
    dcCount 전체 document의 개수
  */

  const [pageCount, setPageCount] = useState(0); // 총 보여질 페이지 갯수
  const [pageGroupCount, setPageGroupCount] = useState(0);
  const [currentPageNumberlist, setCurrentPageNumberList] = useState([]); // 현재 보여질 페이지  배열
  const [currentPageGroup, setCurrentPageGroup] = useState(0);

  //페이지 전환
  const _handlerPageNo = (e) => {
    const _currentPageNo = Number(e.target.value);
    setPageNo(_currentPageNo);
  };

  //다음 페이지 그룹으로 전환
  const toNextPageGroup = () => {
    if (currentPageGroup + 1 >= Math.ceil(pageCount / pageSize)) return;
    const nextPageGroup = currentPageGroup + 1;
    setCurrentPageGroup(nextPageGroup);
    setCurrentPageNumberList(getPageNumberList(nextPageGroup));
    setPageNo(nextPageGroup * pageSize + 1);
  };

  const toPrevPageGroup = () => {
    if (currentPageGroup === 0) return;
    const prevpageGroup = currentPageGroup - 1;
    setCurrentPageGroup(prevpageGroup);
    setCurrentPageNumberList(getPageNumberList(prevpageGroup));
    setPageNo(prevpageGroup * pageSize + 1);
  };

  const toFirstPage = () => {
    setCurrentPageGroup(0);
    setPageNo(1);
  };

  const toLastPage = () => {
    setCurrentPageGroup(pageGroupCount - 1);
    setPageNo(pageCount);
  };

  const getPageNumberList = (pageGroup) => {
    const result = [];
    if ((pageGroup + 1) * pageSize > pageCount) {
      for (let i = 1; i < (pageCount % pageSize) + 1; i++) {
        result.push(pageGroup * pageSize + i);
      }
    } else {
      for (let i = 1; i <= pageSize; i++) {
        result.push(pageGroup * pageSize + i);
      }
    }
    return result;
  };

  //총 페이지 수 초기화
  useEffect(() => {
    const _pageCount = Math.ceil(dcCount / listSize);
    const _pageGroupCount = Math.ceil(_pageCount / pageSize);
    setPageCount(_pageCount);
    setPageGroupCount(_pageGroupCount);
  }, [dcCount, listSize]);

  useEffect(() => {
    setCurrentPageNumberList(getPageNumberList(currentPageGroup));
  }, [pageCount, currentPageGroup]);

  //listSize나 Tab전환에 의해서 pageNo가 바뀌었을 때 제자리를 찾아가기 위해
  useEffect(() => {
    const newPageGroup = parseInt((pageNo - 1) / pageSize);
    setCurrentPageGroup(newPageGroup);
  }, [pageNo, pageSize]);

  return (
    <PaginationContainer>
      <ButtonGroup>
        <Button onClick={toFirstPage} disabled={currentPageGroup === 0}>
          <BsChevronDoubleLeft />
        </Button>
        <Button onClick={toPrevPageGroup} disabled={currentPageGroup === 0}>
          <BsChevronLeft />
        </Button>
      </ButtonGroup>
      <PaginationButtonGroup>
        {currentPageNumberlist.map((item, i) => (
          <PaginationButton
            key={i}
            value={item}
            onClick={_handlerPageNo}
            active={item === pageNo}
          >
            {item}
          </PaginationButton>
        ))}
      </PaginationButtonGroup>
      <ButtonGroup>
        <Button
          onClick={toNextPageGroup}
          disabled={currentPageGroup === pageGroupCount - 1}
        >
          <BsChevronRight />
        </Button>
        <Button
          onClick={toLastPage}
          disabled={currentPageGroup === pageGroupCount - 1}
        >
          <BsChevronDoubleRight />
        </Button>
      </ButtonGroup>
    </PaginationContainer>
  );
}

const PaginationContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.2rem;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid ${tailwindColors["grey-400"]};

  &:disabled {
    background-color: ${tailwindColors["grey-200"]};
    cursor: not-allowed;
  }
`;

const PaginationButtonGroup = styled.div``;

const PaginationButton = styled.button`
  min-width: 40px;
  height: 40px;
  padding: 0.5rem;
  background-color: ${(props) =>
    props.active ? myColors.blue500 : tailwindColors.white};
  font-size: 14px;
  font-weight: bold;
  color: ${(props) => props.active && tailwindColors.white};
  cursor: pointer;
  &:hover {
    background-color: ${myColors.blue500};
    color: ${tailwindColors.white};
  }
  &:active {
    filter: brightness(50%);
  }
`;

export default Pagination;
