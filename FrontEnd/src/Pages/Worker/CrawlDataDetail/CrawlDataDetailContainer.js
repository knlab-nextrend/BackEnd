import React, { useState, useEffect, useRef } from "react";
import {
  CrawlDataDetailFetchApi,
  CrawlDataRejectApi,
  CrawlDataStageApi,
  CrawlDataKeepApi,
  sessionHandler,
  crawlDataUpdateApi,
} from "../../../Utils/api";
import CrawlDataDetail from "./CrawlDataDetail";
import { useParams, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { trackPromise } from "react-promise-tracker";
import { LoadingWrapper } from "../../../Components/LoadingWrapper";
import { STATUS_CODE_SET } from "Data/crawlStatus";

function CrawlDataDetailContainer() {
  /* 
    라우터에서 받아온 정보. 
    _id - 해당 크롤 데이터의 id
    screeningStatus - 단계 상태 코드
  */
  const { _id, statusCode } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const crawlDataFormRef = useRef();
  /* 
    CrawlDataRefine > CrawlDataForm 에 있는 정보를 가져오기 위해서.
    부모 컴포넌트에서 자식 컴포넌트의 함수를 호출하는 상황임.
    CrawlDataForm 에 ref를.. 걸고자 함. 
  */

  const [docs, setDocs] = useState({}); // 폼에 default 값으로 출력할 데이터를 객체로 전달. 관리 편하게
  const [isLeave, setIsLeave] = useState(false); // 페이지 이동 및 나가기 여부

  /* 데이터 불러오기 */
  const dataFetch = () => {
    trackPromise(
      CrawlDataDetailFetchApi(statusCode, _id)
        .then((res) => {
          dataCleansing(res.data);
        })
        .catch((err) => {
          sessionHandler(err, dispatch).then((res) => {
            CrawlDataDetailFetchApi(statusCode, _id).then((res) => {
              dataCleansing(res.data);
            });
          });
        })
    );
  };

  /* 데이터 정제하기 */
  const dataCleansing = (rawData) => {
    const _rawStatusDetailData = rawData.docs;
    let _docs = {
      doc_content: _rawStatusDetailData.doc_content || "",
      doc_collect_date: _rawStatusDetailData.doc_collect_date || "",
      doc_write_date: _rawStatusDetailData.doc_write_date || "",
      doc_register_date: _rawStatusDetailData.doc_register_date || "",
      doc_publish_date: _rawStatusDetailData.doc_publish_date || "",
      doc_keyword: _rawStatusDetailData.doc_keyowrd || [], // 오타로 필드가 설정되어있어서 ...
      doc_publisher: _rawStatusDetailData.doc_publisher || "",
      doc_thumbnail: _rawStatusDetailData.doc_thumbnail || [],
      doc_country: _rawStatusDetailData.doc_country || [],
      doc_publish_country: _rawStatusDetailData.doc_publish_country || [],
      doc_category: _rawStatusDetailData.doc_category || [],
      doc_content_type: _rawStatusDetailData.doc_content_type || [],
      doc_topic: _rawStatusDetailData.doc_topic || [],
      doc_custom: _rawStatusDetailData.doc_custom || [],
      doc_content_category: _rawStatusDetailData.doc_content_category || [],
      doc_language: _rawStatusDetailData.doc_language || [],
      doc_page: _rawStatusDetailData.doc_page || 0,
      doc_origin_title: _rawStatusDetailData.doc_origin_title || "",
      doc_kor_title: _rawStatusDetailData.doc_kor_title || "",
      doc_kor_summary: _rawStatusDetailData.doc_kor_summary || "",
      doc_origin_summary: _rawStatusDetailData.doc_origin_summary || "",
      doc_url: _rawStatusDetailData.doc_url || "",
      doc_url_intro: _rawStatusDetailData.doc_url_intro || "",
      doc_project: _rawStatusDetailData.doc_project || "",
      doc_biblio: _rawStatusDetailData.doc_biblio || "",
      doc_relate_title: _rawStatusDetailData.doc_relate_title || "",
      doc_relate_url: _rawStatusDetailData.doc_relate_url || "",
      doc_bundle_title: _rawStatusDetailData.doc_bundle_title || "",
      doc_bundle_url: _rawStatusDetailData.doc_bundle_url || "",
      doc_memo: _rawStatusDetailData.doc_memo || "",
      doc_host: _rawStatusDetailData.doc_host || "",
      doc_recomment: _rawStatusDetailData.doc_recomment
        ? String.fromCharCode(_rawStatusDetailData.doc_recomment)
        : "", // 아스키코드..
      doc_publishing: _rawStatusDetailData.doc_publishing || "",
      doc_spare1: _rawStatusDetailData.doc_spare1,
      doc_spare2: _rawStatusDetailData.doc_spare2,

      item_id: _rawStatusDetailData.item_id,
    };
    setDocs(_docs);
  };

  const dataKeep = () => {
    if (!window.confirm("해당 데이터를 보류하시겠습니까?")) return;

    CrawlDataKeepApi(_id, statusCode).then((res) => {
      alert("해당 데이터에 대한 작업이 보류되었습니다.");
      if (statusCode === "6") {
        history.push(`/archive`); // 목록으로 돌아가기
      } else {
        history.push(`/crawl/${statusCode}`); // 목록으로 돌아가기
      }
    });
  };

  const dataReject = () => {
    if (!window.confirm("해당 데이터를 버리시겠습니까?")) return;

    CrawlDataRejectApi(_id, statusCode).then((res) => {
      alert("해당 데이터가 성공적으로 삭제되었습니다.");
      if (statusCode === "6") {
        history.push(`/archive`); // 목록으로 돌아가기
      } else if (statusCode === "8") {
        history.push(`/curation`);
      } else {
        history.push(`/crawl/${statusCode}`); // 목록으로 돌아가기
      }
    });
  };

  const dataStage = () => {
    if (!window.confirm("작업을 완료하시겠습니까?")) return;

    const _crawlDataFormDocs = crawlDataFormRef.current.getCrawlFormData();

    CrawlDataStageApi(statusCode, _id, _crawlDataFormDocs).then((res) => {
      alert("해당 데이터가 성공적으로 저장되었습니다.");
      if (statusCode === "6") {
        history.push(`/archive`); // 목록으로 돌아가기
      } else if (statusCode === "8") {
        history.push(`/curation`);
      } else {
        history.push(`/crawl/${statusCode}`); // 목록으로 돌아가기
      }
    });
  };

  const dataUpdate = () => {
    if (!window.confirm("작업을 완료하시겠습니까?")) return;

    const _crawlDataFormDocs = crawlDataFormRef.current.getCrawlFormData();
    crawlDataUpdateApi(statusCode, _id, _crawlDataFormDocs).then((res) => {
      alert("해당 데이터가 성공적으로 저장되었습니다.");
      if (statusCode === "6") {
        history.push(`/archive`); // 목록으로 돌아가기
      } else if (statusCode === "8") {
        history.push(`/curation`);
      } else {
        history.push(`/crawl/${statusCode}`); // 목록으로 돌아가기
      }
    });
  };

  const cancel = () => {
    if (
      !window.confirm("작업을 중단하시겠습니까?\n변경사항은 저장되지 않습니다.")
    )
      return;
    //documentDetachImageApi(itemId);
    history.push(`/crawl/${statusCode}`); // 목록으로 돌아가기
    if (statusCode === "6") {
      history.push(`/archive`); // 목록으로 돌아가기
    } else if (statusCode === "8") {
      history.push(`/curation`);
    } else {
      history.push(`/crawl/${statusCode}`); // 목록으로 돌아가기
    }
  };

  /* 이미지 핸들러 */
  const imageDetachHandler = () => {
    // if (confirm("변경사항은 저장되지 않습니다. 페이지를 닫겠습니까?")) {
    //   documentDetachImageApi(itemId).then((res) => {
    //   });
    // }
    // documentDetachImageApi(_id).then((res) => {
    // });
  };
  const leaveSetting = (e) => {
    // 명세에 따라 preventDefault는 호출해야하며, 기본 동작을 방지합니다.
    e.preventDefault();
    // 대표적으로 Chrome에서는 returnValue 설정이 필요합니다.
    e.returnValue = "";
  };

  useEffect(() => {
    window.addEventListener("beforeunload", leaveSetting);
    window.addEventListener("unload", imageDetachHandler);
    return () => {
      window.removeEventListener("beforeunload", leaveSetting);
      window.removeEventListener("unload", imageDetachHandler);
      imageDetachHandler();
    };
  }, []);

  useEffect(() => {
    dataFetch();
  }, [_id]);

  return (
    <LoadingWrapper>
      <CrawlDataDetail
        docs={docs}
        dataKeep={dataKeep}
        dataReject={dataReject}
        dataStage={dataStage}
        dataUpdate={dataUpdate}
        cancel={cancel}
        crawlDataFormRef={crawlDataFormRef}
        statusCode={statusCode}
        type={STATUS_CODE_SET[statusCode].type}
        _id={_id}
      />
    </LoadingWrapper>
  );
}

export default CrawlDataDetailContainer;
