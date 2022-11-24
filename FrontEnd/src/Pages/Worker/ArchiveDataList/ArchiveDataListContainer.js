import React, { useState, useEffect } from "react";
import ArchiveDataList from "./ArchiveDataList";
import { useDispatch } from "react-redux";
import { trackPromise } from "react-promise-tracker";

import { CrawlDataListFetchApi, sessionHandler } from "Utils/api";
import { LoadingWrapper } from "Components/LoadingWrapper";

const TAB_VALUES = {
  "아카이브 문서": 6,
  "큐레이션 선정 문서": 7,
};

const STATUS_CODE = 6;

function ArchiveDataListContainer() {
  const dispatch = useDispatch();
  /* 현재 보여질 데이터 */
  const [archiveDataList, setArchiveDataList] = useState([]);
  const [searchObj, setSearchObj] = useState(null); // 검색 옵션
  /* 페이지네이션 */
  const [dcCount, setDcCount] = useState(0); // document 총 개수
  const [pageNo, setPageNo] = useState(1); // 현재 활성화 된 페이지 번호
  const [listSize, setListSize] = useState(10); // 한 페이지에 나타낼 document 개수
  const [selectedTab, setSelectedTab] = useState("아카이브 문서");

  const onClickTab = (tabName) => {
    setSelectedTab(tabName);
  };

  /* 데이터 정제하기 */
  const dataCleansing = (rawData) => {
    let _archiveDataList = [];
    let _rawArchiveDataList = rawData.docs;
    let _dcCount = rawData.dcCount;
    _rawArchiveDataList.forEach((item) => {
      const obj = {
        _id: item._id,
        doc_kor_title: item.doc_kor_title,
        doc_origin_title: item.doc_origin_title,
        doc_origin_summary: item.doc_origin_summary,
        doc_kor_summary: item.doc_kor_summary,
        doc_page: item.doc_page,
        doc_country_list: item.doc_country.map((x) => x.CT_NM).join(", "),
        doc_category_list: item.doc_category.map((x) => x.CT_NM).join(", "),
        doc_url: item.doc_url.replace("%3A", ":"),
        is_crawled: item.is_crawled,
        doc_collect_date: item.doc_collect_date,
        doc_language: item.doc_language,
        doc_publisher: item.doc_publisher,
      };
      _archiveDataList.push(obj);
    });
    setDcCount(_dcCount);
    setArchiveDataList(_archiveDataList);
  };

  /* 필터 적용 데이터 받아오기 */

  const dataFilterFetch = (searchObj) => {
    setSearchObj(searchObj);
  };

  /* 데이터 불러오기 */
  const dataFetch = (searchObj = null) => {
    trackPromise(
      CrawlDataListFetchApi(
        TAB_VALUES[selectedTab],
        listSize,
        pageNo,
        searchObj
      )
        .then((res) => {
          dataCleansing(res.data);
        })
        .catch((err) => {
          sessionHandler(err, dispatch).then((res) => {
            CrawlDataListFetchApi(
              TAB_VALUES[selectedTab],
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

  useEffect(() => {
    dataFetch(searchObj);
  }, [selectedTab, pageNo, listSize, searchObj]);

  return (
    <LoadingWrapper>
      <ArchiveDataList
        archiveDataList={archiveDataList}
        statusCode={STATUS_CODE}
        dcCount={dcCount}
        listSize={listSize}
        setListSize={setListSize}
        pageNo={pageNo}
        setPageNo={setPageNo}
        dataFilterFetch={dataFilterFetch}
        selectedTab={selectedTab}
        onClickTab={onClickTab}
      />
    </LoadingWrapper>
  );
}
export default ArchiveDataListContainer;
