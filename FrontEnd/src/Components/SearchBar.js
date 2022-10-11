import React from "react";
import styled from "styled-components";
import { AiOutlineSearch } from "react-icons/ai";
function SearchBar({keywordHandler=null, searchAction=null}) {
  return (
    <SearchBarContainer>
      <InputField type="text" placeholder="검색" onChange={keywordHandler}/>
      <OptionWrapper>
        <SearchBtn onClick={searchAction}>
          <AiOutlineSearch size="24" />
        </SearchBtn>
      </OptionWrapper>
    </SearchBarContainer>
  );
}

const SearchBarContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: solid 1px #435269;
  border-radius:3rem;
  height:3rem;
  color:#595959;
  background-color:white;
`;

const OptionWrapper = styled.div`
  display: flex;
  align-items: center;
`;
const SearchBtn = styled.button`
  display: flex;
  align-items: center;
  margin-left: 1rem;
  margin-right: 1rem;
  border:none;
  background-color:white;
  &:hover{
      cursor:pointer;
  }
  color:#435269;

`;
const InputField = styled.input`
    align-items: center;
    flex-grow: 1;
    height:2rem;
    margin-left:1rem;
    &:focus{
        outline:none;
    }
    border:none;
    &::placeholder{
        color:#435269;
    }
}
`;
const ExactlySearchOption = styled.div`
  display: flex;
  align-items: center;
  width:6rem;
  input[type="checkbox"] {
  }
  label{
      font-size:12px;
  }
`;

export default SearchBar;
