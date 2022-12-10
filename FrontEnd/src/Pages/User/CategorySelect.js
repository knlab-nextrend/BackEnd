import { CATEGORY_TYPE_LIST } from "Data/category";
import styled from "styled-components";
import { myColors, tailwindColors } from "styles/colors";

export const CategorySelect = ({
  axisObj,
  axisMenu,
  selectedMenu,
  menuClickHandler,
}) => {
  return (
    <CategorySelectSection>
      <CategoryBar>
        <CategoryType>
          {axisObj.X && CATEGORY_TYPE_LIST[axisObj.X.type]}
        </CategoryType>
        <CategoryBarItemContainer>
          {axisMenu.X.map((category, index) => {
            return (
              <CategoryBarItem
                selected={selectedMenu.X.code === category.x_code}
                key={index}
                onClick={() => {
                  menuClickHandler("X", category);
                }}
              >
                {category.ct_name}
              </CategoryBarItem>
            );
          })}
        </CategoryBarItemContainer>
      </CategoryBar>
      <CategoryBar>
        <CategoryType>
          {axisObj.Y && CATEGORY_TYPE_LIST[axisObj.Y.type]}
        </CategoryType>
        <CategoryBarItemContainer>
          {axisMenu.Y.map((category, index) => {
            return (
              <CategoryBarItem
                selected={selectedMenu.Y.code === category.x_code}
                key={index}
                onClick={() => {
                  menuClickHandler("Y", category);
                }}
              >
                {category.ct_name}
              </CategoryBarItem>
            );
          })}
        </CategoryBarItemContainer>
      </CategoryBar>
    </CategorySelectSection>
  );
};

const CategorySelectSection = styled.div`
  border: 1px solid ${tailwindColors["grey-200"]};

  & > div:first-of-type {
    & > div:last-of-type {
      border-bottom: 1px solid ${tailwindColors["grey-200"]};
    }
  }
`;

const CategoryBar = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 4rem;
`;

const CategoryType = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 10rem;
  height: 100%;
  padding: 0.5rem 1rem;
  background-color: ${tailwindColors["grey-700"]};
  color: ${tailwindColors.white};
  font-weight: bold;
`;

const CategoryBarItemContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  padding: 0.5rem;
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
`;

const CategoryBarItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.5rem;
  padding: 0.5rem 2rem;
  border-radius: 1.25rem;
  background-color: ${(props) => props.selected && myColors.blue500};
  color: ${(props) => props.selected && tailwindColors.white};
  font-weight: ${(props) => props.selected && "bold"};
  cursor: pointer;
`;
