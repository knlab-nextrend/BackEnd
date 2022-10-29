import React, { useEffect, useState } from "react";
import styled from "styled-components";

function Pagination({ dcCount, listSize, pageNo, setPageNo, pageSize = 10 }) {
  /* 
    pageNo 현재 클릭한 페이지의 No
    listSize 한 페이지에 보여질 document의 개수
    dcCount 전체 document의 개수
  */

  const [pageCount, setPageCount] = useState(0); // 총 보여질 페이지 갯수
  const [pageNoArray, setPageNoArray] = useState([]); // 총 보여질 페이지 갯수 배열
  const [currentPageNumberlist, setCurrentPageNumberList] = useState([]); // 현재 보여질 페이지 갯수 배열
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
    setPageCount(_pageCount);
  }, [dcCount, listSize]);

  useEffect(() => {
    setCurrentPageNumberList(getPageNumberList(currentPageGroup));
  }, [pageCount]);

  return (
    <>
      <PaginationContainer>
        {currentPageGroup !== 0 && (
          <NextPrevButton onClick={toPrevPageGroup}>{"<"}</NextPrevButton>
        )}
        {currentPageNumberlist.map((item, i) => {
          return (
            <PaginationButton
              key={i}
              value={item}
              onClick={_handlerPageNo}
              active={item === pageNo}
            >
              {item}
            </PaginationButton>
          );
        })}
        {(currentPageGroup + 2) * pageSize <= pageCount && (
          <NextPrevButton onClick={toNextPageGroup}>{">"}</NextPrevButton>
        )}
      </PaginationContainer>
    </>
  );
}

const PaginationContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: 1rem;
`;
const PaginationButton = styled.button`
  margin: 0.5rem;
  color: white;
  font-weight: bold;
  padding: 1rem;
  background-color: ${(props) => (props.active ? "#113241" : "#32677F")};
  cursor: pointer;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  &:hover {
    filter: brightness(150%);
    transition: all 0.5s;
  }
  &:active {
    filter: brightness(50%);
    transition: all 0.2s;
  }
`;

const NextPrevButton = styled(PaginationButton)`
  background-color: #d6d6d6;
  color: black;
`;
export default Pagination;
