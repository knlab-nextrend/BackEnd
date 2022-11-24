import { HiOutlineDocumentSearch } from "react-icons/hi";
import styled from "styled-components";
import { myColors } from "styles/colors";

export const SearchResultCount = ({ count }) => {
  return (
    <Wrap>
      <HiOutlineDocumentSearch />
      <span> 검색 결과</span> <span>({count}건)</span>
    </Wrap>
  );
};

const Wrap = styled.div`
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
