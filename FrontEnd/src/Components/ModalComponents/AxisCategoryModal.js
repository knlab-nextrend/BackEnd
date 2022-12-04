import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { BsCheckLg, BsX } from "react-icons/bs";
import { getCategryListAPI } from "services/api/category/category";
import { sessionHandler } from "../../Utils/api";
import { myColors, tailwindColors } from "styles/colors";

const CATEGORY_INFO = [
  { name: "정책 분류", code: 1 },
  { name: "유형 분류", code: 2 },
  { name: "국가", code: 3 },
  { name: "언어", code: 4 },
  { name: "토픽 분류", code: 5 },
  { name: "기관 맞춤형 분류", code: 6 },
];

function CategoryModal({ executeModal, closeModal }) {
  const dispatch = useDispatch();
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [focusedCategory, setFocusedCategory] = useState({
    large: null,
    medium: null,
  });
  const [currentCategoryType, setCurrentCategoryType] = useState(null);
  const editingAxis = useSelector((state) => state.editingAxis);

  const onClickCategoryType = (code) => {
    setFocusedCategory({
      large: null,
      medium: null,
    });
    setCurrentCategoryType(code);
    setSelectedCategories([]);
  };

  const onClickLargeCategory = (e, item) => {
    if (e.detail === 1) {
      setFocusedCategory({ large: item, medium: null });
      return;
    }

    if (selectedCategories.includes(item)) {
      alert("이미 선택된 카테고리입니다");
    } else {
      setSelectedCategories((prev) => [...prev, item]);
    }
    console.log(editingAxis);
  };

  const onClickMediumCategory = (e, item) => {
    if (e.detail === 1) {
      setFocusedCategory((prev) => ({ ...prev, medium: item }));
    } else {
      setSelectedCategories((prev) => [...prev, item]);
    }
  };

  const onClickSmallCategory = (e, item) => {
    if (e.detail === 2) setSelectedCategories((prev) => [...prev, item]);
  };

  const removeSelectedItem = (item) => {
    setSelectedCategories((prev) =>
      prev.filter((category) => category.IDX !== item.IDX)
    );
  };

  /* 데이터 불러오기 */
  const dataFetch = () => {
    getCategryListAPI(currentCategoryType)
      .then((res) => {
        setCategoryList(stratifyCategoryList(res.data));
      })
      .catch((err) => {
        sessionHandler(err, dispatch).then((res) => {
          getCategryListAPI(currentCategoryType).then((res) => {
            setCategoryList(res.data);
          });
        });
      });
  };

  const stratifyCategoryList = (caregoryList) => {
    const newList = caregoryList
      .filter((v) => v.level === "대분류")
      .map((large) => {
        const mediumCategories = caregoryList
          .filter(
            (v) => v.level === "중분류" && v.code.substring(0, 2) === large.code
          )
          .map((medium) => {
            const smallCategories = caregoryList.filter(
              (v) =>
                v.level === "소분류" && v.code.substring(0, 4) === medium.code
            );
            return { ...medium, subCategory: smallCategories };
          });
        return { ...large, subCategory: mediumCategories };
      });
    console.log(newList);
    return newList;
  };

  const saveCategory = () => {
    if (selectedCategories.length === 0) {
      alert("카테고리를 선택해주세요.");
    } else {
      // 1. 모달에서 값 선택 후 redux에 저장
      executeModal(selectedCategories, "axis_category");
      closeModal();
    }
  };

  useEffect(() => {
    if (!!currentCategoryType) {
      dataFetch();
    }
  }, [currentCategoryType]);

  return (
    <>
      <ModalWrapper>
        <Modalheader>
          <ModalTitle>맞춤형 메뉴 주제 설정</ModalTitle>
          <ModalSubTitle>
            하위 카테고리가 없는 항목은 선택할 수 없습니다
          </ModalSubTitle>
        </Modalheader>
        <ModalBody>
          <CategoryBtnWrapper>
            {CATEGORY_INFO.map((v) => (
              <CategoryTypeButton
                key={v.code}
                onClick={() => onClickCategoryType(v.code)}
                selected={currentCategoryType === v.code}
                disabled={
                  editingAxis.selected === "X"
                    ? editingAxis.Y === v.code
                    : editingAxis.X === v.code
                }
              >
                {v.name}
              </CategoryTypeButton>
            ))}
          </CategoryBtnWrapper>
          {currentCategoryType && (
            <ListContainer>
              <ListHeader>
                <div>대분류</div>
                <div>중분류</div>
                <div>소분류</div>
              </ListHeader>
              <ListBody>
                <ListWrapper>
                  {categoryList.map((category, i) => (
                    <ListItem
                      key={i}
                      focused={focusedCategory.large?.code === category.code}
                      selected={selectedCategories?.includes(category)}
                    >
                      <div
                        className="title"
                        value={category.code}
                        onClick={(e) => onClickLargeCategory(e, category)}
                      >
                        <span>{category.name}</span>
                        {selectedCategories?.includes(category) && (
                          <BsCheckLg />
                        )}
                      </div>
                    </ListItem>
                  ))}
                </ListWrapper>
                <ListWrapper>
                  {!focusedCategory.large ? (
                    <ListItem>상위분류를 먼저 선택하세요</ListItem>
                  ) : (
                    focusedCategory.large.subCategory.map((category, i) => (
                      <ListItem
                        key={i}
                        focused={focusedCategory.medium?.code === category.code}
                        selected={selectedCategories.includes(category)}
                      >
                        <div
                          className="title"
                          value={category.code}
                          onClick={(e) => onClickMediumCategory(e, category)}
                        >
                          <span>{category.name}</span>
                          {selectedCategories.includes(category) && (
                            <BsCheckLg />
                          )}
                        </div>
                      </ListItem>
                    ))
                  )}
                </ListWrapper>
                <ListWrapper>
                  {!focusedCategory.medium ? (
                    <ListItem>상위분류를 먼저 선택하세요</ListItem>
                  ) : (
                    focusedCategory.medium.subCategory.map((category, i) => (
                      <ListItem
                        key={i}
                        selected={selectedCategories.includes(category)}
                      >
                        <div
                          className="title"
                          value={category.code}
                          onClick={(e) => onClickSmallCategory(e, category)}
                        >
                          <span>{category.name}</span>
                          {selectedCategories.includes(category) && (
                            <BsCheckLg />
                          )}
                        </div>
                      </ListItem>
                    ))
                  )}
                </ListWrapper>
              </ListBody>
            </ListContainer>
          )}
          <SelectedItemContainer>
            {selectedCategories.map((category) => (
              <div
                key={category.IDX}
                onClick={() => removeSelectedItem(category)}
              >
                <span>{category.name}</span>
                <BsX />
              </div>
            ))}
          </SelectedItemContainer>
        </ModalBody>
        <ModalActions>
          <Button color={myColors.blue500} onClick={saveCategory}>
            <p>저장</p>
          </Button>
          <Button color="#bfbfbf" onClick={closeModal}>
            <p>취소</p>
          </Button>
        </ModalActions>
      </ModalWrapper>
    </>
  );
}

