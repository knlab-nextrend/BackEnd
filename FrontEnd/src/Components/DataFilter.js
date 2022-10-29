import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaFilter } from "react-icons/fa";
import { MdSettings } from "react-icons/md";
import { AiOutlinePlus, AiOutlineMinus, AiOutlineSearch } from "react-icons/ai";
import { CategoryOptionFetchApi } from "../Utils/api";
import { useDispatch, useSelector } from "react-redux";
import { setModal, setModalData, setCategoryModalType } from "../Modules/modal";

function DataFilter({ dataFilterFetch = null, type }) {
  const dispatch = useDispatch();
  const [optionIsOpen, setOptionIsOpen] = useState(false);

  const [keyword, setKeyword] = useState(""); // keyword
  const [isCrawled, setIsCrawled] = useState(true); // is_crawled 여부

  // 스크리닝 부터 사용되는 필터들
  const [sort, setSort] = useState("");
  const [dateRange, setDateRange] = useState("all"); // 날짜 범위를 지정할 수 있도록 함. 기본 값은 전체
  /* 
    all : 전체 범위
    past_week : 최근 1주
    past_month : 최근 1달
    past_3_month : 최근 3달
    past_6_month : 최근 6달
    past_year : 최근 1년
    past_3_year : 최근 3년
    custom_range : 직접 설정
  */
  const [isDateRange, setIsDateRange] = useState(false); // 날짜 범위를 직접 설정할 것인지 아닌지 ...
  const [sortType, setSortType] = useState("doc_collect_date");
  const [dateGte, setDateGte] = useState("2019-01-01"); // 임시 값. 현재 시각 기준 3년 전으로 설정 할 예정...
  const [dateLte, setDateLte] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [pageGte, setPageGte] = useState(0);
  const [pageLte, setPageLte] = useState(0);

  const [screeningHost, setScreeningHost] = useState(""); // 스크리닝 호스트 검색용
  const [screeningLanguage, setScreeningLanguage] = useState(""); // 스크리닝 언어 검색용

  const docLanguage = useSelector(
    (state) => state.modal.modalData.doc_language
  );
  const docCountry = useSelector((state) => state.modal.modalData.doc_country); // doc_country HOST 국가
  const docPublishCountry = useSelector(
    (state) => state.modal.modalData.doc_publish_country
  );
  const docCategory = useSelector(
    (state) => state.modal.modalData.doc_category
  );
  const docContentType = useSelector(
    (state) => state.modal.modalData.doc_content_type
  );
  const docHost = useSelector((state) => state.modal.modalData.doc_host); // doc_host, doc_publisher host 및 발급기관명 관리

  const _openCategoryModal = (categoryModalType) => {
    dispatch(setModal("CategoryModal")); //초기화
    dispatch(setModalData([], categoryModalType));
    dispatch(setCategoryModalType(categoryModalType));
  };

  const _openHostSelectModal = () => {
    dispatch(setModalData(null, "doc_host")); // 초기화
    dispatch(setModal("HostSelectModal"));
  };

  const _screeningHostHandler = (e) => {
    setScreeningHost(e.target.value);
  };
  const _screeningLanguageHandler = (e) => {
    setScreeningLanguage(e.target.value);
  };
  const _isCrawledHandler = (e) => {
    setIsCrawled(e.target.value);
  };
  const _optionIsOpenHandler = () => {
    setOptionIsOpen(!optionIsOpen);
  };

  const _sortTypeHandler = (e) => {
    setSortType(e.target.value);
  };
  const _sortHandler = (e) => {
    setSort(e.target.value);
  };
  const _dateGteHandler = (e) => {
    setDateGte(e.target.value);
  };
  const _dateLteHandler = (e) => {
    if (_calcDateDifference(dateLte, e.target.value)) {
      setDateLte(e.target.value);
    } else {
      alert("시간 선택이 잘못되었습니다.");
      setDateLte(new Date().toISOString().substring(0, 10));
    }
  };
  const _pageGteHandler = (e) => {
    setPageGte(e.target.value);
  };
  const _pageLteHandler = (e) => {
    setPageLte(e.target.value);
  };

  const _dateRangeHandler = (e) => {
    setDateRange(e.target.value);
    setIsDateRange(e.target.value === "custom_range" ? true : false); // 직접 설정일 경우 ..
  };

  const _calcDateDifference = (start, end) => {
    if (Date.parse(new Date()) - Date.parse(end) < 0) {
      // 현재 시점에서 미래의 날짜는 선택할 수 없음
      return false;
    }
    return Date.parse(end) - Date.parse(start) >= 0 || false; // endDate가 startDate보다 과거라면 해당 날짜는 선택할 수 없음.
  };

  const searchFilter = () => {
    const searchObj = {};
    if (
      docLanguage.length > 1 ||
      docCountry.length > 1 ||
      docCategory.length > 1 ||
      docContentType.length > 1 ||
      docPublishCountry.length > 1
    ) {
      alert("검색 필드 하나에 하나의 필터 값만 설정 가능 합니다.");
      return;
    }

    if (docCountry.length !== 0) {
      searchObj["doc_country"] = docCountry.map((item) => item.CODE);
    }
    if (docCategory.length !== 0) {
      searchObj["doc_category"] = docCategory.map((item) => item.CODE);
    }
    if (docContentType.length !== 0) {
      searchObj["doc_content_type"] = docContentType.map((item) => item.CODE);
    }
    if (docPublishCountry.length !== 0) {
      searchObj["doc_publish_country"] = docPublishCountry.map(
        (item) => item.CODE
      );
    }
    if (type === "screening") {
      if (screeningHost !== "") {
        searchObj["host"] = screeningHost;
      }
      if (screeningLanguage !== "") {
        searchObj["lang"] = screeningLanguage;
      }
    } else {
      if (docHost !== null) {
        searchObj["doc_host"] = docHost.IDX;
      }
      if (docLanguage.length !== 0) {
        searchObj["doc_language"] = docLanguage.map((item) => item.CODE);
      }
    }

    if (type === "archive") {
      searchObj["is_crawled"] = isCrawled;
    }
    if (sort !== "") {
      searchObj["sort"] = sort;
    }
    searchObj["sortType"] = sortType;
    if (dateRange !== "all") {
      searchObj["dateGte"] = dateGte;
      searchObj["dateLte"] = dateLte;
    }
    if (keyword !== "") {
      searchObj["keyword"] = keyword;
    }
    if (pageGte !== 0 || pageLte !== 0) {
      searchObj["pageLte"] = pageLte;
      searchObj["pageGte"] = pageGte;
    }
    dataFilterFetch(searchObj);
  };

  // 설정 완료 해야함
  const searchReset = () => {
    setScreeningHost("");
    setScreeningLanguage("");
    setKeyword("");
    setIsCrawled(true);
    dispatch(setModalData([], "doc_country"));
    dispatch(setModalData([], "doc_publish_country"));
    dispatch(setModalData([], "doc_host"));
    dispatch(setModalData([], "doc_language"));
    dispatch(setModalData([], "doc_content_type"));
    dispatch(setModalData([], "doc_category"));
    dispatch(setModalData(null, "doc_host"));
    setDateRange("all");
    setSortType("doc_collect_date");
    setDateGte("2019-01-01");
    setDateLte(new Date().toISOString().substring(0, 10));
    setPageGte(0);
    setPageLte(0);
  };

  useEffect(() => {
    const _dateGte = new Date(); // 오늘 날짜
    if (dateRange === "past_week") {
      _dateGte.setDate(_dateGte.getDate() - 7); // 7일. 1주일 전
    } else if (dateRange === "past_month") {
      _dateGte.setMonth(_dateGte.getMonth() - 1); // 1달 전
    } else if (dateRange === "past_3_month") {
      _dateGte.setMonth(_dateGte.getMonth() - 3); // 3달 전
    } else if (dateRange === "past_6_month") {
      _dateGte.setMonth(_dateGte.getMonth() - 6); // 6달 전
    } else if (dateRange === "past_year") {
      _dateGte.setFullYear(_dateGte.getFullYear() - 1); // 1년 전
    } else if (dateRange === "past_3_year") {
      _dateGte.setFullYear(_dateGte.getFullYear() - 3); // 3년 전
    }
    setDateGte(_dateGte.toISOString().substring(0, 10));
  }, [dateRange]);

  useEffect(() => {
    if (optionIsOpen) {
      searchReset();
    }
  }, [optionIsOpen]);
  return (
    <>
      <Wrapper>
        <FilterHeader>
          <Title>
            <FaFilter color="#435269" />
            <p>상세 검색</p>
          </Title>
          <CustomButton onClick={_optionIsOpenHandler}>
            {optionIsOpen ? (
              <>
                <AiOutlineMinus />
                검색 필터 접기
              </>
            ) : (
              <>
                <AiOutlinePlus />
                검색 필터 펼치기
              </>
            )}
          </CustomButton>
        </FilterHeader>
        {optionIsOpen && (
          <>
            <FilterBody>
              <FilterBodyWrapper>
                <OptionContainer>
                  <OptionRow>
                    <OptionCol>
                      <OptionTitle>기간</OptionTitle>
                      <OptionSelect
                        value={sortType}
                        onChange={_sortTypeHandler}
                      >
                        <option value="doc_collect_date">
                          원문 수집일 기준
                        </option>
                        {type !== "screening" && (
                          <>
                            <option value="doc_write_date">
                              원문 작성일 기준
                            </option>
                            <option value="doc_publish_date">
                              원문 발행일 기준
                            </option>
                            <option value="doc_register_date">
                              서비스 등록일 기준
                            </option>
                          </>
                        )}
                      </OptionSelect>

                      <OptionSelect
                        value={dateRange}
                        onChange={_dateRangeHandler}
                      >
                        <option disabled default>
                          기간 설정
                        </option>
                        <option value="all">전체</option>
                        <option value="past_week">최근 1주</option>
                        <option value="past_month">최근 1개월</option>
                        <option value="past_3_month">최근 3개월</option>
                        <option value="past_6_month">최근 6개월</option>
                        <option value="past_year">최근 1년</option>
                        <option value="past_3_year">최근 3년</option>
                        <option value="custom_range">직접 설정</option>
                      </OptionSelect>
                      {isDateRange && (
                        <>
                          <OptionInput
                            onChange={_dateGteHandler}
                            value={dateGte}
                            type="date"
                          ></OptionInput>
                          <OptionInput
                            onChange={_dateLteHandler}
                            value={dateLte}
                            last
                            type="date"
                          ></OptionInput>
                        </>
                      )}

                      <OptionSelect value={sort} onChange={_sortHandler}>
                        <option value="default">기본</option>
                        <option value="desc">최신순</option>
                        <option value="asc">오래된 순</option>
                      </OptionSelect>
                    </OptionCol>
                  </OptionRow>
                  <OptionRow>
                    <OptionCol>
                      <OptionTitle>페이지 수</OptionTitle>
                      <OptionInput
                        onChange={_pageGteHandler}
                        value={pageGte}
                        type="number"
                        placeholder="페이지 수 범위 시작 (ex. 10 )"
                        min="0"
                      ></OptionInput>
                      <OptionInput
                        onChange={_pageLteHandler}
                        value={pageLte}
                        last
                        type="number"
                        placeholder="페이지 수 범위 끝 (ex. 50 )"
                        min="0"
                      ></OptionInput>
                    </OptionCol>
                    {type === "archive" && (
                      <OptionCol>
                        <OptionTitle>데이터 유형</OptionTitle>
                        <OptionSelect
                          value={isCrawled}
                          onChange={_isCrawledHandler}
                        >
                          <option value={null}>전체</option>
                          <option value={true}>크롤데이터</option>
                          <option value={false}>수기데이터</option>
                        </OptionSelect>
                      </OptionCol>
                    )}
                  </OptionRow>
                  <OptionRow>
                    <OptionCol>
                      {type === "screening" ? (
                        <>
                          <OptionTitle>언어코드 검색</OptionTitle>
                          <OptionInput
                            onChange={_screeningLanguageHandler}
                            value={screeningLanguage}
                            type="text"
                            placeholder="언어 코드 검색 (ex. ko, ja, en ... )"
                          ></OptionInput>
                        </>
                      ) : (
                        <>
                          <OptionTitle>언어</OptionTitle>
                          <ActionButton
                            onClick={() => {
                              _openCategoryModal("doc_language");
                            }}
                          >
                            <MdSettings /> 선택
                          </ActionButton>
                          <CustomList>
                            {docLanguage.map((item, index) => {
                              return <Chip key={index}>{item.CT_NM}</Chip>;
                            })}
                          </CustomList>
                        </>
                      )}
                    </OptionCol>
                    <OptionCol>
                      {type === "screening" ? (
                        <>
                          <OptionTitle>HOST명 검색</OptionTitle>
                          <OptionInput
                            onChange={_screeningHostHandler}
                            value={screeningHost}
                            type="text"
                            placeholder="HOST명 검색"
                          ></OptionInput>
                        </>
                      ) : (
                        <>
                          <OptionTitle>HOST 선택</OptionTitle>
                          <ActionButton
                            onClick={() => {
                              _openHostSelectModal();
                            }}
                          >
                            <MdSettings /> 선택
                          </ActionButton>
                          <CustomList>
                            {docHost && <Chip>{docHost.HOST}</Chip>}
                          </CustomList>
                        </>
                      )}
                    </OptionCol>
                  </OptionRow>

                  {(type === "archive" || type === "curation") && (
                    <>
                      <OptionRow>
                        <OptionCol>
                          <OptionTitle>유형 분류</OptionTitle>
                          <ActionButton
                            onClick={() => {
                              _openCategoryModal("doc_content_category");
                            }}
                          >
                            <MdSettings /> 선택
                          </ActionButton>
                          <CustomList>
                            {docContentType.map((item, index) => {
                              return <Chip key={index}>{item.CT_NM}</Chip>;
                            })}
                          </CustomList>
                        </OptionCol>
                        <OptionCol>
                          <OptionTitle>정책 분류</OptionTitle>
                          <ActionButton
                            onClick={() => {
                              _openCategoryModal("doc_category");
                            }}
                          >
                            <MdSettings /> 선택
                          </ActionButton>
                          <CustomList>
                            {docCategory.map((item, index) => {
                              return <Chip key={index}>{item.CT_NM}</Chip>;
                            })}
                          </CustomList>
                        </OptionCol>
                      </OptionRow>
                      <OptionRow>
                        <OptionCol>
                          <OptionTitle>대상 국가</OptionTitle>
                          <ActionButton
                            onClick={() => {
                              _openCategoryModal("doc_country");
                            }}
                          >
                            <MdSettings /> 선택
                          </ActionButton>
                          <CustomList>
                            {docCountry.map((item, index) => {
                              return <Chip key={index}>{item.CT_NM}</Chip>;
                            })}
                          </CustomList>
                        </OptionCol>
                        <OptionCol>
                          <OptionTitle>발행 국가</OptionTitle>
                          <ActionButton
                            onClick={() => {
                              _openCategoryModal("doc_publish_country");
                            }}
                          >
                            <MdSettings /> 선택
                          </ActionButton>
                          <CustomList>
                            {docPublishCountry.map((item, index) => {
                              return <Chip key={index}>{item.CT_NM}</Chip>;
                            })}
                          </CustomList>
                        </OptionCol>
                      </OptionRow>
                    </>
                  )}
                </OptionContainer>
                <FilterActions>
                  <CustomButton onClick={searchReset}>초기화</CustomButton>
                  <CustomButton onClick={searchFilter}>
                    <AiOutlineSearch />
                    검색
                  </CustomButton>
                </FilterActions>
              </FilterBodyWrapper>
            </FilterBody>
          </>
        )}
      </Wrapper>
    </>
  );
}

