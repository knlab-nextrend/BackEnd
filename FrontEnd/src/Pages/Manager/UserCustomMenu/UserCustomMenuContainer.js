import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserCustomMenu from "./UserCustomMenu";
import { trackPromise } from "react-promise-tracker";
import {
  FetchUsersApi,
  sessionHandler,
  axisMenuPreviewFetchApi,
  userAxisMenuSettingFetchApi,
  userAxisMenuSaveApi,
} from "../../../Utils/api";
import { setModal } from "../../../Modules/modal";
import { LoadingWrapper } from "../../../Components/LoadingWrapper";
import { setEditingAxis, setEditingAxisData } from "../../../Modules/custom";
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
  const [isNewSetting, setIsNewSetting] = useState(false); // 신규 세팅 여부 . true일 경우 신규 생성, false일 경우 기존 세팅 수정
  const [currentUserId, setCurrentUserId] = useState(null); // 현재 선택된 유저의 id
  const [currentAxis, setCurrentAxis] = useState("X"); // 현재 수정중인 축
  const currentCategory = useSelector(
    (state) => state.modal.modalData.axis_category
  ); // 현재 수정중인 축의 카테고리

  const [axisCategoryInfo, setAxisCategoryInfo] = useState({
    X: { category_type: null, select_category_name: null },
    Y: { category_type: null, select_category_name: null },
  }); // 선택된 값을 미리 보여주기 위한 state
  const [axisMenuData, setAxisMenuData] = useState({ X: null, Y: null }); // 현재 세팅된 축 메뉴
  const [previewAxisMenu, setPreviewAxisMenu] = useState({ X: [], Y: [] }); // 미리보기용 하위 메뉴
  const openCategoryModal = (axis) => {
    setCurrentAxis(axis);
    dispatch(setEditingAxis(axis));
    dispatch(setModal("AxisCategoryModal"));
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
  const getAxisMenuUserSetting = (uid) => {
    trackPromise(
      userAxisMenuSettingFetchApi(uid).then((res) => {
        if (res.data.length !== 0) {
          setIsNewSetting(false);
          // 값이 존재할 경우
          const userSettingObj = res.data[0];
          setAxisCategoryInfo((prev) => ({
            ...prev,
            X: {
              category_type: CATEGORY_TYPE_LIST[userSettingObj.x_type],
              select_category_name: userSettingObj.x_name,
            },
            Y: {
              category_type: CATEGORY_TYPE_LIST[userSettingObj.y_type],
              select_category_name: userSettingObj.y_name,
            },
          }));
          setAxisMenuData((prev) => ({
            ...prev,
            X:
              userSettingObj.x_cid !== null
                ? {
                    IDX: userSettingObj.x_cid,
                    CODE: userSettingObj.x_code,
                    CT_NM: userSettingObj.x_name,
                    TYPE: userSettingObj.x_type,
                  }
                : null,
            Y:
              userSettingObj.y_cid !== null
                ? {
                    IDX: userSettingObj.y_cid,
                    CODE: userSettingObj.y_code,
                    CT_NM: userSettingObj.y_name,
                    TYPE: userSettingObj.y_type,
                  }
                : null,
          }));

          dispatch(setEditingAxisData("X", userSettingObj.x_type));
          dispatch(setEditingAxisData("Y", userSettingObj.y_type));
        } else {
          // 값이 존재하지 않을 경우
          setIsNewSetting(true);
          setAxisCategoryInfo({
            X: { category_type: null, select_category_name: null },
            Y: { category_type: null, select_category_name: null },
          });
          setAxisMenuData({ X: null, Y: null });
          dispatch(setEditingAxisData("X", 0));
          dispatch(setEditingAxisData("Y", 0));
        }
      })
    );
  };
  const previewSetting = (axis) => {
    trackPromise(
      axisMenuPreviewFetchApi(axisMenuData[axis].IDX).then((res) => {
        setPreviewAxisMenu((prev) => ({
          ...prev,
          [axis]: res.data,
        }));
        setAxisCategoryInfo((prev) => ({
          ...prev,
          [axis]: {
            category_type: CATEGORY_TYPE_LIST[res.data[0].type],
            select_category_name:
              axisMenuData[axis].CT_NM || axisMenuData[axis].name,
          },
        }));
        dispatch(setEditingAxis(axis, res.data[0].type));
      })
    );
  };
  const saveUserAxisData = () => {
    if (axisMenuData.X === null || axisMenuData.Y === null) {
      alert("X축과 Y축 모두 카테고리를 설정하여야 합니다.");
      return;
    }
    if (axisCategoryInfo.X.category_type === axisCategoryInfo.Y.category_type) {
      alert(
        "X축과 Y축이 동일한 카테고리 타입을 가질 수 없습니다. 다시 설정해주세요."
      );
      return;
    } else {
      const axisSetObj = {
        uid: currentUserId,
        xaxis: axisMenuData.X.IDX,
        yaxis: axisMenuData.Y.IDX,
      };
      const _isNewSetting = isNewSetting ? "create" : "update";
      userAxisMenuSaveApi(axisSetObj, _isNewSetting).then((res) => {
        if (res.status === 200) {
          alert("성공적으로 저장되었습니다.");
          getAxisMenuUserSetting(currentUserId); // 리로드
        }
      });
    }
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
      getAxisMenuUserSetting(currentUserId);
    }
  }, [currentUserId]);

  useEffect(() => {
    setAxisMenuData((prev) => ({
      ...prev,
      [currentAxis]: currentCategory,
    }));
  }, [currentCategory]);

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
        setCurrentUserId={setCurrentUserId}
        openCategoryModal={openCategoryModal}
        previewAxisMenu={previewAxisMenu}
        axisCategoryInfo={axisCategoryInfo}
        saveUserAxisData={saveUserAxisData}
      />
    </LoadingWrapper>
  );
}

export default UserCustomMenuContainer;
