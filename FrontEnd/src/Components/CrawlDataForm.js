import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { setModal, setModalData, setCategoryModalType } from "../Modules/modal";
import { MdSettings } from "react-icons/md";
import Editor from "./Editor";
import { myColors, tailwindColors } from "styles/colors";
import { BsPlusCircle, BsXCircle } from "react-icons/bs";

/* forwordRef는 부모 컴포넌트에서 자식 컴포넌트를 컨트롤하기 위해 */
function CrawlDataForm({ docs, type, _id }, ref) {
  const dispatch = useDispatch();

  const [itemId, setItemId] = useState("");
  /* 현재 보여질 데이터 정보들 */
  /* redux에서 관리되는 데이터 */
  const docCategory = useSelector(
    (state) => state.modal.modalData.doc_category
  ); // dc_code > doc_category 문서의 정책 분류
  const docContentCategory = useSelector(
    (state) => state.modal.modalData.doc_content_category
  ); // doc_content_category 문서 내용의 성격 구분
  const docContentType = useSelector(
    (state) => state.modal.modalData.doc_content_type
  ); // doc_content_type 문서의 유형 분류
  const docCountry = useSelector((state) => state.modal.modalData.doc_country); // dc_country > doc_country 문서 대상 국가
  const docPublishCountry = useSelector(
    (state) => state.modal.modalData.doc_publish_country
  ); // dc_country_pub > doc_publish_country 문서 발행 국가
  const docCustom = useSelector((state) => state.modal.modalData.doc_custom); // doc_custom 기관 맞춤형 카테고리
  const docLanguage = useSelector(
    (state) => state.modal.modalData.doc_language
  ); // dc_lang > doc_language 문서 언어
  const docTopic = useSelector((state) => state.modal.modalData.doc_topic); // doc_topic 문서 내용의 이슈 주제 분류
  const docHost = useSelector((state) => state.modal.modalData.doc_host); // doc_host, doc_publisher host 및 발급기관명 관리
  /* 현재 보여질 데이터 정보들 */
  const [docContent, setDocContent] = useState(""); // dc_content > doc_content 문서 본문
  //const [docHost, setDocHost] = useState(""); // dc_host > doc_host 기관 host 도메인
  const [docKeyword, setDocKeyword] = useState(""); // dc_keyword > doc_keyword 키워드 검색단어. 받아올 떈 배열이나 관리는 문자열로 할 예정. 현재 db 필드에는 doc_keyowrd 로 되어있음..
  const [docKorSummary, setDocKorSummary] = useState(""); // dc_smry_kr > doc_kor_summary 문서 한글 요약
  const [docOriginSummary, setDocOriginSummary] = useState(""); // dc_smry_or > doc_origin_summary 문서 원문 요약
  const [docKorTitle, setDocKorTitle] = useState(""); // dc_title_kr > doc_kor_title 문서 한글 제목
  const [docOriginTitle, setDocOriginTitle] = useState(""); // dc_title_or > doc_kor_origin 문서 원문제목
  const [docMemo, setDocMemo] = useState(""); // doc_memo 관리자 전용 메모
  const [docPage, setDocPage] = useState(""); // dc_page > doc_page 문서 페이지 수
  const [docBiblio, setDocBiblio] = useState(""); // doc_biblio 문서의 서지사항
  const [docPublisher, setDocPublisher] = useState(""); // doc_publisher 문서 발급 기관명
  const [docPublishing, setDocPublishing] = useState(""); // doc_publishing 주문형 조사과제명의 세부과업명
  const [docRecomment, setDocRecomment] = useState(""); // doc_recomment 큐레이션 추천문서
  const [docPublishDate, setDocPublishDate] = useState(""); // doc_publish_date 수집 문서의 발행일
  const [docWriteDate, setDocWriteDate] = useState(""); // doc_write_date 수집 문서의 작성일
  const [docRegisterDate, setDocRegisterDate] = useState(""); // doc_register_date 문서의 서비스 등록일
  const [docCollectDate, setDocCollectDate] = useState(""); // doc_collect_date 문서 수집일 (크롤링 일)
  const [docBundleTitle, setDocBundleTitle] = useState(""); // doc_bundle_title 묶음문서 제목
  const [docBundleUrl, setDocBundleUrl] = useState(""); // doc_bundle_url 묶음문서 링크
  const [docRelateTitle, setDocRelateTitle] = useState(""); // doc_relate_title 연관문서 제목
  const [docRelateUrl, setDocRelateUrl] = useState(""); // doc_relate_url 연관문서 링크
  const [docThumbnail, setDocThumbnail] = useState([]); // dc_cover > doc_thumbnail 문서 표지 파일
  const [docUrl, setDocUrl] = useState(""); // dc_url_loc > doc_url 문서의 파일이 위치한 url
  const [docUrlIntro, setDocUrlIntro] = useState(""); // dc_url_intro > doc_url_intro 문서 파일의 안내 url
  const [docProject, setDocProject] = useState(""); // doc_project 조사과제명
  /* 데이터 관리 및 저장용 변수 */
  const [docThumbnailSelect, setDocThumbnailSelect] = useState(""); // doc_thumbnail 에서 고른 표지
  const [docKeywordString, setDocKeywordString] = useState(""); // doc_keyword를 string으로 관리하기 위한 변수

  /* 데이터 저장용 변수 */
  const [docCategoryIndexList, setDocCategoryIndexList] = useState([]); // doc_category의 index리스트. 데이터 저장용 변수
  const [docCountryIndexList, setDocCountryIndexList] = useState([]); // doc_country의 index리스트. 데이터 저장용 변수
  const [docPublishCountryIndexList, setDocPublishCountryIndexList] = useState(
    []
  ); // doc_publish_country의 index리스트. 데이터 저장용 변수
  const [docLanguageIndexList, setDocLanguageIndexList] = useState([]); // doc_language의 index리스트. 데이터 저장용 변수
  const [docContentCategoryIndexList, setDocContentCategoryIndexList] =
    useState([]); // doc_content_category의 index리스트. 데이터 저장용 변수
  const [docContentTypeIndexList, setDocContentTypeIndexList] = useState([]); // doc_content_type의 index리스트. 데이터 저장용 변수.
  const [docCustomIndexList, setDocCustomIndexList] = useState([]); // doc_custom의 index리스트. 데이터 저장용 변수
  const [docTopicIndexList, setDocTopicIndexList] = useState([]); // doc_topic 의 index리스트. 데이터 저장용 변수

  const [uploadThumbnailList, setUploadThumbnailList] = useState([]);
  const [uploadThumbnailSrcList, setUploadThumbnailSrcList] = useState([]);

  /* 데이터 값 핸들러 */
  const _docKorSummaryHandler = (e) => {
    setDocKorSummary(e.target.value);
  };
  const _docOriginSummaryHandler = (e) => {
    setDocOriginSummary(e.target.value);
  };
  const _docKorTitleHandler = (e) => {
    setDocKorTitle(e.target.value);
  };
  const _docOriginTitleHandler = (e) => {
    setDocOriginTitle(e.target.value);
  };
  const _docMemoHandler = (e) => {
    setDocMemo(e.target.value);
  };
  const _docPageHandler = (e) => {
    setDocPage(e.target.value);
  };
  const _docBiblioHandler = (e) => {
    setDocBiblio(e.target.value);
  };
  const _docPublisherHandler = (e) => {
    setDocPublisher(e.target.value);
  };
  const _docPublishingHandler = (e) => {
    setDocPublishing(e.target.value);
  };
  const _docRecommentHandler = (e) => {
    e.target.value = e.target.value.replace(/[^A-Za-z]/gi, "");
    setDocRecomment(e.target.value);
  };
  const _docPublishDateHandler = (e) => {
    setDocPublishDate(e.target.value);
  };
  const _docWriteDateHandler = (e) => {
    setDocWriteDate(e.target.value);
  };
  const _docRegisterDateHandler = (e) => {
    setDocRegisterDate(e.target.value);
  };
  const _docCollectDateHandler = (e) => {
    setDocCollectDate(e.target.value);
  };
  const _docBundleTitleHandler = (e) => {
    setDocBundleTitle(e.target.value);
  };
  const _docBundleUrlHandler = (e) => {
    setDocBundleUrl(e.target.value);
  };
  const _docRelateTitleHandler = (e) => {
    setDocRelateTitle(e.target.value);
  };
  const _docRelateUrlHandler = (e) => {
    setDocRelateUrl(e.target.value);
  };
  const _docUrlHandler = (e) => {
    setDocUrl(e.target.value);
  };
  const _docUrlIntroHandler = (e) => {
    setDocUrlIntro(e.target.value);
  };
  const _docProjectHandler = (e) => {
    setDocProject(e.target.value);
  };

  const _docKeywordStringHandler = (e) => {
    setDocKeywordString(e.target.value);
  };
  const _docThumbnailSelectHandler = (e) => {
    setDocThumbnailSelect(e.target.value);
  };
  const _docContentHandler = (data) => {
    setDocContent(data);
  };

  const _openCategoryModal = (categoryModalType) => {
    dispatch(setModal("CategoryModal"));
    dispatch(setCategoryModalType(categoryModalType));
  };

  const _openHostSelectModal = () => {
    dispatch(setModal("HostSelectModal"));
  };
  /* 부모 컴포넌트에서 호출할 수 있는 함수.*/
  /* input state 값들을 객체에 담아서 반환함.*/
  useImperativeHandle(ref, () => ({
    getCrawlFormData() {
      let _docs = {};
      _docs["doc_content"] = docContent;
      _docs["doc_write_date"] = docWriteDate;
      _docs["doc_publish_date"] = docPublishDate;
      _docs["doc_collect_date"] = docCollectDate;
      _docs["doc_register_date"] = docRegisterDate;
      _docs["doc_keyowrd"] = docKeyword; // 오타로 필드가 설정되어있음..
      _docs["doc_kor_title"] = docKorTitle;
      _docs["doc_origin_title"] = docOriginTitle;
      _docs["doc_kor_summary"] = docKorSummary;
      _docs["doc_origin_summary"] = docOriginSummary;
      _docs["doc_page"] = docPage;
      _docs["doc_host"] = docHost && docHost.IDX;
      _docs["doc_url"] = docUrl;
      _docs["doc_url_intro"] = docUrlIntro;
      _docs["doc_project"] = docProject;
      _docs["doc_biblio"] = docBiblio;
      _docs["doc_memo"] = docMemo;
      _docs["doc_publisher"] = docPublisher;
      _docs["doc_publishing"] = docPublishing;
      _docs["doc_recomment"] = docRecomment.charCodeAt(0);
      _docs["doc_bundle_title"] = docBundleTitle;
      _docs["doc_bundle_url"] = docBundleUrl;
      _docs["doc_relate_title"] = docRelateTitle;
      _docs["doc_relate_url"] = docRelateUrl;
      _docs["doc_keyowrd"] = docKeyword;
      _docs["doc_category"] = docCategoryIndexList;
      _docs["doc_country"] = docCountryIndexList;
      _docs["doc_publish_country"] = docPublishCountryIndexList;
      _docs["doc_language"] = docLanguageIndexList;
      _docs["doc_content_category"] = docContentCategoryIndexList;
      _docs["doc_content_type"] = docContentTypeIndexList;
      _docs["doc_custom"] = docCustomIndexList;
      _docs["doc_topic"] = docTopicIndexList;

      _docs["doc_thumbnail"] =
        type !== "screening" && type !== "refine" && type !== "register"
          ? docThumbnailSelect
          : docThumbnail;

      _docs["item_id"] = itemId;
      return _docs;
    },
  }));

  const onChangeThumbnailAddInput = (e) => {
    [...e.target.files].forEach((image) => {
      setUploadThumbnailList((prev) => [...prev, image]);
      encodeFileToBase64(image);
    });
    e.target.value = null;
  };

  const encodeFileToBase64 = (fileBlob) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileBlob);
    reader.onload = () => {
      setUploadThumbnailSrcList((prev) => [...prev, reader.result]);
    };
  };

  const deleteUploadThumbnail = (index) => {
    setUploadThumbnailList((prev) => prev.filter((v, i) => i !== index));
    setUploadThumbnailSrcList((prev) => prev.filter((v, i) => i !== index));
  };

  useEffect(() => {
    /* docs가 빈 객체가 아니라면 */
    if (Object.keys(docs).length !== 0) {
      setItemId(docs.item_id);
      setDocContent(
        docs.doc_content.replaceAll("\n", "<p><br datacke-filter='true'></p>")
      ); // /n 개행 태그를 <br/> 태그로 치환하여 공백을 그대로 출력
      setDocWriteDate(
        docs.doc_write_date && docs.doc_write_date.substring(0, 10)
      ); // date 객체에 넣어주기
      setDocRegisterDate(
        docs.doc_register_date && docs.doc_register_date.substring(0, 10)
      );
      setDocPublishDate(
        docs.doc_publish_date && docs.doc_publish_date.substring(0, 10)
      );
      setDocCollectDate(
        docs.doc_collect_date && docs.doc_collect_date.substring(0, 10)
      );
      setDocKeywordString(docs.doc_keyword && docs.doc_keyword.join(", "));
      setDocThumbnail(docs.doc_thumbnail);
      setDocThumbnailSelect(
        type === "archive" ? docs.doc_thumbnail[0] : docs.doc_thumbnail
      );
      setDocOriginSummary(docs.doc_origin_summary);
      setDocKorSummary(docs.doc_kor_summary);
      setDocPublisher(docs.doc_publisher);
      setDocPublishing(docs.doc_publishing);
      setDocPage(docs.doc_page);
      setDocOriginTitle(docs.doc_origin_title);
      setDocKorTitle(docs.doc_kor_title);
      setDocUrl(docs.doc_url);
      setDocUrlIntro(docs.doc_url_intro);
      setDocRelateTitle(docs.doc_relate_title);
      setDocRelateUrl(docs.doc_relate_url);
      setDocBundleTitle(docs.doc_bundle_title);
      setDocBundleUrl(docs.doc_bundle_url);
      setDocRecomment(docs.doc_recomment);
      setDocBiblio(docs.doc_biblio);
      setDocMemo(docs.doc_memo);

      dispatch(setModalData(docs.doc_category, "doc_category"));
      dispatch(setModalData(docs.doc_country, "doc_country"));
      dispatch(setModalData(docs.doc_publish_country, "doc_publish_country"));
      dispatch(setModalData(docs.doc_language, "doc_language"));
      dispatch(setModalData(docs.doc_custom, "doc_custom"));
      dispatch(setModalData(docs.doc_topic, "doc_topic"));
      dispatch(setModalData(docs.doc_content_category, "doc_content_category"));
      dispatch(setModalData(docs.doc_content_type, "doc_content_type"));
      dispatch(setModalData(docs.doc_host[0], "doc_host"));
    }
  }, [docs]);

  useEffect(() => {
    /* dcKeywordString 값이 변경되면 dcKeyword 배열도 자동으로 반영되도록.*/
    setDocKeyword(docKeywordString.split(",").map((item) => item.trim()));
  }, [docKeywordString]);

  useEffect(() => {
    const _list = docCountry.map((item) => item.CODE);
    setDocCountryIndexList(_list);
  }, [docCountry]);

  useEffect(() => {
    const _list = docCategory.map((item) => item.CODE);
    setDocCategoryIndexList(_list);
  }, [docCategory]);

  useEffect(() => {
    const _list = docPublishCountry.map((item) => item.CODE);
    setDocPublishCountryIndexList(_list);
  }, [docPublishCountry]);

  useEffect(() => {
    const _list = docLanguage.map((item) => item.CODE);
    setDocLanguageIndexList(_list);
  }, [docLanguage]);

  useEffect(() => {
    const _list = docContentCategory.map((item) => item.CODE);
    setDocContentCategoryIndexList(_list);
  }, [docContentCategory]);

  useEffect(() => {
    const _list = docContentType.map((item) => item.CODE);
    setDocContentTypeIndexList(_list);
  }, [docContentType]);

  useEffect(() => {
    const _list = docCustom.map((item) => item.CODE);
    setDocCustomIndexList(_list);
  }, [docCustom]);

  useEffect(() => {
    const _list = docTopic.map((item) => item.CODE);
    setDocTopicIndexList(_list);
  }, [docTopic]);

  return (
    <Wrap>
      <CustomFormRow>
        <CustomFormItem>
          <p className="title">원제목</p>
          <input
            value={docOriginTitle}
            onChange={_docOriginTitleHandler}
            className="form"
            type="text"
            placeholder="원문 제목을 입력하세요"
          />
        </CustomFormItem>
        <CustomFormItem>
          <p className="title">한글제목</p>
          <input
            value={docKorTitle}
            onChange={_docKorTitleHandler}
            className="form"
            type="text"
            placeholder="한글 제목을 입력하세요"
          />
        </CustomFormItem>
      </CustomFormRow>
      <CustomFormRow>
        <CustomFormItem>
          <p className="title">원문 요약</p>
          <input
            value={docOriginSummary}
            onChange={_docOriginSummaryHandler}
            className="form"
            type="text"
            placeholder="원문 요약을 입력하세요"
          />
        </CustomFormItem>
      </CustomFormRow>
      <CustomFormRow>
        <CustomFormItem>
          <p className="title">한글 요약</p>
          <input
            value={docKorSummary}
            onChange={_docKorSummaryHandler}
            className="form"
            type="text"
            placeholder="한글 요약을 입력하세요"
          />
        </CustomFormItem>
      </CustomFormRow>
      {type !== "refine" && (
        <>
          <CustomFormRow>
            <CustomFormItem>
              <div className="title">
                <p>문서 정책 분류</p>
                <button
                  onClick={() => {
                    _openCategoryModal("doc_category");
                  }}
                >
                  <MdSettings /> 설정
                </button>
              </div>
              <div className="form notInput">
                {docCategory.map((item, index) => {
                  return <CustomList key={index}>{item.CT_NM}</CustomList>;
                })}
              </div>
            </CustomFormItem>
            <CustomFormItem>
              <div className="title">
                <p>문서 토픽 분류</p>
                <button
                  onClick={() => {
                    _openCategoryModal("doc_topic");
                  }}
                >
                  <MdSettings /> 설정
                </button>
              </div>
              <div className="form notInput">
                {docTopic.map((item, index) => {
                  return <CustomList key={index}>{item.CT_NM}</CustomList>;
                })}
              </div>
            </CustomFormItem>
          </CustomFormRow>
          <CustomFormRow>
            <CustomFormItem>
              <div className="title">
                <p>문서 대상 국가</p>
                <button
                  onClick={() => {
                    _openCategoryModal("doc_country");
                  }}
                >
                  <MdSettings /> 설정
                </button>
              </div>
              <div className="form notInput">
                {docCountry.map((item, index) => {
                  return <CustomList key={index}>{item.CT_NM}</CustomList>;
                })}
              </div>
            </CustomFormItem>
            <CustomFormItem>
              <div className="title">
                <p>문서 발급 국가</p>
                <button
                  onClick={() => {
                    _openCategoryModal("doc_publish_country");
                  }}
                >
                  <MdSettings /> 설정
                </button>
              </div>
              <div className="form notInput">
                {docPublishCountry.map((item, index) => {
                  return <CustomList key={index}>{item.CT_NM}</CustomList>;
                })}
              </div>
            </CustomFormItem>
          </CustomFormRow>
          <CustomFormRow>
            <CustomFormItem>
              <div className="title">
                <p>문서 유형 분류</p>
                <button
                  onClick={() => {
                    _openCategoryModal("doc_content_type");
                  }}
                >
                  <MdSettings /> 설정
                </button>
              </div>
              <div className="form notInput">
                {docContentType.map((item, index) => {
                  return <CustomList key={index}>{item.CT_NM}</CustomList>;
                })}
              </div>
            </CustomFormItem>
            <CustomFormItem>
              <div className="title">
                <p>문서 내용 구분 분류</p>
                <button
                  onClick={() => {
                    _openCategoryModal("doc_content_category");
                  }}
                >
                  <MdSettings /> 설정
                </button>
              </div>
              <div className="form notInput">
                {docContentCategory.map((item, index) => {
                  return <CustomList key={index}>{item.CT_NM}</CustomList>;
                })}
              </div>
            </CustomFormItem>
          </CustomFormRow>
          <CustomFormRow>
            <CustomFormItem>
              <div className="title">
                <p>기관맞춤형 분류</p>
                <button
                  onClick={() => {
                    _openCategoryModal("doc_custom");
                  }}
                >
                  <MdSettings /> 설정
                </button>
              </div>
              <div className="form notInput">
                {docCustom.map((item, index) => {
                  return <CustomList key={index}>{item.CT_NM}</CustomList>;
                })}
              </div>
            </CustomFormItem>
          </CustomFormRow>
        </>
      )}
      <CustomFormRow>
        <CustomFormItem>
          <p className="title">문서 위치 URL</p>
          <input
            value={docUrl}
            onChange={_docUrlHandler}
            className="form"
            type="text"
            placeholder="문서 파일이 위치한 URL을 입력하세요"
          />
        </CustomFormItem>
        <CustomFormItem>
          <p className="title">문서 안내 URL</p>
          <input
            value={docUrlIntro}
            onChange={_docUrlIntroHandler}
            className="form"
            type="text"
            placeholder="문서 안내 URL을 입력하세요"
          />
        </CustomFormItem>
      </CustomFormRow>
      <CustomFormRow>
        <CustomFormItem>
          <div className="title">
            <p>HOST 도메인</p>
            <button onClick={_openHostSelectModal}>
              <MdSettings /> 설정
            </button>
          </div>
          <div className="host">
            <span>{docHost && docHost.HOST}</span>
            <button
              className="host-reset-btn"
              onClick={() => dispatch(setModalData("", "doc_host"))}
            >
              X비우기
            </button>
          </div>
        </CustomFormItem>
        <CustomFormItem>
          <p className="title">발급기관 명</p>
          <input
            value={docPublisher}
            onChange={_docPublisherHandler}
            className="form"
            type="text"
            placeholder="발급기관명을 입력해주세요."
          />
        </CustomFormItem>
      </CustomFormRow>
      <CustomFormRow>
        <CustomFormItem>
          <div className="title">
            <p>언어</p>
            <button
              onClick={() => {
                _openCategoryModal("doc_language");
              }}
            >
              <MdSettings /> 선택
            </button>
          </div>
          <div className="form notInput">
            {docLanguage.map((item, index) => {
              return <CustomList key={index}>{item.CT_NM}</CustomList>;
            })}
          </div>
        </CustomFormItem>
        <CustomFormItem>
          <p className="title">페이지 수</p>
          <input
            value={docPage}
            onChange={_docPageHandler}
            className="form"
            placeholder="문서의 페이지 수를 입력하세요"
            type="number"
            min="0"
          />
        </CustomFormItem>
      </CustomFormRow>
      <CustomFormRow>
        <CustomFormItem>
          <p className="title">원문 작성일</p>
          <input
            value={docWriteDate}
            onChange={_docWriteDateHandler}
            className="form"
            type="date"
            placeholder="원문이 작성된 날짜를 입력하세요"
          />
        </CustomFormItem>
        <CustomFormItem>
          <p className="title">원문 발행일</p>
          <input
            value={docPublishDate}
            onChange={_docPublishDateHandler}
            className="form"
            type="date"
            placeholder="원문이 발행된 날짜를 입력하세요"
          />
        </CustomFormItem>
      </CustomFormRow>
      <CustomFormRow>
        <CustomFormItem>
          <p className="title">데이터 수집일</p>
          <input
            value={docCollectDate}
            onChange={_docCollectDateHandler}
            className="form"
            type="date"
            placeholder="데이터를 수집한 날짜를 입력하세요"
          />
        </CustomFormItem>
        <CustomFormItem>
          <p className="title">서비스 등록일</p>
          <input
            value={docRegisterDate}
            onChange={_docRegisterDateHandler}
            className="form"
            type="date"
            placeholder="서비스에 문서를 등록한 날짜를 입력하세요"
          />
        </CustomFormItem>
      </CustomFormRow>
      <CustomFormRow>
        <CustomFormItem>
          <p className="title">조사과제명</p>
          <input
            value={docProject}
            onChange={_docProjectHandler}
            className="form"
            type="text"
            placeholder="조사과제명을 입력하세요"
          />
        </CustomFormItem>
        <CustomFormItem>
          <p className="title">주문형 조사과제명의 세부과업명 </p>
          <input
            value={docPublishing}
            onChange={_docPublishingHandler}
            className="form"
            type="text"
            placeholder="주문형 조사과제명의 세부과업명을 입력하세요"
          />
        </CustomFormItem>
      </CustomFormRow>
      <CustomFormRow>
        <CustomFormItem>
          <p className="title">연관문서 제목</p>
          <input
            value={docRelateTitle}
            onChange={_docRelateTitleHandler}
            className="form"
            type="text"
            placeholder="해당 문서와 연관된 문서의 제목을 입력하세요"
          />
        </CustomFormItem>
        <CustomFormItem>
          <p className="title">연관문서 URL </p>
          <input
            value={docRelateUrl}
            onChange={_docRelateUrlHandler}
            className="form"
            type="text"
            placeholder="해당 문서와 연관된 문서가 위치한 URL을 입력하세요"
          />
        </CustomFormItem>
      </CustomFormRow>
      <CustomFormRow>
        <CustomFormItem>
          <p className="title">묶음문서 제목</p>
          <input
            value={docBundleTitle}
            onChange={_docBundleTitleHandler}
            className="form"
            type="text"
            placeholder="묶음 문서의 제목을 입력하세요"
          />
        </CustomFormItem>
        <CustomFormItem>
          <p className="title">묶음문서 URL </p>
          <input
            value={docBundleUrl}
            onChange={_docBundleUrlHandler}
            className="form"
            type="text"
            placeholder="묶음 문서가 위치한 URL을 입력하세요"
          />
        </CustomFormItem>
      </CustomFormRow>
      <CustomFormRow>
        <CustomFormItem>
          <p className="title">큐레이션 추천문서</p>
          <input
            className="form"
            type="text"
            value={docRecomment}
            onChange={_docRecommentHandler}
            maxLength="1"
            placeholder="큐레이션 추천 등급을 입력하세요. (알파벳 하나만 입력가능)"
          />
        </CustomFormItem>
        <CustomFormItem>
          <p className="title">서지사항 </p>
          <input
            value={docBiblio}
            onChange={_docBiblioHandler}
            className="form"
            type="text"
            placeholder="문서의 서지사항을 입력하세요"
          />
        </CustomFormItem>
      </CustomFormRow>
      <CustomFormRow>
        <CustomFormItem>
          <p className="title">키워드</p>
          <input
            className="form"
            type="text"
            placeholder="문서의 키워드를 입력하세요"
            value={docKeywordString}
            onChange={_docKeywordStringHandler}
          />
        </CustomFormItem>
      </CustomFormRow>
      <CustomFormRow>
        <CustomFormItem>
          <p className="title">관리자 메모</p>
          <input
            className="form"
            type="text"
            value={docMemo}
            onChange={_docMemoHandler}
            placeholder="관리자 전용 메모를 입력하세요"
          />
        </CustomFormItem>
      </CustomFormRow>
      {(type === "curation" || type === "archive") && (
        <>
          <CustomFormRow>
            <CustomFormItem>
              <p className="title">내용</p>
              <div className="content-box">
                <Editor
                  data={docContent}
                  _docContentHandler={_docContentHandler}
                  _id={_id}
                />
              </div>
            </CustomFormItem>
          </CustomFormRow>
          <CustomFormRow>
            <CustomFormItem>
              <p className="title">표지 파일</p>
              <ImageContainer>
                {type === "curation" ? (
                  <label>
                    <img
                      className="curation-thumbnail"
                      src={`http://${docThumbnail}`}
                      alt="썸네일"
                    />
                  </label>
                ) : (
                  docThumbnail.map((item, index) => {
                    return (
                      <ThumbnailWrap
                        selected={docThumbnailSelect === item}
                        key={index}
                      >
                        <input
                          type="radio"
                          id={index}
                          value={item}
                          name="cover"
                          //TODO: 백엔드 코드따라서 핸들러 변경 필요
                          onChange={_docThumbnailSelectHandler}
                          checked={docThumbnailSelect === item}
                        />
                        <label htmlFor={index}>
                          <img
                            className="cover"
                            src={`http://${item}`}
                            alt="썸네일"
                          />
                        </label>
                      </ThumbnailWrap>
                    );
                  })
                )}
                {uploadThumbnailSrcList.map((src, index) => (
                  <ThumbnailWrap>
                    <img className="cover" src={src} alt="썸네일" />
                    <div onClick={() => deleteUploadThumbnail(index)}>
                      <BsXCircle size={32} />
                    </div>
                  </ThumbnailWrap>
                ))}
                <label>
                  <ThumbnailAddInput
                    type="file"
                    accept=".jpeg, .jpg, .png, .gif"
                    onChange={(e) => onChangeThumbnailAddInput(e)}
                    multiple
                  />
                  <ThumbnailAddButton>
                    <BsPlusCircle size={50} />
                  </ThumbnailAddButton>
                </label>
              </ImageContainer>
            </CustomFormItem>
          </CustomFormRow>
        </>
      )}
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid ${tailwindColors["grey-400"]};
`;
const CustomFormItem = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  min-height: 3rem;
  overflow: hidden;
  font-size: 14px;
  border-bottom: dotted 1px ${tailwindColors["grey-300"]};

  .title {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 10rem;
    height: 100%;
    padding: 0.5rem 1rem;
    font-weight: bold;
    background-color: ${tailwindColors["grey-300"]};
    text-align: center;

    button {
      display: inherit;
      align-items: center;
      height: 1.5rem;
      padding: 0.2rem 0.5rem;
      border-radius: 7.5rem;
      background-color: ${tailwindColors["grey-400"]};
    }
  }

  & .content-box {
    flex: 1;
  }

  .form {
    flex: 1;
    background-color: ${tailwindColors.white};
    padding: 0.5rem 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    height: 100%;
    text-overflow: ellipsis;
  }
  .textarea {
    padding-top: 2rem;
  }
  .notInput {
    width: 100%;
    flex-wrap: wrap;
    justify-content: left;
    column-gap: 0.5rem;
    row-gap: 0.2rem;
    text-overflow: ellipsis;
    white-space: nowrap;
    background-color: ${tailwindColors.white};
  }
  .host {
    flex: 1;
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 0.5rem 1rem;
    background-color: ${tailwindColors.white};
    overflow: hidden;
    white-space: nowrap;

    span {
      width: calc(100% - 72px);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    button {
      width: 72px;
      padding: 0.2rem 0.5rem;
      margin-left: auto;
      border-radius: 7.5rem;
      background-color: ${tailwindColors["red-300"]};
      color: ${tailwindColors["red-300-contrast"]};
      font-weight: bold;
    }
  }
`;

const CustomFormRow = styled.div`
  display: flex;
  width: 100%;
`;

const CustomList = styled.div`
  padding: 0.5rem 1rem;
  background-color: ${tailwindColors["grey-300"]};
  min-width: 4rem;
  text-align: center;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ImageContainer = styled.div`
  gap: 0.5rem;
  flex: 1;
  display: flex;
  padding: 2rem;
  background-color: ${tailwindColors.white};
  overflow-x: auto;

  input[type="radio"] {
    margin: 10px;
    display: none;
  }

  label {
    img {
      cursor: pointer;
      object-fit: contain;
    }
  }
  .curation-thumbnail {
    height: 20rem;
  }
`;

const ThumbnailWrap = styled.div`
  position: relative;
  height: 20rem;
  transition: transform 0.2s;
  cursor: pointer;
  overflow: hidden;

  &:hover {
    > img {
      transform: scale(1.1);
    }
  }

  & img {
    border: ${(props) => props.selected && `0.3rem solid ${myColors.red}`};
    height: 100%;
    transition: transform 0.2s;
  }

  & > div {
    position: absolute;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    width: 100%;
    background-color: ${myColors.red};
    backdrop-filter: blur(3px);
    color: ${tailwindColors.white};
    :hover {
      filter: brightness(0.9);
    }
  }
`;

const ThumbnailAddInput = styled.input`
  display: none;
`;

const ThumbnailAddButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20rem;
  width: 14rem;
  background-color: ${tailwindColors["grey-200"]};
  color: ${tailwindColors["grey-700"]};
  cursor: pointer;
  transition: background-color 0.2s;
  :hover {
    background-color: ${tailwindColors["grey-300"]};
  }
`;

/* forwardRef를 사용하여 부모가 자식 컴포넌트 함수를 호출할 수 있도록 함*/
export default forwardRef(CrawlDataForm);
