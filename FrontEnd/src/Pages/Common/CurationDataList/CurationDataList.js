import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Pagination from "../../../Components/Pagination";
import { HiOutlineDocumentSearch, HiSearch } from "react-icons/hi";
import { MdCalendarViewDay } from "react-icons/md";
import { RiFileList2Line } from "react-icons/ri";
import DataFilter from "../../../Components/DataFilter";
import CurationDataCard from "../../../Components/CurationDataCard";
import CurationDataCard2 from "../../../Components/CurationDataCard2";
import NoData from "../../../Components/NoData";
function CurationDataList({
  curationDataList,
  dcCount,
  listSize,
  pageNo,
  setPageNo,
  viewType,
  viewTypeHandler,
  handleRowClick,
  userInfo,
  dataFilterFetch,
  setListSize,
  setSearchInput,
}) {
  const _listSizeHandler = (e) => {
    setListSize(e.target.value);
  };

  const onSubmitSearch = (e) => {
    e.preventDefault();
    const { search } = e.target;
    const input = search.value;
    setSearchInput(input);
  };

  return (
    <>
      <Wrapper>
        <RowContainer>
          <Row>
            <div className="result-count">
              <HiOutlineDocumentSearch />
              검색 결과 ({dcCount}건)
            </div>
            <div className="action-group">
              <ViewType>
                <input
                  onChange={viewTypeHandler}
                  type="radio"
                  value="card1"
                  id="card1"
                  name="view-type"
                  checked={viewType === "card1"}
                />
                <label htmlFor="card1">
                  <MdCalendarViewDay />
                  카드형1
                </label>
                <input
                  onChange={viewTypeHandler}
                  type="radio"
                  value="card2"
                  id="card2"
                  name="view-type"
                  checked={viewType === "card2"}
                />
                <label htmlFor="card2">
                  <MdCalendarViewDay />
                  카드형2
                </label>
                <input
                  onChange={viewTypeHandler}
                  type="radio"
                  value="list"
                  id="list"
                  name="view-type"
                  checked={viewType === "list"}
                />
                <label htmlFor="list">
                  <RiFileList2Line />
                  목록형
                </label>
              </ViewType>
              <select
                className="list-size"
                value={listSize}
                onChange={_listSizeHandler}
              >
                <option disabled>리스트 사이즈</option>
                <option value={2}>2건</option>
                <option value={10}>10건</option>
                <option value={30}>30건</option>
                <option value={50}>50건</option>
                <option value={75}>75건</option>
                <option value={100}>100건</option>
              </select>
            </div>
          </Row>
          <Row>
            <SearchForm onSubmit={(e) => onSubmitSearch(e)}>
              <SearchTitle>
                <HiSearch />
                <span>검색</span>
              </SearchTitle>
              <SearchInput id="search" />
              <button>검색하기</button>
            </SearchForm>
          </Row>
          <Row>
            <DataFilter type={"curation"} dataFilterFetch={dataFilterFetch} />
          </Row>
        </RowContainer>
        {curationDataList.length !== 0 ? (
          <>
            {" "}
            {viewType === "list" && (
              <CurationListWrapper>
                <CurationList
                  curationData={curationDataList}
                  handleRowClick={handleRowClick}
                />
              </CurationListWrapper>
            )}
            {viewType === "card1" && (
              <CurationCard1Wrapper>
                {curationDataList.map((item, index) => {
                  return (
                    <CustomLink
                      to={`/${
                        userInfo.permission !== 0 ? "curation" : "library"
                      }/${item._id}`}
                    >
                      <CurationDataCard
                        curationDataItem={item}
                      ></CurationDataCard>
                    </CustomLink>
                  );
                })}
              </CurationCard1Wrapper>
            )}
            {viewType === "card2" && (
              <CurationCard2Wrapper>
                {curationDataList.map((item, index) => {
                  return (
                    <CustomLink
                      to={`/${
                        userInfo.permission !== 0 ? "curation" : "library"
                      }/${item._id}`}
                    >
                      <CurationDataCard2
                        curationDataItem={item}
                      ></CurationDataCard2>
                    </CustomLink>
                  );
                })}
              </CurationCard2Wrapper>
            )}
            <Pagination
              dcCount={dcCount}
              listSize={listSize}
              pageNo={pageNo}
              setPageNo={setPageNo}
            />
          </>
        ) : (
          <NoData />
        )}
      </Wrapper>
    </>
  );
}

