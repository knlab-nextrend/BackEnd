import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  ContinentsListDataFetchApi,
  CountrysListDataFetchApi,
} from "../../Utils/api";
import { useSelector } from "react-redux";
function CountryPubCategoryModal({ closeModal, executeModal}) {
  const [selectedCountryList, setSelectedCountryList] = useState([]);
  const [countrysListData, setCountrysListData] = useState([]);
  const [continentsListData, setContinentsListData] = useState([]);
  const [currentContinentIndex, setCurrentContinentIndex] = useState(0);

  const _dc_country_pub = useSelector((state) => state.modal.modalData.dc_country_pub);

  const countrysDataFetch = (currentContinentIndex) => {
    CountrysListDataFetchApi(currentContinentIndex).then((res) => {
      setCountrysListData(res.data);
    });
  };
  const continentsDataFetch = () => {
    ContinentsListDataFetchApi().then((res) => {
      setContinentsListData(res.data);
    });
  };

  const _currentContinentIndexHandler = (e) => {
    setCurrentContinentIndex(Number(e.target.value));
  };

  const addCountry = (idx) => {
    const _country = countrysListData.find((item) => item.IDX === idx);
    if (
      selectedCountryList.some((ele) => {
        return ele.IDX === _country.IDX;
      })
    ) {
      alert("이미 선택된 국가 입니다.");
    } else {
      setSelectedCountryList([...selectedCountryList, _country]);
    }
  };

  const deleteCountry = (idx) => {
    setSelectedCountryList(
      selectedCountryList.filter((item) => item.IDX !== idx)
    );
  };

  const saveCountry = () => {
    executeModal(selectedCountryList, "dc_country_pub");
    closeModal();
  };

  useEffect(() => {
    continentsDataFetch();
    setSelectedCountryList(_dc_country_pub);
  }, []);

  useEffect(() => {
    countrysDataFetch(currentContinentIndex);
  }, [currentContinentIndex]);

  return (
    <>
      <ModalWrapper>
        <Modalheader>
          <ModalTitle>국가 설정</ModalTitle>
          <ModalSubTitle>
            {
              "해당 데이터의 국가 분류를 선택해주세요.\n추가된 국가는 아래 리스트에서 미리 볼 수 있으며, 추가된 국가 칩을 클릭하면 국가 목록에서 삭제됩니다."
            }
          </ModalSubTitle>
        </Modalheader>
        <ModalBody>
          <ListHeader>
            <div>대분류</div>
            <div>중분류</div>
          </ListHeader>
          <ListContainer>
            <ListWrapper>
              {continentsListData.map((item) => {
                return (
                  <ListItem
                    key={item.IDX}
                    value={item.IDX}
                    onClick={_currentContinentIndexHandler}
                  >
                    {item.CONTI_NAME}
                  </ListItem>
                );
              })}
            </ListWrapper>
            <ListWrapper>
              {currentContinentIndex.length === 0 && (
                <ListItem>대분류를 먼저 선택하세요</ListItem>
              )}
              {countrysListData.map((item) => {
                return (
                  <ListItem
                    key={item.IDX}
                    value={item.IDX}
                    onClick={() => {
                      addCountry(item.IDX);
                    }}
                  >
                    {item.CTY_NAME}
                  </ListItem>
                );
              })}
            </ListWrapper>
          </ListContainer>
          <CountryList>
            {selectedCountryList.map((item) => {
              return (
                <div
                  key={item.IDX}
                  onClick={() => {
                    deleteCountry(item.IDX);
                  }}
                >
                  {item.CTY_NAME}
                </div>
              );
            })}
          </CountryList>
        </ModalBody>
        <ModalActions>
          <Button onClick={saveCountry} color="#435269">
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
`;
const ListItem = styled.li`
  cursor: pointer;
  padding: 1rem;
  min-height: 1.5rem;
  border-bottom: dotted 1px #eeeeee;
`;

const CountryList = styled.div`
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

export default CountryPubCategoryModal;
