import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { trackPromise } from "react-promise-tracker";
import { useSelector, useDispatch } from "react-redux";

import { setLogout } from "Modules/login";
import { setAxis } from "Modules/custom";
import {
  curationRequestApi,
  userCustomCurationDataFetchApi,
  sessionHandler,
} from "Utils/api";
import { getUserCustomMenuByUserId } from "services/api/custom";

import UserOnlyDataLookUpPage from "./UserOnlyDataLookUpPage";

function UserOnlyDataLookUpPageContainer() {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.user);
  const axisObj = useSelector((state) => state.custom.axisObj);
  const [axisMenu, setAxisMenu] = useState({ X: [], Y: [] });
  const [dataMode, setDataMode] = useState("curation"); // curation , archive
  const [selectedMenu, setSelectedMenu] = useState({
    X: {},
    Y: {},
  });
  const [selectedAll, setSelectedAll] = useState(true);

  const [archiveData, setArchiveData] = useState([]);
  /* 페이지네이션 */
  const [dcCount, setDcCount] = useState(0); // document 총 개수
  const [pageNo, setPageNo] = useState(1); // 현재 활성화 된 페이지 번호
  const [listSize, setListSize] = useState(10); // 한 페이지에 나타낼 document 개수

  const curationRequest = (id) => {
    if (confirm("해당 아카이브 자료의 큐레이션을 신청하시겠습니까?")) {
      curationRequestApi(id).then((res) => {
        if (res.status === 200) {
          alert("성공적으로 신청되었습니다.");
          archiveDataFetch();
        }
      });
    }
  };

  const menuDataFetch = (uid) => {
    getUserCustomMenuByUserId(uid).then((res) => {
      const { x_axis, y_axis } = res.data;
      console.log("유저카테고리  : ", res.data);

      if (x_axis.length === 0 || y_axis.lengtth === 0) {
        alert("x축, y축 메뉴가 모두 설정되지 않은 사용자입니다.");
        dispatch(setLogout("NORMAL_LOGOUT"));
      } else {
        setAxisMenu({ X: x_axis, Y: y_axis });

        const _axisObj = {
          X: { type: x_axis[0].x_type, code: x_axis.map((v) => v.x_code) },
          Y: { type: y_axis[0].x_type, code: y_axis.map((v) => v.x_code) },
        };
        dispatch(setAxis(_axisObj));
      }
    });
  };

  const onClickAllMenuButton = () => {
    menuDataFetch(userInfo.id);
    setSelectedMenu({ X: axisMenu.X, Y: axisMenu.Y });
    setSelectedAll(true);
  };

  const archiveDataFetch = () => {
    if (axisObj.X !== null && axisObj.Y !== null) {
      const axis = {};
      axis[axisObj.X.type] = axisObj.X.code;
      axis[axisObj.Y.type] = axisObj.Y.code;
      console.log("제발", axis);
      trackPromise(
        userCustomCurationDataFetchApi(axis, listSize, pageNo, true)
          .then((res) => {
            dataCleansing(res.data);
          })
          .catch((err) => {
            sessionHandler(err, dispatch).then((res) => {
              userCustomCurationDataFetchApi(axis, listSize, pageNo, true).then(
                (res) => {
                  dataCleansing(res.data);
                }
              );
            });
          })
      );
    }
  };

  const modeSwitchHandler = () => {
    if (dataMode === "curation") {
      setDataMode("archive");
      setSelectedMenu({ X: {}, Y: {} });
      setSelectedAll(true);
    } else {
      setDataMode("curation");
      setSelectedMenu({ X: {}, Y: {} });
      setSelectedAll(true);
    }
  };

  const dataCleansing = (rawData) => {
    let _archiveDataList = [];
    let _rawArchiveDataList = rawData.docs;
    let _dcCount = rawData.dcCount;
    _rawArchiveDataList.forEach((item) => {
      const obj = {
        _id: item._id,
        doc_origin_title: item.doc_origin_title,
        doc_page: item.doc_page,
        doc_url: item.doc_url.replace("%3A", ":"),
        doc_publish_date: item.doc_publish_date,
        status: item.status,
        doc_country_list: item.doc_country.map((x) => x.CT_NM).join(", "),
        doc_publisher: item.doc_publisher,
      };
      _archiveDataList.push(obj);
    });
    setDcCount(_dcCount);
    setArchiveData(_archiveDataList);
  };

  const menuClickHandler = (axis, item) => {
    const _axisObj = { ...axisObj };
    _axisObj[axis] = { type: item.x_type, code: [item.x_code] };
    setSelectedMenu((prev) => ({ ...prev, [axis]: { code: item.x_code } }));
    setSelectedAll(false);
    dispatch(setAxis(_axisObj));
  };
  const listSizeHandler = (e) => {
    setListSize(e.target.value);
  };

  useEffect(() => {
    menuDataFetch(userInfo.id);
  }, [userInfo]);

  useEffect(() => {
    if (dataMode === "archive") {
      archiveDataFetch();
    }
  }, [dataMode, pageNo, listSize, axisObj]);

  return (
    <>
      <UserOnlyDataLookUpPage
        axisMenu={axisMenu}
        menuClickHandler={menuClickHandler}
        axisObj={axisObj}
        modeSwitchHandler={modeSwitchHandler}
        dataMode={dataMode}
        dcCount={dcCount}
        listSize={listSize}
        listSizeHandler={listSizeHandler}
        pageNo={pageNo}
        setPageNo={setPageNo}
        archiveData={archiveData}
        curationRequest={curationRequest}
        selectedMenu={selectedMenu}
        onClickAllMenu={onClickAllMenuButton}
        selectedAll={selectedAll}
      />
    </>
  );
}
export default UserOnlyDataLookUpPageContainer;
