import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { CategorysListDataFetchApi } from "../../Utils/api";
import { useSelector } from "react-redux";

function CodeCategoryModal({ executeModal, closeModal }) {

  const [selectedCategoryList, setSelectedCategoryList] = useState([]);
  const [sectionCategoryList, setSectionCategoryList] = useState([]); // 대분류
  const [divisionCategoryList, setDivisionCategoryList] = useState([]); // 중분류
  const [groupCategoryList, setGroupCategoryList] = useState([]); // 소분류

  const [currentSectionCode, setCurrentSectionCode] = useState(0); // 대분류 선택
  const [currentDivisionCode, setCurrentDivisionCode] = useState(0); // 중분류 선택

  const _dc_code = useSelector((state) => state.modal.modalData.dc_code);

  const categoryDataFetch = (upperCode, type) => {
    CategorysListDataFetchApi(upperCode).then((res) => {
      if (type === "section") {
        setSectionCategoryList(res.data);
      }
      if (type === "division") {
        setDivisionCategoryList(res.data);
      }
      if (type === "group") {
        setGroupCategoryList(res.data);
      }
    });
  };

  const _currentSectionCodeHandler = (e) => {
    const _code = e.target.value;
    setCurrentSectionCode(Number(_code));
    setGroupCategoryList([]);
  };
  const _currentDivisionCodeHandler = (item) => {
    const _code = item.CODE;
    if (_code.length === 2) {
      // 상위 분류를 선택했다면 ?
      addCategory(item);
      setGroupCategoryList([]);
    } else {
      setCurrentDivisionCode(Number(_code));
    }
  };

  const addCategory = (item) => {
    if (
      selectedCategoryList.some((ele) => {
        return ele.CODE === item.CODE;
      })
    ) {
      alert("이미 선택된 주제 입니다.");
    } else {
      setSelectedCategoryList([...selectedCategoryList, item]);
    }
  };

  const deleteCategory = (code) => {
    setSelectedCategoryList(
      selectedCategoryList.filter((item) => item.CODE !== code)
    );
  };

  const saveCategory = () => {
    executeModal(selectedCategoryList, "dc_code");
    closeModal();
  };

  useEffect(() => {
    categoryDataFetch(null, "section");
    setSelectedCategoryList(_dc_code);
  }, []);

  useEffect(() => {
    categoryDataFetch(currentSectionCode, "division");
  }, [currentSectionCode]);

  useEffect(() => {
    categoryDataFetch(currentDivisionCode, "group");
  }, [currentDivisionCode]);
  return (
    <>
      <ModalWrapper>
        <Modalheader>
          <ModalTitle>주제 분류 설정</ModalTitle>
          <ModalSubTitle>
            {
              "해당 데이터의 주제 분류를 선택해주세요.\n추가된 주제는 아래 리스트에서 미리 볼 수 있으며, 추가된 주제 칩을 클릭하면 주제 분류 목록에서 삭제됩니다."
            }
          </ModalSubTitle>
        </Modalheader>
        <ModalBody>
          <ListHeader>
            <div>대분류</div>
            <div>중분류</div>
            <div>소분류</div>
          </ListHeader>
          <ListContainer>
            <ListWrapper>
              {sectionCategoryList.map((item) => {
                return (
                  <ListItem
                    value={item.CODE}
                    key={item.IDX}
                    onClick={_currentSectionCodeHandler}
                  >
                    {item.CT_NM}
                  </ListItem>
                );
              })}
            </ListWrapper>
            <ListWrapper>
              <ListWrapper>
                {divisionCategoryList.length === 0 && (
                  <ListItem>대분류를 먼저 선택하세요</ListItem>
                )}
                {divisionCategoryList.map((item) => {
                  return (
                    <ListItem
                      value={item.CODE}
                      key={item.IDX}
                      onClick={() => {
                        _currentDivisionCodeHandler(item);
                      }}
                    >
                      {item.CT_NM}
                    </ListItem>
                  );
                })}
              </ListWrapper>
            </ListWrapper>
            <ListWrapper>
              <ListWrapper>
                {groupCategoryList.length === 0 && (
                  <ListItem>중분류를 먼저 선택하세요</ListItem>
                )}
                {groupCategoryList.map((item) => {
                  return (
                    <ListItem
                      value={item.CODE}
                      key={item.IDX}
                      onClick={() => {
                        addCategory(item);
                      }}
                    >
                      {item.CT_NM}
                    </ListItem>
                  );
                })}
              </ListWrapper>
            </ListWrapper>
          </ListContainer>
          <CategoryList>
            {selectedCategoryList.map((item) => {
              return (
                <div
                  key={item.IDX}
                  onClick={() => {
                    deleteCategory(item.CODE);
                  }}
                >
                  {item.CT_NM}
                </div>
              );
            })}
          </CategoryList>
        </ModalBody>
        <ModalActions>
          <Button onClick={saveCategory} color="#435269">
            <p>저장</p>
          </Button>
          <Button onClick={closeModal} color="#bfbfbf">
            <p>취소</p>
          </Button>
        </ModalActions>
      </ModalWrapper>
    </>
  );
}

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
const ListContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
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

export default CodeCategoryModal;
