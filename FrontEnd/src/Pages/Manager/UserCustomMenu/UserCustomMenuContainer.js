import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { trackPromise } from "react-promise-tracker";

import { FetchUsersApi, sessionHandler } from "Utils/api";
import { setModal } from "Modules/modal";
import {
  setAxisMenuData,
  setEditingAxis,
  setEditingAxisData,
} from "Modules/custom";
import { LoadingWrapper } from "Components/LoadingWrapper";
import {
  getUserCustomMenuByUserId,
  removeUserCustomMenu,
  setUserCustomMenu,
} from "services/api/custom";

import UserCustomMenu from "./UserCustomMenu";

function UserCustomMenuContainer() {
  const CATEGORY_TYPE_LIST = {
    1: "정책 분류",
    2: "유형 분류",
    3: "국가 분류",
    4: "언어 분류",
    5: "토픽 분류",
    6: "기관 맞춤형 분류",
  };

  const dispatch = useDispatch();
  const [userList, setUserList] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null); // 현재 선택된 유저의 id
  const [currentAxis, setCurrentAxis] = useState("X"); // 현재 수정중인 축
  const [existingUserCategories, setExistingUserCategories] = useState({
    X: [],
    Y: [],
  });
  const currentCategory = useSelector(
    (state) => state.modal.modalData.axis_category
  ); // 현재 수정중인 축의 카테고리

  const [axisCategoryInfo, setAxisCategoryInfo] = useState({
    X: { name: null },
    Y: { name: null },
  });
  // 선택된 값을 미리 보여주기 위한 state
  const axisMenuData = useSelector((state) => state.axisMenuData);
  const [previewAxisMenu, setPreviewAxisMenu] = useState({ X: [], Y: [] }); // 미리보기용 하위 메뉴

  //작업할 축 선택하여 모달열기
  const openCategoryModal = (axis) => {
    setCurrentAxis(axis);
    dispatch(setEditingAxis(axis));
    dispatch(setModal("AxisCategoryModal"));
  };

  const onClickUser = (uid) => {
    setCurrentUserId(uid);
    setPreviewAxisMenu({ X: [], Y: [] });
    dispatch(setAxisMenuData("X", []));
    dispatch(setAxisMenuData("Y", []));
    setAxisCategoryInfo({
      X: { name: null },
      Y: { name: null },
    });
  };

  const getUserList = () => {
    trackPromise(
      FetchUsersApi()
        .then((res) => {
          const _userList = res.data.filter((user) => {
            return user.Category === "0";
          });
          setUserList(_userList);
        })
        .catch((err) => {
          sessionHandler(err, dispatch).then((res) => {
            FetchUsersApi().then((res) => {
              const _userList = res.data.filter((user) => {
                return user.Category === "0"; // 일반 사용자만 출력...
              });
              setUserList(_userList);
            });
          });
        })
    );
  };

  const getUserCategories = (uid) => {
    trackPromise(
      getUserCustomMenuByUserId(uid).then((res) => {
        const { x_axis, y_axis } = res.data;
        //기존에 등록되어있던 카테고리 저장해놓기
        // 기존거랑 비교해서 추가되는거만 post 하고 없어지는거는 delete 해야되서
        setExistingUserCategories({
          X: x_axis,
          Y: y_axis,
        });
        if (x_axis.length !== 0 && y_axis.length !== 0) {
          setAxisCategoryInfo((prev) => ({
            ...prev,
            X: { name: CATEGORY_TYPE_LIST[x_axis[0].x_type] },
            Y: { name: CATEGORY_TYPE_LIST[x_axis[0].x_type] },
          }));

          dispatch(setAxisMenuData("X", x_axis ?? []));
          dispatch(setAxisMenuData("Y", y_axis ?? []));

          dispatch(setEditingAxisData("X", x_axis[0].x_type + ""));
          dispatch(setEditingAxisData("Y", x_axis[0].x_type + ""));
        } else {
          dispatch(setEditingAxisData("X", 0));
          dispatch(setEditingAxisData("Y", 0));
        }
      })
    );
  };

  const previewSetting = (axis) => {
    console.log("프리뷰세팅 축 : ", axis);
    console.log("axisMenuData : ", axisMenuData);
    console.log(`axisMenuData[${axis}]:`, axisMenuData[axis]);

    if (axisMenuData[axis].length === 0) return;
    setPreviewAxisMenu((prev) => ({
      ...prev,
      [axis]: axisMenuData[axis],
    }));
    setAxisCategoryInfo((prev) => ({
      ...prev,
      [axis]: {
        name: CATEGORY_TYPE_LIST[axisMenuData[axis][0].x_type],
      },
    }));
    dispatch(setEditingAxis(axis));
    dispatch(setEditingAxisData(axis, axisMenuData[axis][0].x_type));
  };

  const saveUserAxisData = () => {
    if (axisMenuData.X.length === 0 || axisMenuData.Y.length === 0) {
      alert("X축과 Y축 모두 카테고리를 설정하여야 합니다.");
      return;
    }

    const addCategories = {
      uid: currentUserId,
    };

    //기존에 없는거만 추가해야된다
    if (
      existingUserCategories.X.length > 0 &&
      existingUserCategories.Y.length > 0
    ) {
      addCategories.xaxis = axisMenuData.X.map(
        (category) => category.CID
      ).filter(
        (cid) => !existingUserCategories.X.map((v) => v.CID).includes(cid)
      );
      addCategories.yaxis = axisMenuData.Y.map(
        (category) => category.CID
      ).filter(
        (cid) => !existingUserCategories.Y.map((v) => v.CID).includes(cid)
      );
    } else {
      addCategories.xaxis = axisMenuData.X.map((v) => v.CID);
      addCategories.yaxis = axisMenuData.Y.map((v) => v.CID);
    }

    // 기존에 없던게 없어졌으면 빼야된다 (idx  배열 담아서 보내기)
    const deleteCategories = [
      ...existingUserCategories.X.filter(
        (existingCategory) =>
          !axisMenuData.X.some((v) => v.CID === existingCategory.CID)
      ).map((v) => v.idx),
      ...existingUserCategories.Y.filter(
        (existingCategory) =>
          !axisMenuData.Y.some((v) => v.CID === existingCategory.CID)
      ).map((v) => v.idx),
    ];

    if (addCategories.xaxis.length > 0 || addCategories.yaxis.length > 0) {
      setUserCustomMenu(addCategories).then((res) => {
        alert("성공적으로 저장되었습니다.");
      });
    }

    if (deleteCategories.length > 0) {
      removeUserCustomMenu({ idx: deleteCategories });
    }
    location.reload();
  };

  useEffect(() => {
    getUserList();
  }, []);

  useEffect(() => {
    if (userList.length !== 0) {
      setCurrentUserId(userList[0].id); // 첫번째 사용자를 초기 사용자로 세팅.
    }
  }, [userList]);

  useEffect(() => {
    // 현재 사용자가 변경되었을 때
    if (currentUserId !== null) {
      // getAxisMenuUserSetting(currentUserId);
      getUserCategories(currentUserId);
    }
  }, [currentUserId]);

  useEffect(() => {
    // 해당 유저의 세팅정보가 없거나 X축 또는 Y축의 세팅 정보가 없을 때
    if (axisMenuData.X === null) {
      setPreviewAxisMenu((prev) => ({ ...prev, X: [] }));
    }
    if (axisMenuData.Y === null) {
      setPreviewAxisMenu((prev) => ({ ...prev, Y: [] }));
    }
    if (axisMenuData.X !== null) {
      previewSetting("X");
    }
    if (axisMenuData.Y !== null) {
      previewSetting("Y");
    }
  }, [axisMenuData]);

  return (
    <LoadingWrapper>
      <UserCustomMenu
        userList={userList}
        currentUserId={currentUserId}
        onClickUser={onClickUser}
        openCategoryModal={openCategoryModal}
        previewAxisMenu={previewAxisMenu}
        axisCategoryInfo={axisCategoryInfo}
        saveUserAxisData={saveUserAxisData}
      />
    </LoadingWrapper>
  );
}

export default UserCustomMenuContainer;
