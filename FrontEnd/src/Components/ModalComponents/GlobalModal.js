import React from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { setModal, setModalData } from "../../Modules/modal";
/* modal Components */
import CategoryModal from "./CategoryModal";
import UserInfoModal from "./UserInfoModal";
import AxisCategoryModal from "./AxisCategoryModal";
import HostSelectModal from "./HostSelectModal";
import CurationWorkContentModal from "./CurationWorkContentModal";

export const MODAL_TYPES = {
  UserInfoModal: "UserInfoModal",
  CategoryModal: "CategoryModal",
  AxisCategoryModal: "AxisCategoryModal",
  HostSelectModal: "HostSelectModal",
  CurationWorkContentModal: "CurationWorkContentModal",
};

const BACKDROP_CLOSE = {
  [MODAL_TYPES.UserInfoModal]: false,
  [MODAL_TYPES.CategoryModal]: true,
  [MODAL_TYPES.AxisCategoryModal]: true,
  [MODAL_TYPES.HostSelectModal]: true,
  [MODAL_TYPES.CurationWorkContentModal]: true,
};

const MODAL_COMPONENTS = {
  [MODAL_TYPES.CategoryModal]: CategoryModal,
  [MODAL_TYPES.UserInfoModal]: UserInfoModal,
  [MODAL_TYPES.AxisCategoryModal]: AxisCategoryModal,
  [MODAL_TYPES.HostSelectModal]: HostSelectModal,
  [MODAL_TYPES.CurationWorkContentModal]: CurationWorkContentModal,
};

function GlobalModal() {
  const dispatch = useDispatch();
  /* modalType이 존재한다면 모달창을 렌더링하도록 하며, modalType이 null이면 모달창을 렌더링하지 않는다. */
  /* 이 Modal 컴포넌트는 App.js 에 */
  /* https://mygumi.tistory.com/406 참고코드 */

  const modalType = useSelector((state) => state.modal.modalType);

  const closeModal = () => {
    dispatch(setModal(null));
  };

  const onBackDrop = () => {
    console.log(BACKDROP_CLOSE[modalType]);
    if (!BACKDROP_CLOSE[modalType]) return;
    closeModal();
  };

  const executeModal = (modalData, dataType) => {
    dispatch(setModalData(modalData, dataType));
  };

  const renderComponent = () => {
    if (!modalType) {
      return null;
    }
    const ModalComponent = MODAL_COMPONENTS[modalType];
    return (
      <ModalComponent closeModal={closeModal} executeModal={executeModal} />
    );
  };

  return (
    <>
      {modalType ? (
        <>
          <Background onClick={onBackDrop}>
            <ModalWrapper>{renderComponent()}</ModalWrapper>
          </Background>
        </>
      ) : null}
    </>
  );
}

const Background = styled.div`
  z-index: 2000;
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
`;

const ModalWrapper = styled.div`
  position: relative;
  /* top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); */
  z-index: 2001;
  max-width: 960px;
  width: 700px;
  box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 0.2),
    0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12);
  margin: 2rem;
`;

export default GlobalModal;