// function Cascader({ options, selectedCountry, selectedCategory }) {
//   const [optionIsOpen, setOptionIsOpen] = useState(false);
//   const _optionIsOpenHandler = () => {
//     setOptionIsOpen(!optionIsOpen);
//   };
//   const PrintValue = (e) => {
//     if (selectedCategory) {
//       selectedCategory(e.target.value);
//     }
//     if (selectedCountry) {
//       selectedCountry(e.target.value);
//     }
//   };
//   return (
//     <CascaderWrapper>
//       <CascaderOpenHandler onClick={_optionIsOpenHandler}>
//         분류 선택
//       </CascaderOpenHandler>
//       {optionIsOpen && (
//         <CascaderOptions onClick={PrintValue}>
//           <ul className="depth1">
//             {options.map((item, index) => {
//               return (
//                 <>
//                   <li key={index} value={item.value}>
//                     {item.label}
//                     {item.children.length !== 0 && (
//                       <>
//                         <ul className="depth2">
//                           {item.children.map((item2, index2) => {
//                             return (
//                               <>
//                                 <li key={index2} value={item2.value}>
//                                   {item2.label}
//                                   {item2.children.length !== 0 && (
//                                     <>
//                                       <ul className="depth3">
//                                         {item2.children.map((item3, index3) => {
//                                           return (
//                                             <>
//                                               <li
//                                                 key={index3}
//                                                 value={item3.value}
//                                               >
//                                                 {item3.label}
//                                               </li>
//                                             </>
//                                           );
//                                         })}
//                                       </ul>
//                                     </>
//                                   )}
//                                 </li>
//                               </>
//                             );
//                           })}
//                         </ul>
//                       </>
//                     )}
//                   </li>
//                 </>
//               );
//             })}
//           </ul>
//         </CascaderOptions>
//       )}
//     </CascaderWrapper>
//   );
// }

