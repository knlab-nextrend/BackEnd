import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { setModal, setModalData } from "../../Modules/modal";
/* modal Components */
import CategoryModal from "./CategoryModal";
import UserInfoModal from "./UserInfoModal";
import AxisCategoryModal from "./AxisCategoryModal"
import HostSelectModal from "./HostSelectModal"
import CurationWorkContentModal from "./CurationWorkContentModal"

export const MODAL_TYPES = {
  CategoryModal: "CategoryModal",
  UserInfoModal: "UserInfoModal",
  AxisCategoryModal:"AxisCategoryModal",
  HostSelectModal:"HostSelectModal",
  CurationWorkContentModal:"CurationWorkContentModal",
};

const MODAL_COMPONENTS = {
  [MODAL_TYPES.CategoryModal]: CategoryModal,
  [MODAL_TYPES.UserInfoModal]: UserInfoModal,
  [MODAL_TYPES.AxisCategoryModal]:AxisCategoryModal,
  [MODAL_TYPES.HostSelectModal]:HostSelectModal,
  [MODAL_TYPES.CurationWorkContentModal] :CurationWorkContentModal,
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
          <Background onClick={closeModal} />
          <ModalWrapper>{renderComponent()}</ModalWrapper>
        </>
      ) : null}
    </>
  );
}

const Background = styled.div`
  z-index: 10;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: block;
`;

const ModalWrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 11;
  max-width: 960px;
  width: 700px;
  box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 0.2),
    0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12);
  margin: 2rem;
`;

export default GlobalModal;
