import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { sessionHandler, categoryListFetchApi } from "../../Utils/api";
import { trackPromise } from "react-promise-tracker";

import styled,{css} from "styled-components";

function CategoryModal({ executeModal, closeModal }) {
  const dispatch = useDispatch();
  const [categoryList, setCategoryList] = useState([
    { length: 2, list: [] },
    { length: 4, list: [] },
    { length: 6, list: [] },
  ]);
  const [upperCode, setUpperCode] = useState({ 2: null, 4: null, 6: null });
  const [length, setLength] = useState(2); // 대분류 (2) 중분류 (4) 소분류 (6)
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentCategoryType, setCurrentCategoryType] = useState(null);

  const upperCodeHandler = (code, length) => {
    let _upperCode = { ...upperCode };
    _upperCode[length] = code;
    setUpperCode(_upperCode);
  };
  const lengthHandler = (length) => {
    setLength(length);
  };
  const clickHandler = (e, item, code, length) => {
    //console.log(e.detail) // 1 : 원클릭 2: 더블클릭
    if (e.detail === 1) {
      upperCodeHandler(code, length);
      lengthHandler(length + 2);
    } else if (e.detail === 2) {
      addCategory(item);
    }
  };

  const addCategory = (item) => {
    if(categoryList.find((item)=>item.length === length).list.length=== 0){
      alert("하위항목이 없는 카테고리는 선택할 수 없습니다.");
      return;
    }
    if (!!selectedCategory && selectedCategory.IDX === item.IDX) {
      alert("이미 선택한 항목 입니다.");
    } else {
      setSelectedCategory(item);
    }
  };

  /* 데이터 불러오기 */
  const dataFetch = () => {
      categoryListFetchApi(currentCategoryType, length, upperCode[length - 2])
        .then((res) => {
          dataCleansing(res.data);
        })
        .catch((err) => {
          sessionHandler(err, dispatch).then((res) => {
            categoryListFetchApi(
              currentCategoryType,
              length,
              upperCode[length - 2]
            ).then((res) => {
              dataCleansing(res.data);
            });
          });
        })
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

  const dataCleansing = (rawData) => {
    const index = categoryList.findIndex((i) => i.length == length);
    let _categoryList = [...categoryList];
    _categoryList[index] = { length, list: rawData };
    setCategoryList(_categoryList);
  };

  const listInit = () => {
    setCategoryList([
      { length: 2, list: [] },
      { length: 4, list: [] },
      { length: 6, list: [] },
    ]);
    setUpperCode({ 2: null, 4: null, 6: null });
    setLength(2);
  };
  useEffect(() => {
    listInit();
  }, [currentCategoryType]);
  useEffect(() => {
    if (!!currentCategoryType) {
      dataFetch();
    }
  }, [currentCategoryType, length, upperCode]);
  return (
    <>
      <ModalWrapper>
        <Modalheader>
          <ModalTitle>맞춤형 메뉴 주제 설정</ModalTitle>
          <ModalSubTitle>
            해당 축에 설정할 메뉴 주제를 선택하세요. X축과 Y축이 동일한 카테고리
            타입을 가질 수 없습니다. 유의해주세요
          </ModalSubTitle>
        </Modalheader>
        <ModalBody>
          <CategoryBtnWrapper>
            <button
              onClick={() => {
                setCurrentCategoryType(1);
              }}
            >
              정책 분류
            </button>
            <button
              onClick={() => {
                setCurrentCategoryType(2);
              }}
            >
              유형 분류
            </button>
            <button
              onClick={() => {
                setCurrentCategoryType(3);
              }}
            >
              국가
            </button>
            <button
              onClick={() => {
                setCurrentCategoryType(4);
              }}
            >
              언어
            </button>
            <button
              onClick={() => {
                setCurrentCategoryType(5);
              }}
            >
              토픽 분류
            </button> 
            <button
              onClick={() => {
                setCurrentCategoryType(6);
              }}
            >
              기관 맞춤형 분류
            </button>
          </CategoryBtnWrapper>
          {currentCategoryType && (
            <ListContainer>
              <ListHeader>
                <div>대분류</div>
                <div>중분류</div>
                <div>소분류</div>
              </ListHeader>
              <ListBody>
                {categoryList.map((category, index) => {
                  return (
                    <ListWrapper>
                      {category.list.length === 0 ? (
                        <ListItem>상위분류를 먼저 선택하세요</ListItem>
                      ) : (
                        category.list.map((item, index2) => {
                          return (
                            <>
                              <ListItem  active={upperCode[index+(2+index)] === item.CODE}>
                                <div
                                  className="title"
                                  value={item.CODE}
                                  onClick={(e) => {
                                    clickHandler(
                                      e,
                                      item,
                                      item.CODE,
                                      category.length
                                    );
                                  }}
                                >
                                  {item.CT_NM}
                                </div>
                              </ListItem>
                            </>
                          );
                        })
                      )}
                    </ListWrapper>
                  );
                })}
              </ListBody>
            </ListContainer>
          )}
          {selectedCategory && <div>현재선택됨 : {selectedCategory.CT_NM}</div>}
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
  button {
    margin-right: 0.5rem;
    min-width: 5rem;
    color: #435269;
    border: solid 1px #435269;
    border-radius: 20px;
    background-color: white;
    padding: 0.5rem 1rem 0.5rem 1rem;
    font-weight: bold;
    &:hover {
      cursor: pointer;
      background-color: #435269;
      color: white;
      transition: 0.2s;
    }
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
  cursor: pointer;
  padding: 1rem;
  min-height: 1.5rem;
  border-bottom: dotted 1px #eeeeee;
  ${(props) =>
    props.active &&
    css`
      background-color: rgba(67,82,105,0.1);
      font-weight:bold;
    `};
`;

const CategoryList = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  display: flex;
  justify-content: left;
  border: solid 1px #eee;
  flex-wrap: wrap;

  div {
    cursor: pointer;
    margin: 0.5rem;
    background-color: #eee;
    padding: 0.5rem;
    border-radius: 1rem;
    font-size: 12px;
  }
`;
export default CategoryModal;
