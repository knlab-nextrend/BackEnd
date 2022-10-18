import React, { useState, useEffect } from "react";
import HostManagement from "./HostManagement";
import XLSX from "xlsx";
import {
  HostManagementApi,
  hostSyncApi,
  HostTestApi,
  sessionHandler,
} from "../../../Utils/api";
import { useDispatch, useSelector } from "react-redux";
import {
  setModal,
  setModalData,
  setCategoryModalType,
} from "../../../Modules/modal";
import { trackPromise } from "react-promise-tracker";
import { LoadingWrapper } from "../../../Components/LoadingWrapper";

function HostManagementContainer() {
  const dispatch = useDispatch();
  const [hostList, setHostList] = useState([]);
  const [hostTestList, setHostTestList] = useState([]);

  const [currentHostList, setCurrentHostList] = useState([]);
  const [selectedHost, setSelectedHost] = useState(null);
  /* 검색 필터 변수 */
  const [filterInputs, setFilterInputs] = useState({
    host: "",
    lang: "",
    country: "",
    name: "",
    category: "",
    workCycle: "",
  });
  const { host, lang, country, name, category, workCycle } = filterInputs; // 비구조화 할당을 통해 값 추출
  const [filterOpen, setFilterOpen] = useState(true);

  /* crawlDataForm 과 공유하여 사용. 어차피 각 화면은 독립적이기 때문에. */
  const [hostPublisher, setHostPublisher] = useState("");
  const [hostWorkCycle, setHostWorkCycle] = useState("");
  const docLanguage = useSelector(
    (state) => state.modal.modalData.doc_language
  ); // doc_language HOST 언어
  const docCountry = useSelector((state) => state.modal.modalData.doc_country); // doc_country HOST 국가
  const docCategory = useSelector(
    (state) => state.modal.modalData.doc_category
  ); // doc_category HOST 정책 분류

  const _hostPublisherHandler = (e) => {
    setHostPublisher(e.target.value);
  };
  const _hostWorkCycleHandler = (e) => {
    setHostWorkCycle(e.target.value);
  };
  const _registerHostOpenHandler = (host) => {
    //현재 선택된 host_id 새로 보고자 하는 host_id 같을경우 이미 오픈된 목록을 닫는걸로 생각
    if (selectedHost) {
      if (selectedHost.idx === host.idx) {
        setSelectedHost(null);
      } else {
        setSelectedHost(host);
      }
    } else {
      setSelectedHost(host);
    }
  };
  const _openCategoryModal = (categoryModalType) => {
    dispatch(setModal("CategoryModal"));
    dispatch(setCategoryModalType(categoryModalType));
  };
  const _filterInputsHandler = (e) => {
    const { value, name } = e.target; // 우선 e.target 에서 name 과 value 를 추출
    setFilterInputs({
      ...filterInputs, // 기존의 input 객체를 복사한 뒤
      [name]: value, // name 키를 가진 값을 value 로 설정
    });
  };
  const filterSearch = () => {
    let _result = [...hostList];
    for (let key in filterInputs) {
      // host와 name은 포함검색되어야하기에
      if (key === "host" || key === "name") {
        _result = _result.filter((item) => {
          return item[key].includes(filterInputs[key]);
        });
      } else {
        if (filterInputs[key] !== "") {
          // 빈 값이 filter에 걸리면 값이 걸러지지 않기 때문..
          if (key === "workCycle") {
            _result = _result.filter((item) => {
              return item[key] == filterInputs[key];
            });
          } else {
            _result = _result.filter((item) => {
              if (item[key].length === 0) {
                return false;
              } else {
                return item[key][0].CT_NM === filterInputs[key];
              }
            });
          }
        }
      }
    }
    setCurrentHostList(_result);
  };
  const _filterOpenHandler = () => {
    setFilterOpen(!filterOpen);
  };

  const excelUpload = (e) => {
    let _excelData = [];
    let input = e.target;
    let reader = new FileReader();
    reader.onload = function () {
      let data = reader.result;
      const excelFile = XLSX.read(data, { type: "binary" });
      const sheetName = excelFile.SheetNames[0];
      const firstSheet = excelFile.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet, { defval: "" });
      jsonData.map((item) => {
        // _excelData.push({
        //   host: item["HOST 도메인"],
        //   country: item["HOST 해당 국가"],
        //   lang: item["HOST 해당 언어"],
        //   name: item["발급 기관 명"],
        //   category: item["HOST 정책 분류"],
        //   workCycle: item["크롤링 수집주기"],
        // });
        _excelData.push(item["HOST 도메인"]);
      });
      console.log(_excelData);
      //hostTestUpload(_excelData);
    };
    reader.readAsBinaryString(input.files[0]);
  };
  const excelDownload = () => {
    // 새 엑셀 임시 새 문서 생성
    const book = XLSX.utils.book_new();
    // 값 생성
    let _arr = [
      [
        "HOST 도메인",
        "HOST 해당 언어",
        "HOST 해당 국가",
        "발급 기관 명",
        "HOST 정책 분류",
        "크롤링 수집주기",
      ],
    ];
    hostList.map((item) => {
      _arr.push([
        item.host,
        item.lang,
        item.country,
        item.name,
        item.category,
        item.workCycle,
      ]);
    });
    const _hostArray = XLSX.utils.aoa_to_sheet(_arr);
    // 첫번째 시트에 생성한 데이터를 넣는다.
    XLSX.utils.book_append_sheet(book, _hostArray, "HOST 목록");
    // 엑셀파일을 생성하고 저장한다.
    XLSX.writeFile(book, `host_list.xlsx`);
  };

  const hostTestUpload = (excel_data) => {
    HostTestApi({ list: excel_data }, "POST").then((res) => {
      if (res.status === 200) {
        alert("성공적으로 업로드되었습니다");
        dataFetch();
      }
    });
  };

  const eachHostModify = (host) => {
    HostManagementApi({ list: host }, "POST").then((res) => {
      if (res.status === 200) {
        alert("성공적으로 수정 되었습니다");
        dataFetch();
      }
    });
  };

  const nextrendSync = () => {
    hostSyncApi().then((res) => {
      if (res.status === 200) {
        alert("성공적으로 동기화 되었습니다.");
        dataFetch();
        //testDataFetch();
      }
    });
  };
  const hostRegisterUpload = () => {
    if (selectedHost) {
      if (
        hostPublisher === "" ||
        docCountry.length === 0 ||
        docCategory.length === 0 ||
        docLanguage.length === 0 ||
        hostWorkCycle === ""
      ) {
        alert("모든 값을 채워주세요");
        return;
      } else if (docCountry.length > 1) {
        alert("국가는 하나만 선택 가능합니다.");
      } else if (docCategory.length > 1) {
        alert("정책 분류는 하나만 선택 가능합니다.");
      } else if (docLanguage.length > 1) {
        alert("언어는 하나만 선택 가능합니다.");
      } else {
        const hostObj = {
          category: docCategory[0].CODE,
          country: docCountry[0].CODE,
          lang: docLanguage[0].CODE,
          name: hostPublisher,
          host: selectedHost.host,
          workCycle: hostWorkCycle,
        };
        eachHostModify([hostObj]);
      }
    } else {
      alert("host를 선택해주세요.");
    }
  };

  const testDataFetch = () => {
    trackPromise(
      HostTestApi(null, "GET")
        .then((res) => {
          console.log(res.data);
          testDataCleansing(res.data);
        })
        .catch((err) => {
          sessionHandler(err, dispatch).then((res) => {
            HostTestApi(null, "GET").then((res) => {
              testDataCleansing(res.data);
            });
          });
        })
    );
  };
  const dataFetch = () => {
    trackPromise(
      HostManagementApi(null, "GET")
        .then((res) => {
          dataCleansing(res.data);
        })
        .catch((err) => {
          sessionHandler(err, dispatch).then((res) => {
            HostManagementApi(null, "GET").then((res) => {
              dataCleansing(res.data);
            });
          });
        })
    );
  };
  const dataCleansing = (rawData) => {
    const _arr = rawData.map((item) => {
      let _obj = {};
      _obj["idx"] = item.IDX;
      _obj["host"] = item.HOST || "";
      _obj["lang"] = item.LANG;
      _obj["name"] = item.NAME || "";
      _obj["country"] = item.COUNTRY;
      _obj["category"] = item.CATEGORY;
      _obj["workCycle"] = item.WORK_CYCLE || "";
      return _obj;
    });
    setHostList(_arr);
  };

  const testDataCleansing = (rawData) => {
    const _arr = rawData.map((item, index) => {
      let _obj = { ...item };
      _obj["idx"] = index;
      _obj["test_end"] = true;
      _obj["is_registered"] =
        hostList.filter((host) => host.host === "https://www.worldbank.org/")
          .length === 1;
      return _obj;
    });
    setHostTestList(_arr);
  };

  useEffect(() => {
    dataFetch();
    //testDataFetch();
  }, []);
  useEffect(() => {
    setCurrentHostList(hostList);
  }, [hostList]);
  useEffect(() => {
    if (!!selectedHost) {
      console.log(selectedHost);
      setHostPublisher(selectedHost.name);
      setHostWorkCycle(selectedHost.workCycle);
      dispatch(setModalData(selectedHost.category, "doc_category")); // 값 세팅
      dispatch(setModalData(selectedHost.country, "doc_country")); // 값 세팅
      dispatch(setModalData(selectedHost.lang, "doc_language")); // 값 세팅
    }
  }, [selectedHost]);
  return (
    <LoadingWrapper>
      <HostManagement
        currentHostList={currentHostList}
        filterOpen={filterOpen}
        _filterOpenHandler={_filterOpenHandler}
        _filterInputsHandler={_filterInputsHandler}
        filterSearch={filterSearch}
        excelDownload={excelDownload}
        excelUpload={excelUpload}
        _registerHostOpenHandler={_registerHostOpenHandler}
        selectedHost={selectedHost}
        _openCategoryModal={_openCategoryModal}
        docCountry={docCountry}
        docCategory={docCategory}
        docLanguage={docLanguage}
        hostRegisterUpload={hostRegisterUpload}
        _hostPublisherHandler={_hostPublisherHandler}
        _hostWorkCycleHandler={_hostWorkCycleHandler}
        hostWorkCycle={hostWorkCycle}
        hostPublisher={hostPublisher}
        nextrendSync={nextrendSync}
        hostTestList={hostTestList}
      />
    </LoadingWrapper>
  );
}
export default HostManagementContainer;
