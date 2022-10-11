import React, { useState, useEffect } from "react";
import MultilingualDictionary from "./MultilingualDictionary";
import { MultilingualDictionaryApi, sessionHandler } from "../../../Utils/api";
import { trackPromise } from "react-promise-tracker";
import { useDispatch } from "react-redux";
import XLSX from "xlsx";
function MultilingualDictionaryContainer() {
  const dispatch = useDispatch();
  const [wordData, setWordData] = useState([]); // 단어 데이터
  const [currentWordData, setCurrentWordData] = useState([]); // 현재 보여질 결과
  const [dataAddOpen, setDataAddOpen] = useState(false);
  const [editWordIndex, setEditWordIndex] = useState(-1); // 수정할 다국어 단어의 index
  const [editWordData, setEditWordData] = useState(""); // 수정할 다국어 단어의 data
  const [keyword, setKeyword] = useState(""); // 검색어
  const [addWordData, setAddWordData] = useState(""); // 추가할 데이터
  const dataAddOpenHandler = () => {
    setDataAddOpen(!dataAddOpen);
  };
  const addWordDataHandler = (e) => {
    setAddWordData(e.target.value);
  };
  const addWord = () => {
    if (addWordData === "") {
      alert("추가할 단어를 입력해주세요");
      return;
    } else {
      const data = { multi_text: addWordData };
      MultilingualDictionaryApi(data, "POST").then((res) => {
        if (res.status === 200) {
          alert("성공적으로 등록되었습니다.");
          dataFetch();
        }
      });
    }
  };
  const editWordOpen = (word) => {
    setEditWordIndex(word.IDX);
    setEditWordData(word.MULTI_TEXT);
  };
  const editWordCancel = () => {
    setEditWordIndex(-1);
    setEditWordData("");
  };
  const editWordHandler = (e) => {
    setEditWordData(e.target.value);
  };

  const wordDataUpload = (e) => {
    let _excelData = [];
    let input = e.target;
    let reader = new FileReader();
    reader.onload = function () {
      let data = reader.result;
      const excelFile = XLSX.read(data, { type: "binary" });
      const sheetName = excelFile.SheetNames[0];
      const firstSheet = excelFile.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet, { defval: "" });
      jsonData.map((word, index) => {
        _excelData.push({
          multi_text: Object.values(word)
            .slice(1)
            .map((item) => item.split(", "))
            .flat(Infinity)
            .filter((item) => item !== "")
            .join(", "),
        });
      });
      const list = { list: _excelData };
      MultilingualDictionaryApi(list, "POST").then((res) => {
        if (res.status === 200) {
          alert("성공적으로 등록되었습니다.");
          dataFetch();
        }
      });
    };
    reader.readAsBinaryString(input.files[0]);
  };

  const wordDataDownload = (e) => {
    // 새 엑셀 임시 새 문서 생성
    const book = XLSX.utils.book_new();
    // 값 생성. 언어 구분 없어도 가능.
    let _arr = [["id","다국어 유사어, 관련어를 (, )로 구분 또는 셀로 구분하여 입력하세요."]];
    wordData.map((item) => {
      _arr.push([item.IDX,...item.MULTI_TEXT.split(", ")]);
    });
    const _hostArray = XLSX.utils.aoa_to_sheet(_arr);
    // 첫번째 시트에 생성한 데이터를 넣는다.
    XLSX.utils.book_append_sheet(book, _hostArray, "다국어 사전 목록");
    // 엑셀파일을 생성하고 저장한다.
    XLSX.writeFile(book, "multilingual_dictionary_list.xlsx");
  };
  const saveWord = (word) => {
    const data = { idx: word.IDX, multi_text: editWordData };
    MultilingualDictionaryApi(data, "PUT").then((res) => {
      if (res.status === 200) {
        alert("성공적으로 수정되었습니다.");
        editWordCancel();
        dataFetch();
      }
    });
  };
  const deleteWord = (word) => {
    const data = { idx: word.IDX };
    MultilingualDictionaryApi(data, "DELETE").then((res) => {
      if (res.status === 200) {
        alert("성공적으로 삭제되었습니다.");
        dataFetch();
      }
    });
  };
  const keywordHandler = (e) => {
    setKeyword(e.target.value);
  };

  const search = () => {
    setCurrentWordData(
      wordData.filter((word) => {
        return word.MULTI_TEXT.includes(keyword);
      })
    );
  };

  const dataFetch = () => {
    trackPromise(
      MultilingualDictionaryApi(null, "GET")
        .then((res) => {
          setWordData(res.data);
          setCurrentWordData(res.data);
        })
        .catch((err) => {
          sessionHandler(err, dispatch).then((res) => {
            MultilingualDictionaryApi(null, "GET").then((res) => {
              setWordData(res.data);
              setCurrentWordData(res.data);
            });
          });
        })
    );
  };

  useEffect(() => {
    dataFetch();
  }, []);

  useEffect(() => {
    if (currentWordData.length !== 0) {
      setCurrentWordData(
        wordData.filter((word) => {
          return word.MULTI_TEXT.includes(keyword);
        })
      );
    }
  }, [keyword]);

  return (
    <>
      <MultilingualDictionary
        dataAddOpen={dataAddOpen}
        dataAddOpenHandler={dataAddOpenHandler}
        currentWordData={currentWordData}
        editWordIndex={editWordIndex}
        editWordData={editWordData}
        editWordOpen={editWordOpen}
        editWordCancel={editWordCancel}
        editWordHandler={editWordHandler}
        saveWord={saveWord}
        deleteWord={deleteWord}
        keywordHandler={keywordHandler}
        search={search}
        addWord={addWord}
        addWordDataHandler={addWordDataHandler}
        wordDataUpload={wordDataUpload}
        wordDataDownload={wordDataDownload}
      />
    </>
  );
}
export default MultilingualDictionaryContainer;