/* 모달 디자인 관련 컴포넌트 ... 나중에 전역 관리 할 수 있음 좋겠네 ㅠ */
const ModalWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 0.25rem;
  padding: 1.5rem;
`;
const Modalheader = styled.div`
  justify-content: left;
  margin-bottom: 1rem;
`;
const ModalTitle = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: rgba(0, 0, 0, 0.7);
`;
const ModalSubTitle = styled.div`
  font-size: 16px;
  margin-bottom: 0.5rem;
`;
const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;
const CategoryBtnWrapper = styled.div`
  margin-bottom: 1rem;
`;

const CategoryTypeButton = styled.button`
  min-width: 5rem;
  margin-right: 0.5rem;
  padding: 0.5rem 1rem;
  border: solid 1px ${myColors.blue500};
  border-radius: 20px;
  background-color: ${(props) =>
    props.selected ? myColors.blue500 : "#ffffff"};
  color: ${(props) => (props.selected ? "#ffffff" : myColors.blue500)};
  font-weight: bold;

  :disabled {
    opacity: 0.2;
    cursor: not-allowed;
    &:hover {
      cursor: not-allowed;
      background-color: #ffffff;
      color: ${myColors.blue500};
    }
  }

  &:hover {
    cursor: pointer;
    background-color: ${myColors.blue500};
    color: white;
  }
`;

const Button = styled.button`
  background-color: ${(props) => props.color || "grey"};
  cursor: pointer;
  width: 5rem;
  padding: 0.5rem;
  color: white;
  font-weight: bold;
`;

/* 리스트 관리 스타일 */

const ListBody = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;
const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  color: ${tailwindColors.black};
`;
const ListHeader = styled.div`
  flex: 1;
  display: flex;
  background-color: ${myColors.blue500};
  div {
    padding: 0.5rem 0 0.5rem 0;
    flex: 1;
    text-align: center;
    color: white;
    font-weight: bold;
  }
`;
const ListWrapper = styled.ul`
  flex: 1;
  list-style-type: none;
  height: 30rem;
  overflow: auto;
  margin: 0;
  padding: 0;
  border: solid 1px #eeeeee;
  overflow-x: hidden;
`;
const ListItem = styled.li`
  padding: 1rem;
  min-height: 1.5rem;
  border-bottom: dotted 1px #eeeeee;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  color: ${(props) => props.disabled && "#888888"};
  font-weight: ${(props) => (props.focused || props.selected) && "bold"};
  background-color: ${(props) => (props.focused ? "#dfdfdf" : "#ffffff")};

  & > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

const SelectedItemContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;

  & > div {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.2rem;
    height: 2rem;
    padding: 0 0.5rem 0 1rem;
    border-radius: 1rem;
    background-color: ${myColors.blue100};
    font-weight: bold;
    white-space: nowrap;
    cursor: pointer;
    transition: background-color 0.2s;
    :hover {
      background-color: ${myColors.blue200};
    }
  }
`;

export default CategoryModal;