function CurationList({ curationData, handleRowClick }) {
  return (
    <>
      <CurationListTable>
        <colgroup>
          <col style={{ width: "40%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "8%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "8%" }} />
          <col style={{ width: "10%" }} />
        </colgroup>
        <thead>
          <tr>
            <th>제목</th>
            <th>대상 국가</th>
            <th>정책 분류</th>
            <th>문서 분류</th>
            <th>발급 기관 명</th>
            <th>페이지 수</th>
            <th>서비스 등록일</th>
          </tr>
        </thead>
        <tbody>
          {curationData.map((item, index) => {
            return (
              <tr
                onClick={() => {
                  handleRowClick(item._id);
                }}
                key={index}
              >
                <td>
                  <div className="content">
                    <div className="img-container">
                      <img
                        src={
                          item.doc_thumbnail !== null
                            ? `http://${item.doc_thumbnail}`
                            : process.env.PUBLIC_URL +
                              `/img/curation_default_image.png`
                        }
                        alt="tubmnail"
                      />
                    </div>
                    <div className="title-container">
                      <div className="dc_title_kr">{item.doc_kor_title}</div>
                      <div className="dc_title_or">{item.doc_origin_title}</div>
                    </div>
                  </div>
                </td>
                <td className="center">{item.doc_country_list}</td>
                <td className="center">{item.doc_category_list}</td>
                <td className="center">{item.doc_content_type_list}</td>
                <td className="center">{item.doc_publisher}</td>

                <td className="center">{item.doc_page}쪽</td>
                <td className="center">{item.doc_register_date}</td>
              </tr>
            );
          })}
        </tbody>
      </CurationListTable>
    </>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const RowContainer = styled.div`
  border: solid 1px #d6d6d6;
  margin-top: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  width: 100%;
`;
const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: max-content;
  padding: 1rem;
  border-bottom: solid 1px #d6d6d6;
  color: rgb(59, 59, 59);
  &:last-child {
    border: none;
  }

  .result-count {
    font-size: 16px;
    font-weight: bold;
    * {
      padding-right: 0.5rem;
    }
  }
  .action-group {
    display: flex;
  }
  .list-size {
    margin: 0 0.5rem 0 0.5rem;
    padding: 0.5rem;
    border: solid 1px #d6d6d6;
  }
`;

const ViewType = styled.div`
  display: flex;
  font-size: 14px;
  input[type="radio"] {
    display: none;
    &:checked + label {
      color: white;
      font-weight: bold;
      background-color: #435269;
    }
  }
  label {
    display: flex;
    align-items: center;
    margin: 0.25rem;
    cursor: pointer;
    padding: 0.25rem 0.5rem 0.25rem 0.5rem;
    border-radius: 4px;
  }
`;

const SearchTitle = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 0.5rem;

  color: #435269;
  font-weight: bold;
`;

const SearchForm = styled.form`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  width: 100%;

  & > button {
    border: none;
    border-radius: 0.25rem;
    padding: 0.5rem 1rem;
    background-color: #435269;
    color: white;
    font-weight: bold;
    font-size: 14px;
    word-break: keep-all;
    cursor: pointer;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem 1rem;
  margin: 0 2rem;
  border: solid 1px #d6d6d6;
`;

const CurationListTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: solid 1px #d6d6d6;

  tr {
    height: 2.5rem;
    cursor: pointer;
    border-bottom: 2px solid rgba(0, 0, 0, 0.1);
  }
  th,
  td {
    padding: 0.5rem;
    word-break: break-all;
  }
  thead {
    background-color: #d8dee6;
    color: #323d4d;
    border-bottom: 2px solid rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  .center {
    text-align: center;
  }
  .content {
    display: flex;
    .img-container {
      max-width: 5rem;
      max-height: 5rem;
      overflow: hidden;
      border-radius: 4px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .title-container {
      display: flex;
      flex-direction: column;
      .dc_title_kr {
        color: #009999;
        font-weight: bold;
        font-size: 16px;
        padding: 0.5rem;
        word-break: break-all;
      }
      .dc_title_or {
        color: rgb(59, 59, 59);
        padding: 0.5rem;
        word-break: break-all;
      }
    }
  }
`;
const CurationListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 14px;
  width: 100%;
`;
const CurationCard1Wrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
`;
const CurationCard2Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const CustomLink = styled(Link)`
  text-decoration: none;
  color: black;
`;
export default CurationDataList;
