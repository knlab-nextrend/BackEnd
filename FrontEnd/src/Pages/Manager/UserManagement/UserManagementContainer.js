import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import {
  FetchUsersApi,
  deleteUserByIdApi,
  sessionHandler,
  restrictUserApi,
} from "../../../Utils/api";
import UserManagement from "./UserManagement";
import { setModal, setModalData } from "../../../Modules/modal";
import { trackPromise } from "react-promise-tracker";

function UserManagementContainer() {
  const [userData, setUserData] = useState([]);
  const dispatch = useDispatch();

  const PERMISSON_DATA = {
    0: "사용자",
    1: "스크리닝 작업자",
    2: "정제 작업자",
    3: "등록 작업자",
    4: "큐레이션 작업자",
    9: "관리자",
  };

  const openUserModifyModal = (user) => {
    dispatch(setModal("UserInfoModal"));
    dispatch(setModalData({ user, type: false }, "modal_user"));
  };
  const openUserAddModal = () => {
    dispatch(setModal("UserInfoModal"));
    dispatch(setModalData({ user: [], type: true }, "modal_user"));
  };

  const getUserList = () => {
    trackPromise(FetchUsersApi()
      .then((res) => {
        setUserData(res.data);
      })
      .catch((err) => {
        sessionHandler(err, dispatch).then((res) => {
          FetchUsersApi().then((res) => {
            setUserData(res.data);
          });
        });
      }));
  };
  const deleteUser = (id) => {
    if (confirm("삭제하시겠습니까?")) {
      deleteUserByIdApi(id)
        .then((res) => {
          alert("성공적으로 삭제되었습니다");
        })
        .catch((err) => {
          if (err.response.status === 400) {
            alert("유저 정보 변경 중 오류발생");
          }
        });
      window.location.reload(); //
    }
  };
  const restrictUser = (id,restrict) => {
    restrictUserApi(id,restrict)
    .then(()=>{
      alert("성공적으로 수행되었습니다");
    })
    .catch((err)=>{
      if (err.response.status === 400) {
        alert("유저 정보 변경 중 오류발생");
      }
    })
    window.location.reload();
  }

  useEffect(() => {
    getUserList();
  }, []);

  return (
    <>
      <UserManagement
        userData={userData}
        openUserModifyModal={openUserModifyModal}
        deleteUser={deleteUser}
        restrictUser={restrictUser}
        openUserAddModal={openUserAddModal}
        PERMISSON_DATA={PERMISSON_DATA}
      />
    </>
  );
}

export default UserManagementContainer;
