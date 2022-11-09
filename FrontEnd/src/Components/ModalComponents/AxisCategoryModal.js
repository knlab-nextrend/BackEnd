import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { BsCheckLg } from "react-icons/bs";
import { getCatogryListAPI } from "../../api/category/category";
import { sessionHandler } from "../../Utils/api";

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
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [focusedCategory, setFocusedCategory] = useState({
    large: null,
    medium: null,
  });
  const [currentCategoryType, setCurrentCategoryType] = useState(null);
  const [disableCategoryType, setDisabledCategoryType] = useState(null);
  const editingAxis = useSelector((state) => state.editingAxis);

  const onClickCategoryType = (code) => {
    setSelectedCategory(null);
    setFocusedCategory({
      large: null,
      medium: null,
    });
    setCurrentCategoryType(code);
  };

  const onClickLargeCategory = (item) => {
    setFocusedCategory({ large: item, medium: null });
    setSelectedCategory(item);
    console.log(editingAxis);
  };

  const onClickMediumCategory = (item) => {
    if (item.subCategory.length === 0) return;

    setFocusedCategory((prev) => ({ ...prev, medium: item }));
    setSelectedCategory(item);
  };

  /* 데이터 불러오기 */
  const dataFetch = () => {
    getCatogryListAPI(currentCategoryType)
      .then((res) => {
        setCategoryList(stratifyCategoryList(res.data));
      })
      .catch((err) => {
        sessionHandler(err, dispatch).then((res) => {
          getCatogryListAPI(currentCategoryType).then((res) => {
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
    if (selectedCategory === null) {
      alert("값을 선택해주세요.");
    } else {
      // 1. 모달에서 값 선택 후 redux에 저장
      executeModal(selectedCategory, "axis_category");
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
                      disabled={category.subCategory.length === 0}
                      focused={focusedCategory.large?.code === category.code}
                      selected={selectedCategory?.code === category.code}
                    >
                      <div
                        className="title"
                        value={category.code}
                        onClick={() => onClickLargeCategory(category)}
                      >
                        <span>{category.name}</span>
                        {selectedCategory?.code === category.code && (
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
                        disabled={category.subCategory.length === 0}
                        focused={focusedCategory.medium?.code === category.code}
                        selected={selectedCategory?.code === category.code}
                      >
                        <div
                          className="title"
                          value={category.code}
                          onClick={() => onClickMediumCategory(category)}
                        >
                          <span>{category.name}</span>
                          {selectedCategory?.code === category.code && (
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
                      <ListItem disabled key={i}>
                        <div
                          className="title"
                          value={category.code}
                          onClick={() => onClickLargeCategory(category)}
                        >
                          {category.name}
                        </div>
                      </ListItem>
                    ))
                  )}
                </ListWrapper>
              </ListBody>
            </ListContainer>
          )}
        </ModalBody>
        <ModalActions>
          <Button color="#435269" onClick={saveCategory}>
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
  flex-direction: row;
`;
const CategoryBtnWrapper = styled.div`
  margin-bottom: 1rem;
`;

const CategoryTypeButton = styled.button`
  min-width: 5rem;
  margin-right: 0.5rem;
  padding: 0.5rem 1rem;
  border: solid 1px #435269;
  border-radius: 20px;
  background-color: ${(props) => (props.selected ? "#435269" : "#ffffff")};
  color: ${(props) => (props.selected ? "#ffffff" : "#435269")};
  font-weight: bold;

  :disabled {
    opacity: 0.2;
    cursor: not-allowed;
    &:hover {
      cursor: not-allowed;
      background-color: #ffffff;
      color: #435269;
    }
  }

  &:hover {
    cursor: pointer;
    background-color: #435269;
    color: white;
  }
`;

const Button = styled.button`
  background-color: ${(props) => props.color || "grey"};
  cursor: pointer;
  min-width: 5rem;
  border: none;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  margin: 0 0.5rem 0 0.5rem;
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
`;
const ListHeader = styled.div`
  display: flex;
  width: 100%;
  background-color: #435269;
  div {
    padding: 0.5rem 0 0.5rem 0;
    width: 100%;
    text-align: center;
    color: white;
    font-weight: bold;
  }
`;
const ListWrapper = styled.ul`
  width: 100%;
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
  background-color: ${(props) =>
    props.selected ? "#b7e4ff" : props.focused ? "#dfdfdf" : "#ffffff"};

  & > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

export default CategoryModal;
