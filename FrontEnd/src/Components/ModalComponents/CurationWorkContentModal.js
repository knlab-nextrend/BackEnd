import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import Editor from "../Editor";
function CurationWorkContentModal({ closeModal }) {
  const curation_work_content = useSelector(
    (state) => state.modal.modalData.curation_work_content
  );
  return (
    <ModalWrapper>
      <Modalheader>
        <ModalTitle>큐레이션 작업내용 확인</ModalTitle>
        <ModalSubTitle>
          해당 작업자의 큐레이션 작업 내역을 확인하세요.
        </ModalSubTitle>
      </Modalheader>
      <ModalBody>
        <Editor readOnly={true} data={curation_work_content} height={"400px"}/>
      </ModalBody>
    </ModalWrapper>
  );
}
export default CurationWorkContentModal;

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
