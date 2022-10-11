import React from "react";
import FormHeader from "../../../Components/FormHeader";
import SearchBar from "../../../Components/SearchBar";
import styled from "styled-components";
import {
  MdUpload,
  MdDownload,
  MdOutlineModeEditOutline,
  MdOutlineDeleteOutline,
  MdOutlineCheck,
  MdClose,
} from "react-icons/md";
function MultilingualDictionary({
  dataAddOpen,
  dataAddOpenHandler,
  currentWordData,
  editWordIndex,
  editWordData,
  editWordOpen,
  editWordCancel,
  editWordHandler,
  saveWord,
  deleteWord,
  keywordHandler,
  search,
  addWord,
  addWordDataHandler,
  wordDataUpload,
  wordDataDownload
}) {
  return (
    <>
      <FormHeader type={"view"} title={"다국어 사전 관리"} />
      <Wrapper>
        <ContentContainer>
          <div className="content-title">
            <div className="main-title">
              검색에 사용할 다국어 단어 정의를 추가해주세요. 검색은 검색어를 포함한 결과를 표출합니다.
            </div>
          </div>
          <div className="content-body">
            <DictionaryFunctionWrapper>
              <ShortSearchBar>
                <SearchBar keywordHandler={keywordHandler} searchAction={search}/>
              </ShortSearchBar>
              <DictionaryFunctionBtnWrapper>
                <label htmlFor="excel-upload">
                  <MdUpload size="20" />
                  사전 데이터 일괄 업로드
                </label>
                <input id="excel-upload" type="file" accept=".xlsx" onChange={wordDataUpload}/>
                <button onClick={wordDataDownload}>
                  <MdDownload size="20" />
                  사전 데이터 다운로드
                </button>
                <button>
                  <MdOutlineDeleteOutline size="20" />
                  선택 데이터 일괄 삭제
                </button>
              </DictionaryFunctionBtnWrapper>
            </DictionaryFunctionWrapper>
            <DictonaryDataTable>
              <colgroup>
                <col width="5%" />
                <col width="85%" />
                <col width="10%" />
              </colgroup>
              <thead>
                <tr>
                  <th className="select">
                    <input type="checkbox" />
                  </th>
                  <th>
                    다국어 단어 정의
                  </th>
                  <th className="setting">관리</th>
                </tr>
              </thead>
              <tbody>
                {currentWordData.map((word, index) => {
                  return editWordIndex === word.IDX ? (
                    <tr>
                      <td className="select">
                        <input type="checkbox" />
                      </td>
                      <td className="data">
                        <input
                          type="text"
                          value={editWordData}
                          onChange={editWordHandler}
                        />
                      </td>
                      <td className="setting">
                        <div className="actions">
                          <button
                            className="confirm"
                            onClick={() => {
                              saveWord(word);
                            }}
                          >
                            <MdOutlineCheck />
                          </button>
                          <button onClick={editWordCancel}>
                            <MdClose />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td className="select">
                        <input type="checkbox" />
                      </td>
                      <td className="data">{word.MULTI_TEXT}</td>
                      <td className="setting">
                        <div className="actions">
                          <button
                            onClick={() => {
                              editWordOpen(word);
                            }}
                          >
                            <MdOutlineModeEditOutline />
                          </button>
                          <button
                            className="delete"
                            onClick={() => {
                              deleteWord(word);
                            }}
                          >
                            <MdOutlineDeleteOutline />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </DictonaryDataTable>
            <DataAddContainer>
              <button onClick={dataAddOpenHandler}>+ 새 데이터 추가</button>
              {dataAddOpen && (
                <div>
                  <input
                    type="text"
                    placeholder="다국어 동의어를 입력해주세요."
                    onChange={addWordDataHandler}
                  />
                  <button onClick={addWord}>추가</button>
                </div>
              )}
            </DataAddContainer>
          </div>
        </ContentContainer>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  display: flex;
  font-size: 14px;
  min-height: 1280px;
  background-color: #eee;
  color: rgb(59, 59, 59);
`;

const ShortSearchBar = styled.div`
  width: 500px;
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
  width: 100%;
  .content-title {
    border-bottom: 1px solid #d6d6d6;
    padding: 1rem;
    .main-title {
      font-size: 16px;
      font-weight: bold;
    }
  }
  .content-body {
    padding: 1rem;
  }
`;

const DictionaryFunctionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem;
`;
const DictionaryFunctionBtnWrapper = styled.div`
  display: flex;
  input[type=file]{
    display:none;
  }
  button,label {
    cursor:pointer;
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
  border-collapse: collapse;
  text-align: left;
  th,
  td {
    border-bottom: 1px solid #d6d6d6;
    padding: 10px;
  }
  tr:first-child,
  tr:last-child {
    border: none;
  }
  input[type="text"] {
    width: 100%;
  }
  .sort-btn {
    background-color: white;
    border: none;
    cursor: pointer;
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

const DataAddContainer = styled.div`
  display: flex;
  margin:1rem;
  & *{
    margin-right:1rem;
  }
  button {
    padding:0.5rem;
    font-size: 12px;
    background-color: #435269;
    color: white;
    border: solid 1px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    cursor:pointer;
  }
  input[type=text]{
    height:85%;
    min-width:300px;
    padding-left:0.5rem;
    &:focus{
      outline:none;
    }
  }
`;
export default MultilingualDictionary;
