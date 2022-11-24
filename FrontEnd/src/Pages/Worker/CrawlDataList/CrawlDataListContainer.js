import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { trackPromise } from "react-promise-tracker";

import { CrawlDataListFetchApi, sessionHandler } from "Utils/api";
import { LoadingWrapper } from "Components/LoadingWrapper";

import CrawlDataList from "./CrawlDataList";

// data를 fetch할 때 보류면 statuscode+1을 한다.
const TAB_VALUES = {
  대기: false,
  보류: true,
};

function CrawlDataListContainer() {
  const dispatch = useDispatch();
  /* 현재 보여질 데이터 */
  const [crawlDataList, setCrawlDataList] = useState([]);
  const [searchObj, setSearchObj] = useState(null); // 검색 옵션

  /* refine, register 를 router로 부터 받아와서 구분하도록 함.... */
  const { statusCode } = useParams();
  const [currentCode, setCurrentCode] = useState(statusCode);

  /* 페이지네이션 */
  const [dcCount, setDcCount] = useState(0); // document 총 개수
  const [pageNo, setPageNo] = useState(1); // 현재 활성화 된 페이지 번호
  const [listSize, setListSize] = useState(10); // 한 페이지에 나타낼 document 개수
  const [selectedTab, setSelectedTab] = useState("대기");

  const onClickTab = (tabName) => {
    setSelectedTab(tabName);
    //보류면 statusCode + 1 대기면 기본 statusCode
    const newCode = TAB_VALUES[tabName]
      ? Number(statusCode) + 1
      : Number(statusCode);
    setCurrentCode(newCode);
  };

  const dataCleansing = (rawData) => {
    let _crawlDataList = [];
    let _rawCrawlDataList = rawData.docs;
    let _dcCount = rawData.dcCount;

    _rawCrawlDataList.forEach((item, index) => {
      const obj = {
        doc_origin_title: item.doc_origin_title,
        doc_kor_title: item.doc_kor_title,
        doc_keyword: item.doc_keyowrd,
        doc_collect_date: item.doc_collect_date.substring(0, 10),
        _id: item._id,
        item_id: item.item_id,
        stat: item.stat,
        doc_language: item.doc_language,
        doc_page: item.doc_page,
        doc_url: item.doc_url,
        doc_origin_summary: item.doc_origin_summary,
        doc_publisher: item.doc_publisher,
      };
      _crawlDataList.push(obj);
    });
    setDcCount(_dcCount);
    setCrawlDataList(_crawlDataList);
  };

  /* 데이터 불러오기 */
  const dataFetch = (searchObj = null) => {
    trackPromise(
      CrawlDataListFetchApi(currentCode, listSize, pageNo, searchObj)
        .then((res) => {
          console.log(res.data);
          dataCleansing(res.data);
        })
        .catch((err) => {
          sessionHandler(err, dispatch).then((res) => {
            CrawlDataListFetchApi(
              currentCode,
              listSize,
              pageNo,
              searchObj
            ).then((res) => {
              dataCleansing(res.data);
            });
          });
        })
    );
  };

  const dataFilterFetch = (searchObj) => {
    setSearchObj(searchObj);
  };

  /* pageNo, statusCode 가 변경되었을 때 데이터를 다시 불러옴 */
  useEffect(() => {
    dataFetch(searchObj);
  }, [pageNo, currentCode, listSize, searchObj]);
  return (
    <LoadingWrapper>
      <CrawlDataList
        statusCode={statusCode}
        crawlDataList={crawlDataList}
        dcCount={dcCount}
        listSize={listSize}
        setListSize={setListSize}
        pageNo={pageNo}
        setPageNo={setPageNo}
        selectedTab={selectedTab}
        onClickTab={onClickTab}
        dataFilterFetch={dataFilterFetch}
      />
    </LoadingWrapper>
  );
}
export default CrawlDataListContainer;
