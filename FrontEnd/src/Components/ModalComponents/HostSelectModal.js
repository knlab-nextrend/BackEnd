import React, { useState } from "react";
import styled from "styled-components";
import SearchBar from "../SearchBar";
import { HostManagementApi } from "../../Utils/api";
import { useDispatch } from "react-redux";
function HostSelectModal({ executeModal, closeModal }) {
  const [keyword, setKeyword] = useState("");
  const [hostList, setHostList] = useState([]); // 검색 결과 호스트 목록
  const [selectHost, setSelectHost] = useState(null); // 선택한 호스트 및 발급기관명
  const saveCategory = () => {
    executeModal(selectHost, "doc_host");
    closeModal();
  };

  const clickHandler = (item) => {
    setSelectHost(item);
  };
  const keywordHandler = (e) => {
    setKeyword(e.target.value);
  };
  const searchHost = () => {
    let searchObj = { like: keyword };
    HostManagementApi(searchObj, "GET").then((res) => {
      setHostList(res.data);
    });
  };

  return (
    <>
      <ModalWrapper>
        <Modalheader>
          <ModalTitle>HOST 검색</ModalTitle>
          <ModalSubTitle>
            HOST 도메인의 일부를 검색하여 결과를 확인하고, 값을
            등록해주세요.
          </ModalSubTitle>
        </Modalheader>
        <ModalBody>
          <SearchBar
            keywordHandler={keywordHandler}
            searchAction={searchHost}
          />
          <SearchResultWrapper>
            {hostList.length === 0 ? (
              <SearchResultRow>검색결과가 없습니다</SearchResultRow>
            ) : (
              hostList.map((item, index) => {
                return (
                  <SearchResultRow
                    key={index}
                    onClick={() => {
                      clickHandler(item);
                    }}
                  >
                    <div>
                      {item.NAME} ({item.HOST})
                    </div>
                  </SearchResultRow>
                );
              })
            )}
          </SearchResultWrapper>
          {selectHost!==null && <div>{selectHost.NAME} ({selectHost.HOST})</div>}
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

const SearchResultWrapper = styled.div`
  border: solid 1px #d6d6d6;
  border-radius: 4px;
  margin: 1rem 0 1rem 0;
  height: 30rem;
  overflow-y: auto;
`;

const SearchResultRow = styled.div`
  padding: 1rem;
  border-bottom: solid 1px #d6d6d6;
`;

export default HostSelectModal;
