import { HiSearch } from "react-icons/hi";
import styled from "styled-components";
import { myColors, tailwindColors } from "styles/colors";

export const CurationSearch = ({ onSubmitSearch, onChangeSearchInput }) => {
  return (
    <Wrap>
      {/* <div>검색</div> */}
      <SearchForm onSubmit={onSubmitSearch}>
        <SerchInputWrap>
          <label>
            <HiSearch />
            <SearchInput
              onChange={onChangeSearchInput}
              id="search"
              placeholder="검색어를 입력해주세요"
            />
          </label>
        </SerchInputWrap>
        <button>검색</button>
        <button type="reset">초기화</button>
      </SearchForm>
    </Wrap>
  );
};

const Wrap = styled.div`
  display: flex;
  width: 100%;
  background-color: ${tailwindColors["grey-100"]};

  & > div:first-of-type {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    background-color: ${tailwindColors["grey-600"]};
    color: ${tailwindColors.white};
    font-weight: bold;
  }
`;

const SearchForm = styled.form`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 1rem;

  & > button {
    width: 80px;
    height: 40px;
    padding: 0.5rem 1rem;
    border: none;
    background-color: ${myColors.blue500};
    font-size: 14px;
    color: white;
    font-weight: bold;
    white-space: nowrap;
    cursor: pointer;

    :nth-of-type(2) {
      background-color: ${tailwindColors["grey-700"]};
      margin-left: 0.5rem;
    }
  }
`;

const SerchInputWrap = styled.div`
  display: flex;
  align-items: center;
  max-width: 30rem;
  width: 100%;
  background-color: ${tailwindColors["grey-100"]};

  & label {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding-left: 0.5rem;
    cursor: pointer;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.5rem 1rem;
  border: 1px solid ${tailwindColors["grey-400"]};
  background-color: ${tailwindColors.white};
`;
