import React from "react";
import styled, { css } from "styled-components";
import {
  MdOutlineModeEditOutline,
  MdOutlineDeleteOutline,
  MdOutlineCheck,
  MdClose,
} from "react-icons/md";
import { WorkerContentHeader } from "Components/WorkerContentHeader";
import { BsFillDiagram3Fill } from "react-icons/bs";
import { myColors, tailwindColors } from "styles/colors";
import { CATEGOROY_CODE_LIST } from "./CategoryManagementContainer";
function CategoryManagement({
  categoryList,
  type,
  typeHandler,
  editableCode,
  editCategoryName,
  categoryEdit,
  categoryEditConfirm,
  categoryEditCancel,
  onChangeEditInput,
  upperCodeHandler,
  lengthHandler,
  onChangeAddInput,
  categoryAdd,
  categoryDelete,
  upperCode,
}) {
  return (
    <Wrap>
      <WorkerContentHeader title="카테고리 관리" Icon={BsFillDiagram3Fill} />
      <Content>
        <MenuList>
          {[...Object.keys(CATEGOROY_CODE_LIST)].map((categoryName) => (
            <li
              key={CATEGOROY_CODE_LIST[categoryName]}
              onClick={() => {
                typeHandler(CATEGOROY_CODE_LIST[categoryName]);
              }}
              className={
                type === CATEGOROY_CODE_LIST[categoryName] ? "active" : null
              }
            >
              {categoryName}
            </li>
          ))}
        </MenuList>
        <CategoryContainer>
          <CategoryHeader>
            <div>대분류</div>
            <div>중분류</div>
            <div>소분류</div>
          </CategoryHeader>
          <AddCategoryContainer>
            <AddItem>
              <input
                placeholder="등록할 카테고리의 이름을 입력해주세요."
                onChange={onChangeAddInput}
              />
              <button
                onClick={() => {
                  categoryAdd(2);
                }}
              >
                등록
              </button>
            </AddItem>
            <AddItem>
              <input
                placeholder="등록할 카테고리의 이름을 입력해주세요."
                onChange={onChangeAddInput}
              />
              <button
                onClick={() => {
                  categoryAdd(4);
                }}
              >
                등록
              </button>
            </AddItem>
            <AddItem>
              <input
                placeholder="등록할 카테고리의 이름을 입력해주세요."
                onChange={onChangeAddInput}
              />
              <button
                onClick={() => {
                  categoryAdd(6);
                }}
              >
                등록
              </button>
            </AddItem>
          </AddCategoryContainer>
          <ListContainer>
            {categoryList.map((category, index) => {
              return (
                <ListWrapper key={index}>
                  {category.list.map((item, index2) => {
                    return (
                      <div key={index2}>
                        {editableCode === item.CODE ? (
                          <EditItem>
                            <input
                              type="text"
                              onChange={onChangeEditInput}
                              value={editCategoryName}
                            />
                            <div className="actions">
                              <button
                                className="confirm"
                                onClick={() => {
                                  categoryEditConfirm(item.CODE);
                                }}
                              >
                                <MdOutlineCheck />
                              </button>
                              <button
                                className="cancel"
                                onClick={categoryEditCancel}
                              >
                                <MdClose />
                              </button>
                            </div>
                          </EditItem>
                        ) : (
                          <ViewItem
                            active={
                              upperCode[index + (2 + index)] === item.CODE
                            }
                          >
                            <div
                              className="title"
                              value={item.CODE}
                              onClick={() => {
                                upperCodeHandler(item.CODE, category.length);
                                lengthHandler(category.length + 2);
                              }}
                            >
                              {item.CT_NM} ({item.CODE})
                            </div>
                            <div className="actions">
                              <button
                                className="edit"
                                onClick={() => {
                                  categoryEdit(item);
                                }}
                              >
                                <MdOutlineModeEditOutline />
                              </button>
                              <button
                                className="delete"
                                onClick={() => {
                                  categoryDelete(item.CODE);
                                }}
                              >
                                <MdOutlineDeleteOutline />
                              </button>
                            </div>
                          </ViewItem>
                        )}
                      </div>
                    );
                  })}
                </ListWrapper>
              );
            })}
          </ListContainer>
        </CategoryContainer>
      </Content>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  padding: 1.5rem 3rem;
`;

const Content = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  min-width: 930px;
  width: 100%;
`;

const MenuList = styled.ul`
  display: flex;
  width: fit-content;
  list-style-type: none;
  margin-bottom: 1.5rem;

  li {
    display: flex;
    padding: 1rem 2rem;
    border-bottom: solid 1px ${tailwindColors.white};
    background-color: ${tailwindColors.white};
    font-size: 1.2rem;
    font-weight: bold;

    cursor: pointer;
  }
  li:hover {
  }
  .active {
    border-bottom: solid 0.25rem ${myColors.blue400};
    color: ${myColors.blue400};
  }
`;

const CategoryContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  .content-title {
    border-bottom: 1px solid #d6d6d6;
    padding: 1rem;
    .main-title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 8px;
    }
    .sub-title {
      /*font-size:14px;*/
    }
  }
  .content-body {
    width: 100%;
  }
`;

const AddCategoryContainer = styled.div`
  display: flex;
  width: 100%;
  border: 1px solid ${tailwindColors["grey-300"]};
  & > * + * {
    border-left: 1px solid ${tailwindColors["grey-300"]};
  }
`;

const CategoryHeader = styled.div`
  display: flex;
  width: 100%;
  background-color: ${myColors.blue500};
  div {
    padding: 0.5rem 0 0.5rem 0;
    flex-grow: 1;
    text-align: center;
    color: white;
    font-weight: bold;
  }
`;

const AddItem = styled.div`
  flex-grow: 1;
  display: flex;
  padding: 0.5rem;

  input {
    flex: 1;
    padding: 0 1rem;
    border: 1px solid ${tailwindColors["grey-300"]};
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  button {
    cursor: pointer;
    min-width: 5rem;
    background-color: ${myColors.blue500};
    color: white;
    padding: 0.5rem 1rem;
  }
`;

const ListContainer = styled.div`
  display: flex;
  width: 100%;
  border: 1px solid ${tailwindColors["grey-300"]};
  & > * + * {
    border-left: 1px solid ${tailwindColors["grey-300"]};
  }
`;

const ListWrapper = styled.ul`
  width: calc(100% / 3);
  height: 32rem;
  overflow-y: auto;
  overflow-x: hidden;
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid ${tailwindColors["grey-300"]};
  background-color: white;

  .actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 2rem;
      border: 1px solid ${tailwindColors["grey-400"]};
      background-color: ${tailwindColors.white};
      font-size: 18px;

      cursor: pointer;
      :hover {
        background-color: ${tailwindColors["grey-100"]};
      }
    }
  }
`;

const ViewItem = styled(ListItem)`
  .title {
    cursor: pointer;
  }
  button {
    &.delete {
      background-color: ${myColors.red};
      color: white;
      border: none;
      :hover {
        background-color: ${myColors.red};
      }
    }
  }

  ${(props) =>
    props.active &&
    css`
      background-color: ${tailwindColors["grey-200"]};
      font-weight: bold;
    `};
`;

const EditItem = styled(ListItem)`
  background-color: ${myColors.blue100};
  input {
    display: flex;
    align-items: center;
    max-width: 11rem;
    padding-left: 0.5rem;
    border: none;
  }
  button {
    &.confirm {
      background-color: ${myColors.blue400};
      border: none;
      color: white;
      :hover {
        background-color: ${myColors.blue400};
      }
    }
  }
`;

export default CategoryManagement;
