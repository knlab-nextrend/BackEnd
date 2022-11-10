import React, { useState, useEffect } from "react";
import CurationDataList from "./CurationDataList";
import {
  CrawlDataListFetchApi,
  userCustomCurationDataFetchApi,
  sessionHandler,
} from "../../../Utils/api";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { trackPromise } from "react-promise-tracker";

function UserCurationDataListContainer() {
  const [curationDataList, setCurationDataList] = useState([]);
  const userInfo = useSelector((state) => state.user.user);
  const axisObj = useSelector((state) => state.custom.axisObj);
  const [searchObj, setSearchObj] = useState(null); // 검색 옵션
  const [searchInput, setSearchInput] = useState("");

  /* 페이지네이션 */
  const [dcCount, setDcCount] = useState(0); // document 총 개수
  const [pageNo, setPageNo] = useState(1); // 현재 활성화 된 페이지 번호
  const [listSize, setListSize] = useState(10); // 한 페이지에 나타낼 document 개수

  const [viewType, setViewType] = useState("list"); //viewType : list,card1, card2

  const dispatch = useDispatch();
  const statusCode = 8;
  const storedViewType = localStorage.getItem("curationViewType");

  const viewTypeHandler = (e) => {
    setViewType(e.target.value);
    localStorage.setItem("curationViewType", e.target.value);
  };

  const history = useHistory();
  const handleRowClick = (_id) => {
    history.push(
      `/${userInfo.permission !== 0 ? "curation" : "library"}/${_id}`
    );
  };

  /* 데이터 정제하기 */
  const dataCleansing = (rawData) => {
    let _curationDataList = [];
    let _rawCurationDataList = rawData.docs;
    let _dcCount = rawData.dcCount;

    _rawCurationDataList.forEach((item) => {
      const obj = {
        _id: item._id,
        doc_origin_title: item.doc_origin_title,
        doc_kor_title: item.doc_kor_title,
        doc_page: item.doc_page,
        doc_thumbnail: item.doc_thumbnail,
        doc_country_list: item.doc_country.map((x) => x.CT_NM).join(", "),
        doc_publish_country_list: item.doc_publish_country
          .map((x) => x.CT_NM)
          .join(", "),
        doc_category_list: item.doc_category.map((x) => x.CT_NM).join(", "),
        doc_register_date: item.doc_register_date
          ? item.doc_register_date.substring(0, 10)
          : null,

        doc_content_type_list: item.doc_content_type
          .map((x) => x.CT_NM)
          .join(", "),
        doc_content: item.doc_content
          ? item.doc_content.replace(/(<([^>]+)>)/gi, "")
          : "", // 태그 삭제 정규표현식
        doc_url: item.doc_url,
        doc_publisher: item.doc_publisher,
      };
      _curationDataList.push(obj);
    });

    setDcCount(_dcCount);

    setCurationDataList(_curationDataList);
  };

  const dataFilterFetch = (searchObj) => {
    setSearchObj(searchObj);
  };

  /* 데이터 불러오기 */
  const dataFetch = (searchObj = null, general = false, query) => {
    trackPromise(
      CrawlDataListFetchApi(
        statusCode,
        listSize,
        pageNo,
        searchObj,
        general,
        query
      )
        .then((res) => {
          console.log(res.data);
          dataCleansing(res.data);
        })
        .catch((err) => {
          console.error(err);
          sessionHandler(err, dispatch).then((res) => {
            CrawlDataListFetchApi(statusCode, listSize, pageNo, searchObj).then(
              (res) => {
                dataCleansing(res.data);
              }
            );
          });
        })
    );
  };

  const customDataFetch = () => {
    if (axisObj.X !== null && axisObj.Y !== null) {
      let axis = {};
      axis[axisObj.X.type] = axisObj.X.code;
      axis[axisObj.Y.type] = axisObj.Y.code;
      trackPromise(
        userCustomCurationDataFetchApi(axis)
          .then((res) => {
            dataCleansing(res.data);
          })
          .catch((err) => {
            sessionHandler(err, dispatch).then((res) => {
              userCustomCurationDataFetchApi(axis).then((res) => {
                dataCleansing(res.data);
              });
            });
          })
      );
    }
  };

  const onSearch = () => {
    dataFetch(null, true, searchInput);
  };

  useEffect(() => {
    if (storedViewType !== null) setViewType(storedViewType);
  });

  useEffect(() => {
    if (axisObj.X === null) {
      dataFetch(searchObj, false, searchInput);
    } else {
      customDataFetch();
    }
  }, [pageNo, listSize, axisObj, searchObj]);

  return (
    <>
      <CurationDataList
        curationDataList={curationDataList}
        statusCode={statusCode}
        dcCount={dcCount}
        listSize={listSize}
        setListSize={setListSize}
        pageNo={pageNo}
        setPageNo={setPageNo}
        viewTypeHandler={viewTypeHandler}
        viewType={viewType}
        handleRowClick={handleRowClick}
        userInfo={userInfo}
        dataFilterFetch={dataFilterFetch}
        setSearchInput={setSearchInput}
        onSearch={onSearch}
      />
    </>
  );
}
export default UserCurationDataListContainer;
