import React, { useState, useEffect } from "react";
import {
  CrawlDataListFetchApi,
  fetchLegacyDocumentlistApi,
  sessionHandler,
} from "../../../Utils/api";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { trackPromise } from "react-promise-tracker";
import LegacyDataList from "./LegacyDatalist";
import { LoadingWrapper } from "../../../Components/LoadingWrapper";

function LegacyDataListContainer() {
  const [curationDataList, setCurationDataList] = useState([]);
  const userInfo = useSelector((state) => state.user.user);

  const axisObj = useSelector((state) => state.custom.axisObj);

  const [searchObj, setSearchObj] = useState(null); // 검색 옵션
  const [searchInput, setSearchInput] = useState("");

  /* 페이지네이션 */
  const [dcCount, setDcCount] = useState(0); // document 총 개수
  const [pageNo, setPageNo] = useState(1); // 현재 활성화 된 페이지 번호
  const [listSize, setListSize] = useState(50); // 한 페이지에 나타낼 document 개수

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
        doc_country_list: item.doc_country
          ? item.doc_country.map((x) => x.CT_NM).join(", ")
          : null,
        doc_publish_country_list: item.doc_publish_country
          ? item.doc_publish_country.map((x) => x.CT_NM).join(", ")
          : null,
        doc_category_list: item.doc_category
          ? item.doc_category.map((x) => x.CT_NM).join(", ")
          : null,
        doc_register_date: item.doc_register_date
          ? item.doc_register_date.substring(0, 10)
          : null,

        doc_content_type_list: item.doc_content_type
          ? item.doc_content_type.map((x) => x.CT_NM).join(", ")
          : null,
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
      fetchLegacyDocumentlistApi(pageNo, general, query)
        .then((res) => {
          console.log(res.data);
          dataCleansing(res.data);
        })
        .catch((err) => {
          console.error(err);
          sessionHandler(err, dispatch).then((res) => {
            fetchLegacyDocumentlistApi(
              listSize,
              pageNo,
              searchObj,
              general,
              query
            ).then((res) => {
              dataCleansing(res.data);
            });
          });
        })
    );
  };

  const onSearch = () => {
    dataFetch(null, true, searchInput);
  };

  useEffect(() => {
    if (storedViewType !== null) setViewType(storedViewType);
  });

  useEffect(() => {
    dataFetch(searchObj, false, searchInput);
  }, [pageNo, listSize, axisObj, searchObj]);

  return (
    <LoadingWrapper>
      <LegacyDataList
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
    </LoadingWrapper>
  );
}
export default LegacyDataListContainer;
