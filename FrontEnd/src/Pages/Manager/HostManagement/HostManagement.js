import React from "react";
import FormHeader from "../../../Components/FormHeader";
import SearchBar from "../../../Components/SearchBar";
import { FaFilter } from "react-icons/fa";
import styled from "styled-components";
import {
  MdUpload,
  MdDownload,
  MdOutlineModeEditOutline,
  MdOutlineDeleteOutline,
  MdOutlineCheck,
  MdClose,
  MdSettings,
  MdOutlineSearch,
  MdSync,
} from "react-icons/md";
function HostManagement({
  currentHostList,
  filterOpen,
  _filterOpenHandler,
  _filterInputsHandler,
  _registerHostOpenHandler,
  filterSearch,
  excelDownload,
  excelUpload,
  selectedHost,
  _openCategoryModal,
  docCategory,
  docLanguage,
  docCountry,
  hostRegisterUpload,
  _hostPublisherHandler,
  _hostWorkCycleHandler,
  hostWorkCycle,
  hostPublisher,
  nextrendSync,
  hostTestList,
}) {
  return (
    <>
      <FormHeader type={"view"} title={"HOST 목록 관리"} />
      <Wrapper>
        <ContentContainer>
          <div className="content-title">
            <div className="main-title">크롤링 HOST 테스트 등록 / 결과</div>
            <div className="sub-title">
              엑셀로 HOST 데이터를 업로드하여 크롤링 가능 여부를 테스트 합니다.
              테스트 목록에 HOST가 등록되어 있을때는 데이터 추가 등록이 불가능
              합니다. 테스트가 완료되면 완료 결과에 따라 HOST를 선택하여 실제로
              작동할 HOST를 선택하여 등록할 수 있습니다.
            </div>
          </div>
          <div className="content-body">
            <DictionaryFunctionWrapper>
              <DictionaryFunctionBtnWrapper>
                <input
                  id="excel-upload"
                  type="file"
                  accept=".xlsx"
                  onChange={excelUpload}
                />
                <label htmlFor="excel-upload">
                  <MdUpload size="20" />
                  테스트 HOST 목록 엑셀 업로드
                </label>
              </DictionaryFunctionBtnWrapper>
            </DictionaryFunctionWrapper>
            <DictonaryDataTable>
              <colgroup>
                <col width="25%" />
                <col width="10%" />
                <col width="10%" />
                <col width="8%" />
                <col width="4%" />
                <col width="4%" />
                <col width="4%" />
                <col width="4%" />
                <col width="4%" />
                <col width="4%" />
                <col width="4%" />
                <col width="5%" />
                <col width="5%" />
              </colgroup>
              <thead>
                <tr>
                  <th rowSpan={2}>HOST 도메인</th>
                  <th colSpan={3}>시간</th>
                  <th colSpan={7}>결과</th>
                  <th rowSpan={2}>등록</th>
                  <th rowSpan={2}>삭제</th>
                </tr>
                <tr>
                  <th>작업 시작 시간</th>
                  <th>작업 종료 시간</th>
                  <th>러닝 타임</th>
                  <th>URL</th>
                  <th>HTML</th>
                  <th>PDF</th>
                  <th>WORD</th>
                  <th>EXCEL</th>
                  <th>PPT</th>
                  <th>ETC</th>
                </tr>
              </thead>
              <tbody>
                {hostTestList.map((host, index) => {
                  return (
                    <>
                      <tr key={index}>
                        <td>{host.host}</td>
                        <td>{host.start_time}</td>
                        <td>{host.end_time}</td>
                        <td>{host.running_time}</td>
                        {host.test_end ? (
                          <>
                            <td>{host.url}</td>
                            <td>{host.html}</td>
                            <td>{host.pdf}</td>
                            <td>{host.word}</td>
                            <td>{host.excel}</td>
                            <td>{host.ppt}</td>
                            <td>{host.etc}</td>
                          </>
                        ) : (
                          <td colSpan={7} className="crawl-test">
                            크롤링 테스트 중입니다
                          </td>
                        )}
                        {host.is_registered ? (
                          <td className="registered">기등록됨</td>
                        ) : (
                          <td>
                            <ActionButton
                              onClick={() => {
                                _registerHostOpenHandler(host);
                              }}
                            >
                              등록
                            </ActionButton>
                          </td>
                        )}
                        <td>
                          <ActionButton>버리기</ActionButton>
                        </td>
                      </tr>
                      {selectedHost && selectedHost.idx === host.idx && (
                        <tr>
                          <td colSpan={12}>
                            <div>
                              아래의 값을 모두 채워 등록해주세요. 언어, 국가,
                              정책분류는 각 1개씩만 설정가능 합니다.
                            </div>
                            <HostRegisterContainer>
                              <div className="input-wrapper">
                                <div className="input-title">HOST 도메인</div>
                                <div>{host.host}</div>
                              </div>
                              <div className="input-wrapper">
                                <div className="input-title">발급기관명</div>
                                <input
                                  type="text"
                                  onChange={_hostPublisherHandler}
                                />
                              </div>
                              <div className="input-wrapper">
                                <div className="input-title">
                                  HOST 해당 언어
                                </div>
                                <ActionButton
                                  onClick={() => {
                                    _openCategoryModal("doc_language");
                                  }}
                                >
                                  <MdSettings />
                                  선택
                                </ActionButton>
                                <CustomList>
                                  {docLanguage.map((item, index) => {
                                    return (
                                      <Chip key={index}>{item.CT_NM}</Chip>
                                    );
                                  })}
                                </CustomList>
                              </div>
                              <div className="input-wrapper">
                                <div className="input-title">
                                  HOST 해당 국가
                                </div>
                                <ActionButton
                                  onClick={() => {
                                    _openCategoryModal("doc_country");
                                  }}
                                >
                                  <MdSettings />
                                  선택
                                </ActionButton>
                                <CustomList>
                                  {docCountry.map((item, index) => {
                                    return (
                                      <Chip key={index}>{item.CT_NM}</Chip>
                                    );
                                  })}
                                </CustomList>
                              </div>
                              <div className="input-wrapper">
                                <div className="input-title">
                                  HOST 정책 분류
                                </div>
                                <ActionButton
                                  onClick={() => {
                                    _openCategoryModal("doc_category");
                                  }}
                                >
                                  <MdSettings />
                                  선택
                                </ActionButton>
                                <CustomList>
                                  {docCategory.map((item, index) => {
                                    return (
                                      <Chip key={index}>{item.CT_NM}</Chip>
                                    );
                                  })}
                                </CustomList>
                              </div>
                              <div className="input-wrapper">
                                <div className="input-title">
                                  크롤러 수집주기 (day)
                                </div>
                                <input
                                  type="number"
                                  min="0"
                                  onChange={_hostWorkCycleHandler}
                                />
                              </div>
                              <ActionButton onClick={hostRegisterUpload}>
                                등록
                              </ActionButton>
                            </HostRegisterContainer>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </DictonaryDataTable>
          </div>
        </ContentContainer>
        <ContentContainer>
          <div className="content-title">
            <div className="main-title">현재 작동중인 크롤링 HOST 목록</div>
            <div className="sub-title">
              엑셀로 데이터를 업로드하고 관리할 수 있습니다. 업로드한 데이터는
              기존의 데이터를 덮어씌웁니다.
            </div>
          </div>
          <div className="content-body">
            <DictionaryFunctionWrapper>
              <DictionaryFunctionBtnWrapper>
                <button onClick={_filterOpenHandler}>
                  <MdOutlineSearch size="20" />
                  조건 검색 여닫기
                </button>
                <button onClick={nextrendSync}>
                  <MdSync size="20" />
                  nextrend 서비스와 크롤러 동기화
                </button>
              </DictionaryFunctionBtnWrapper>

            </DictionaryFunctionWrapper>
            {filterOpen && (
              <FilterWrapper>
                <div className="filter-title">
                  <FaFilter />
                  <div>검색 필터 설정</div>
                </div>
                <div className="filter-body">
                  <div className="filter-item">
                    <div>HOST 도메인</div>
                    <input
                      placeholder="입력값을 포함하여 검색됩니다."
                      name="host"
                      onChange={_filterInputsHandler}
                      type="text"
                    />
                  </div>
                  <div className="filter-item">
                    <div>HOST 언어</div>
                    <input
                      placeholder="언어명 입력"
                      name="lang"
                      onChange={_filterInputsHandler}
                      type="text"
                    />
                  </div>
                  <div className="filter-item">
                    <div>HOST 해당 국가</div>
                    <input
                      placeholder="국가명 입력"
                      name="country"
                      onChange={_filterInputsHandler}
                      type="text"
                    />
                  </div>
                  <div className="filter-item">
                    <div>발급 기관 명</div>
                    <input
                      placeholder="입력값을 포함하여 검색됩니다"
                      name="name"
                      onChange={_filterInputsHandler}
                      type="text"
                    />
                  </div>
                  <div className="filter-item">
                    <div>HOST 정책 분류</div>
                    <input
                      placeholder="분류명 입력"
                      name="category"
                      onChange={_filterInputsHandler}
                      type="text"
                    />
                  </div>
                  <div className="filter-item">
                    <div className="item-title">크롤링 수집주기</div>
                    <input
                      placeholder="숫자 입력"
                      name="workCycle"
                      onChange={_filterInputsHandler}
                    />
                  </div>
                </div>
                <div className="filter-action">
                  <button onClick={filterSearch}>검색</button>
                </div>
              </FilterWrapper>
            )}
            <DictonaryDataTable>
              <colgroup>
                <col width="30%" />
                <col width="15%" />
                <col width="15%" />
                <col width="10%" />
                <col width="10%" />
                <col width="10%" />
                <col width="10%" />
              </colgroup>
              <thead>
                <tr>
                  <th>HOST 도메인</th>
                  <th>HOST 해당 언어</th>
                  <th>HOST 해당 국가</th>
                  <th>발급 기관 명</th>
                  <th>HOST 정책 분류</th>
                  <th className="crawl-setting">크롤링 수집주기(일 단위)</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {currentHostList.map((host, index) => {
                  return (
                    <>
                      <tr>
                        <td>{host.host}</td>
                        <td>{host.lang.length!==0 && host.lang[0].CT_NM}</td>
                        <td>{host.country.length!==0 && host.country[0].CT_NM}</td>
                        <td>{host.name}</td>
                        <td>{host.category.length!==0 && host.category[0].CT_NM}</td>
                        <td>{host.workCycle}</td>
                        <td>
                          <ActionButton
                            onClick={() => {
                              _registerHostOpenHandler(host);
                            }}
                          >
                            <MdSettings/>관리
                          </ActionButton>
                        </td>
                      </tr>
                      {selectedHost && selectedHost.idx === host.idx && (
                        <tr>
                          <td colSpan={12}>
                            <div>
                              아래의 값을 모두 채워 등록해주세요. 언어, 국가,
                              정책분류는 각 1개씩만 설정가능 합니다.
                            </div>
                            <HostRegisterContainer>
                              <div className="input-wrapper">
                                <div className="input-title">HOST 도메인</div>
                                <div>{host.host}</div>
                              </div>
                              <div className="input-wrapper">
                                <div className="input-title">발급기관명</div>
                                <input
                                  type="text"
                                  value={hostPublisher}
                                  onChange={_hostPublisherHandler}
                                />
                              </div>
                              <div className="input-wrapper">
                                <div className="input-title">
                                  HOST 해당 언어
                                </div>
                                <ActionButton
                                  onClick={() => {
                                    _openCategoryModal("doc_language");
                                  }}
                                >
                                  <MdSettings />
                                  선택
                                </ActionButton>
                                <CustomList>
                                  {docLanguage.map((item, index) => {
                                    return (
                                      <Chip key={index}>{item.CT_NM}</Chip>
                                    );
                                  })}
                                </CustomList>
                              </div>
                              <div className="input-wrapper">
                                <div className="input-title">
                                  HOST 해당 국가
                                </div>
                                <ActionButton
                                  onClick={() => {
                                    _openCategoryModal("doc_country");
                                  }}
                                >
                                  <MdSettings />
                                  선택
                                </ActionButton>
                                <CustomList>
                                  {docCountry.map((item, index) => {
                                    return (
                                      <Chip key={index}>{item.CT_NM}</Chip>
                                    );
                                  })}
                                </CustomList>
                              </div>
                              <div className="input-wrapper">
                                <div className="input-title">
                                  HOST 정책 분류
                                </div>
                                <ActionButton
                                  onClick={() => {
                                    _openCategoryModal("doc_category");
                                  }}
                                >
                                  <MdSettings />
                                  선택
                                </ActionButton>
                                <CustomList>
                                  {docCategory.map((item, index) => {
                                    return (
                                      <Chip key={index}>{item.CT_NM}</Chip>
                                    );
                                  })}
                                </CustomList>
                              </div>
                              <div className="input-wrapper">
                                <div className="input-title">
                                  크롤러 수집주기 (day)
                                </div>
                                <input
                                  type="number"
                                  min="0"
                                  value={hostWorkCycle}
                                  onChange={_hostWorkCycleHandler}
                                />
                              </div>
                              <ActionButton onClick={hostRegisterUpload}>
                                등록
                              </ActionButton>
                            </HostRegisterContainer>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </DictonaryDataTable>
          </div>
        </ContentContainer>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  font-size: 14px;
  min-height: 1280px;
  background-color: #eee;
  color: rgb(59, 59, 59);
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const LineBox = styled.div`
  /* border: solid 1px #d6d6d6;
  border-radius: 4px; */
  background-color: white;
  margin: 1rem;
  border-radius: 4px;
  box-shadow: 0 0 0.875rem 0 rgba(33, 37, 41, 0.05);
`;

const ContentContainer = styled(LineBox)`
  .content-title {
    border-bottom: 1px solid #d6d6d6;
    padding: 1rem;
    .main-title {
      font-size: 16px;
      font-weight: bold;
    }
    .sub-title {
      font-size: 14px;
    }
  }
  .content-body {
    padding: 1rem;
  }
`;

const DictionaryFunctionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  min-height: 3rem;
`;
const DictionaryFunctionBtnWrapper = styled.div`
  display: flex;
  input[type="file"] {
    display: none;
  }
  button,
  label {
    cursor: pointer;
    margin: 0.5rem;
    font-size: 12px;
    display: flex;
    align-items: center;
    background-color: #435269;
    color: white;
    border: solid 1px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    padding: 0 0.5rem 0 0.5rem;
  }
`;
const DictonaryDataTable = styled.table`
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  text-align: left;
  margin-top: 1rem;
  margin-bottom: 1rem;
  thead {
    background-color: #d8dee6;
    color: #323d4d;
    border-bottom: 2px solid rgba(0, 0, 0, 0.1);
  }
  th,
  td {
    border-bottom: solid 1px #eee;
    padding: 10px;
    word-break: normal; word-wrap: break-word;
  }
  tbody {
    tr:nth-child(even) {
      background-color: #f4f5f8;
    }
  }
  input[type="text"] {
    width: 100%;
  }
  .crawl-setting {
    width: 10rem;
  }
  .crawl-test {
    color: #009999;
    font-weight: bold;
  }
  .registered {
    font-weight: bold;
    color: #b80000;
  }
  .actions {
    display: flex;
    align-items: center;
    justify-content: center;
    button {
      height: 2rem;
      width: 2rem;
      margin-left: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border: solid 1px rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      cursor: pointer;
    }
    .delete {
      background-color: #b80000;
      color: white;
    }
    .confirm {
      background-color: #435269;
      color: white;
    }
  }
  .setting {
    text-align: center;
  }
  input[type="text"] {
    &:focus {
      outline: none;
    }
  }
`;

const FilterWrapper = styled.div`
  border: solid 1px #d6d6d6;
  border-radius: 4px;
  padding: 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;

  .filter-title {
    color: #435269;
    font-weight: bold;
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
  }
  .filter-body {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }
  .filter-item {
    display: flex;
    align-items: center;
    padding: 0.5rem;
    height: 30px;
    div {
      min-width: 10rem;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      background-color: #d6d6d6;
      font-size: 12px;
      margin-right: 0.5rem;
      padding-left: 5px;
      padding-right: 5px;
      text-align: center;
      word-wrap: break-word;
    }
    input,
    select {
      display: flex;
      align-items: center;
      height: 100%;
      width: 100%;
      border: solid 1px #d6d6d6;
      margin: 0 0.5rem 0 0.5rem;
      padding-left: 0.5rem;
      &:focus {
        outline: none;
      }
    }
  }
  .filter-action {
    display: flex;
    justify-content: end;
    button {
      cursor: pointer;
      border-radius: 4px;
      border: none;
      background-color: #435269;
      color: white;
      padding: 0.5rem 1rem 0.5rem 1rem;
    }
  }
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

const HostRegisterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  .input-wrapper {
    margin: 0.5rem;
    display: flex;
    height: 2rem;
    align-items: center;
    .input-title {
      min-width: 100px;
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
    }
    input {
      max-width: 100px;
      border: solid 1px #d6d6d6;
      margin: 0 0.5rem 0 0.5rem;
      padding: 0.5rem;
      &:focus {
        outline: none;
      }
    }
  }
`;
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
export default HostManagement;
