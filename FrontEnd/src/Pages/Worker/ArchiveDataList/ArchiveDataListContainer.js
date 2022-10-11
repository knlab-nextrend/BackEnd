import React, { useState, useEffect } from "react";
import ArchiveDataList from "./ArchiveDataList";
import { CrawlDataListFetchApi, sessionHandler } from "../../../Utils/api";
import { useDispatch } from "react-redux";
import { trackPromise } from "react-promise-tracker";

function ArchiveDataListContainer() {
  const dispatch = useDispatch();
  /* 현재 보여질 데이터 */
  const [archiveDataList, setArchiveDataList] = useState([]);
  const [searchObj, setSearchObj] = useState(null); // 검색 옵션
  /* 페이지네이션 */
  const [dcCount, setDcCount] = useState(0); // document 총 개수
  const [pageNo, setPageNo] = useState(1); // 현재 활성화 된 페이지 번호
  const [listSize, setListSize] = useState(10); // 한 페이지에 나타낼 document 개수

  const [isRequest,setIsRequest]=useState(false); // 큐레이션 선정 여부
  const onChangeRequestToggle = ()=>{
    setIsRequest(!isRequest)
  }
  const statusCode = 6;
  const [currentCode, setCurrentCode] = useState(statusCode);
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
        doc_kor_summary:item.doc_kor_summary,
        doc_page: item.doc_page,
        doc_country_list: item.doc_country.map((x) => x.CT_NM).join(", "),
        doc_category_list: item.doc_category.map((x) => x.CT_NM).join(", "),
        doc_url: item.doc_url.replace("%3A", ":"),
        is_crawled: item.is_crawled,
        doc_collect_date: item.doc_collect_date,
        doc_language: item.doc_language,
        doc_publisher:item.doc_publisher,
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
      CrawlDataListFetchApi(currentCode, listSize, pageNo, searchObj)
        .then((res) => {
          dataCleansing(res.data);
        })
        .catch((err) => {
          sessionHandler(err, dispatch).then((res) => {
            CrawlDataListFetchApi(currentCode, listSize, pageNo, searchObj).then(
              (res) => {
                dataCleansing(res.data);
              }
            );
          });
        })
    );
  };

  useEffect(() => {
    dataFetch(searchObj);
  }, [currentCode,pageNo, listSize, searchObj]);

  useEffect(() => {
    const code = isRequest ? Number(statusCode) + 1 : Number(statusCode);
    setCurrentCode(code);
  }, [isRequest]);

  return (
    <>
      <ArchiveDataList
        archiveDataList={archiveDataList}
        statusCode={statusCode}
        dcCount={dcCount}
        listSize={listSize}
        setListSize={setListSize}
        pageNo={pageNo}
        setPageNo={setPageNo}
        dataFilterFetch={dataFilterFetch}
        onChangeRequestToggle={onChangeRequestToggle}
        isRequest={isRequest}
      />
    </>
  );
}
export default ArchiveDataListContainer;
