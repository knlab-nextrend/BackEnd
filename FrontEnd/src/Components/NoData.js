import React from "react";
import styled from "styled-components";
import { CgFileDocument } from "react-icons/cg";

function NoData() {
  return (
    <>
      <SearchResultNotthingContainer>
        <CgFileDocument size="100" color="#d6d6d6" />
        <div className="comment">등록된 데이터가 없습니다.</div>
      </SearchResultNotthingContainer>
    </>
  );
}
export default NoData;

const SearchResultNotthingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 10rem 0;
  .comment {
    font-size: 30px;
    color: #d6d6d6;
  }
`;