const CascaderOpenHandler = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 30rem;
  cursor: pointer;
  background-color: white;
  border: solid 1px #d6d6d6;
  padding: 0 1rem 0 1rem;
  margin: 0;
`;
const CascaderWrapper = styled.div`
  font-size: 12px;
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  margin: 0 0.5rem 0 0.5rem;
  padding-left: 0.5rem;
`;

const CascaderOptions = styled.div`
  z-index: 8;
  position: relative;
  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
  li {
    background-color: white;
    width: 8rem;
    height: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border: solid 1px #d6d6d6;
    word-break: keep-all;
    text-align: center;
  }
  .depth1 ul {
    display: none;
  }
  .depth1 li:hover {
    cursor: pointer;
    & > ul {
      display: block;
    }
  }
  .depth2,
  .depth3 {
    position: absolute;
    left: 8rem;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  flex-direction: column;
  font-size: 14px;
`;

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Title = styled.div`
  display: flex;
  align-items: center;

  p {
    margin: 0 0 0 0.5rem;
    font-size: 16px;
    font-weight: bold;
    color: #435269;
  }
`;
const CustomButton = styled.button`
  border: none;
  cursor: pointer;
  padding: 0.5rem 1rem 0.5rem 1rem;
  color: white;
  background-color: #435269;
  font-weight: bold;
  font-size: 14px;
  border-radius: 4px;
`;
const FilterBody = styled.div`
  padding: 1rem 0 1rem 0;
`;
const FilterActions = styled.div`
  padding: 0.5rem 0 0.5rem 0;
  border-top: solid 1px #d6d6d6;
  display: flex;
  justify-content: right;
  button {
    margin: 0.5rem;
  }
`;

const FilterBodyWrapper = styled.div`
  width: 100%;
  margin: 0 auto;
`;

const ActionButton = styled.button`
  margin: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: solid 1px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  cursor: pointer;
  .delete {
    background-color: #b80000;
    color: white;
  }
`;
const OptionContainer = styled.div``;

const OptionRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 30px;
  margin: 1rem;
`;

const OptionCol = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin: 0 0.5rem 0 0.5rem;
`;

const OptionTitle = styled.div`
  min-width: 140px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  background-color: #d6d6d6;
  font-size: 12px;
  margin-right: 0.5rem;
  padding-left: 5px;
  padding-right: 5px;
  text-align: center;
  word-wrap: break-word;
`;

const OptionInput = styled.input`
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  border: solid 1px #d6d6d6;
  margin: 0 0.5rem 0 0.5rem;
  padding-left: 0.5rem;
`;

const OptionSelect = styled.select`
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  border: solid 1px #d6d6d6;
  margin: 0 0.5rem 0 0.5rem;
  padding-left: 0.5rem;
`;

/* antd 와 비슷한 cascader 제작을 위한 inner component*/

const CustomList = styled.div`
  display: flex;
`;
const Chip = styled.div`
  font-size: 12px;
  padding: 0.25rem 0.5rem;
  margin: 0.25rem;
  background-color: #eee;
  min-width: 2rem;
  text-align: center;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default DataFilter;
