import React, { useEffect, useState } from "react";
import Dashboard from "./Dashboard";
import { useDispatch } from "react-redux";
import { setModal, setModalData } from "../../../Modules/modal";
import { trackPromise } from "react-promise-tracker";
import {
  crawlHostDataFetchApi,
  crawlSumDataFetchApi,
  userWorkLogFetchApi,
  curationWorkListFetchApi,
  sessionHandler,
  countryWorkListFetchApi,
  workAllLogFetchApi,
} from "../../../Utils/api";

function DashboardContainer() {
  // docs 문서 통계
  // work 작업자 작업 통계
  // crawl 크롤러 현황
  const dispatch = useDispatch();
  const [menuType, setMenuType] = useState("docs_country");

  const [crawlHostList, setCrawlHostList] = useState([]); // 크롤 호스트 전체 목록
  const [currentCrawlHostLog, setCurrentCrawlHostLog] = useState([]); // 선택한 호스트의 크롤링 작업 로그 목록
  const [selectedHostId, setSelectedHostId] = useState(null); // 현태 선택한 호스트
  const [crawlSum, setCrawlSum] = useState(null); // 현재 크롤링 총 작업 현황
  const [process, setProcess] = useState(1);

  const [currentUserId, setCurrentUserId] = useState(null); // 현재 선택된 유저의 id

  const [dateGte, setDateGte] = useState("2022-01-01"); // 현재 시각 기준 3년 전으로 설정 할 예정...
  const [lineGraphData, setLineGraphData] = useState([]); // 기간별 통계 꺾은선 그래프 데이터

  const [duration, setDuration] = useState("daily");

  const [curationWorkList, setCurationWorkList] = useState([]); // 해당 작업자의 큐레이션 내역 목록

  const [userWorkAllData, setUserWorkAllData] = useState([]); // 해당 작업자의 총 작업량
  const [countryPieChartData, setCountryPieChartData] = useState([]); // 세계 국가 문서 현황
  const [countryDocumentData , setCountryDocumentData] = useState(null); // 특정 국가 문서 현황 
  const [workAllLogData, setWorkAllLogData] = useState({});
  const [workAllStatus, setWorkAllStatus] = useState(-1); // 전체 작업에서 통계를 확인할 단계

  const [sortType,setSortType] = useState("asc");
  const [sortDataType,setSortDataType] = useState(null);
  const processTitle = {
    0: "스크리닝",
    1: "정제",
    2: "등록",
    3: "큐레이션",
  };
  const menuHandler = (e) => {
    setMenuType(e.target.value);
  };
  const processHandler = (select) => {
    setProcess(select);
  };
  const rowClickHandler = (host_id) => {
    // 현재 선택된 host_id 새로 보고자 하는 host_id 같을경우 이미 오픈된 목록을 닫는걸로 생각
    if (selectedHostId === host_id) {
      setSelectedHostId(null);
    } else {
      setSelectedHostId(host_id);
    }
  };
  const workAllStatusHandler = (status) => {
    setWorkAllStatus(status);
  };
  const currentUserIdHandler = (e) => {
    setCurrentUserId(e.target.value);
  };
  const curationWorkModalOpen = (data) => {
    dispatch(setModal("CurationWorkContentModal"));
    dispatch(setModalData(data, "curation_work_content"));
  };

  function getRandomColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  }

  const crawlCountSort = (dataType) => {
    setSortDataType(dataType);
    if(sortType==="asc"){
      setSortType("desc")
    }
    else{
      setSortType("asc")
    }
  }
  const getCrawlHostList = () => {
    trackPromise(
      crawlHostDataFetchApi()
        .then((res) => {
          console.log(res.data)
          setCrawlHostList(res.data);
          crawlSumDataFetchApi().then((res) => {
            setCrawlSum(res.data[0]);
          });
        })
        .catch((err) => {
          sessionHandler(err, dispatch).then((res) => {
            crawlHostDataFetchApi().then((res) => {
              setCrawlHostList(res.data);
              crawlSumDataFetchApi().then((res) => {
                setCrawlSum(res.data[0]);
              });
            });
          });
        })
    );
  };

  const getCrawlHostLogList = () => {
    trackPromise(
      crawlHostDataFetchApi(selectedHostId)
        .then((res) => {
          setCurrentCrawlHostLog(res.data.reverse()); // 최신순
        })
        .catch((err) => {
          sessionHandler(err, dispatch).then((res) => {
            crawlHostDataFetchApi(selectedHostId).then((res) => {
              setCurrentCrawlHostLog(res.data.reverse()); // 최신순
            });
          });
        })
    );
  };
  const graphDataCleansing = (rawData) => {
    setLineGraphData(
      rawData.map((item, index) => {
        return { date: new Date(item.start).getTime(), value: item.cnt };
      })
    );
  };
  const getUserWorkLog = () => {
    const dataObj = {
      status: process,
      wid: Number(currentUserId),
      duration: duration,
      dateLte: new Date().toISOString().substring(0, 10),
      dateGte: dateGte,
    };
    trackPromise(
      userWorkLogFetchApi(dataObj)
        .then((res) => {
          graphDataCleansing(res.data);
        })
        .catch((err) => {
          sessionHandler(err, dispatch).then((res) => {
            userWorkLogFetchApi(dataObj).then((res) => {
              graphDataCleansing(res.data);
            });
          });
        })
    );
  };
  const _getUserWorkAllLog = async (process) => {
    const dataObj = {
      status: process,
      duration: duration,
      dateLte: new Date().toISOString().substring(0, 10),
      dateGte: dateGte,
    };
    const _rawData = await userWorkLogFetchApi(dataObj);
    const _tmp = _rawData.data.map((item, index) => {
      return { date: new Date(item.start).getTime(), value: item.cnt };
    });
    return _tmp;
  };

  const getUserWorkAllLog = async () => {
    const screeningResult = await _getUserWorkAllLog(0);
    const refineResult = await _getUserWorkAllLog(2);
    const registerResult = await _getUserWorkAllLog(4);
    const curationResult = await _getUserWorkAllLog(6);
    let _tmp = [
      [...screeningResult],
      [...refineResult],
      [...registerResult],
      [...curationResult],
    ];
    setUserWorkAllData(_tmp);
  };
  const getCurationWorkList = () => {
    const dataObj = {
      wid: Number(currentUserId),
      dateLte: new Date().toISOString().substring(0, 10),
      dateGte: "1970-01-01",
    };
    trackPromise(
      curationWorkListFetchApi(dataObj)
        .then((res) => {
          setCurationWorkList(res.data);
        })
        .catch((err) => {
          sessionHandler(err, dispatch).then((res) => {
            curationWorkListFetchApi(dataObj).then((res) => {
              setCurationWorkList(res.data);
            });
          });
        })
    );
  };

  const pieChartDataCleansing = (rawData) => {
    let _pieChart = [];

    for (var key in rawData) {
      let obj = {
        id: key,
        label: key,
        value: rawData[key],
        color: getRandomColor(),
      };
      _pieChart.push(obj);
    }
    setCountryPieChartData(_pieChart);
  };

  const getCountryWorkList = () => {
    trackPromise(
      countryWorkListFetchApi(workAllStatus)
        .then((res) => {
          pieChartDataCleansing(res.data);
        })
        .catch((err) => {
          sessionHandler(err, dispatch).then((res) => {
            countryWorkListFetchApi(workAllStatus).then((res) => {
              pieChartDataCleansing(res.data);
            });
          });
        })
    );
  };

  const getWorkAllLogData = () => {
    trackPromise(
      workAllLogFetchApi()
        .then((res) => {
          setWorkAllLogData(res.data);
        })
        .catch((err) => {
          sessionHandler(err, dispatch).then((res) => {
            workAllLogFetchApi().then((res) => {
              setWorkAllLogData(res.data);
            });
          });
        })
    );
  };

  const getCountryMapChartData = async (countryName) => {
    const _collect = await countryWorkListFetchApi(-1);
    const _screening = await countryWorkListFetchApi(0);
    const _refine = await countryWorkListFetchApi(2);
    const _register = await countryWorkListFetchApi(4);
    const _curation = await countryWorkListFetchApi(6);
    const _data = {
      collect:_collect.data[countryName] || 0,
      screening:_screening.data[countryName] || 0,
      refine:_refine.data[countryName] || 0,
      register:_register.data[countryName] || 0,
      curation: _curation.data[countryName] || 0
    };
    console.log(_data)
    setCountryDocumentData({country:countryName,data:_data});
  };
  useEffect(() => {
    getCrawlHostList(); // 크롤 호스트 목록 불러오기
  }, []);

  useEffect(() => {
    if (menuType === "docs_country") {
      getUserWorkAllLog();
      getCountryWorkList();
      getWorkAllLogData();
    }
    if (!!currentUserId) {
      getUserWorkLog();
    }
  }, [currentUserId, dateGte, process, duration, workAllStatus]);
  useEffect(() => {
    if (!!currentUserId) {
      getCurationWorkList();
    }
  }, [currentUserId]);

  useEffect(() => {
    if (selectedHostId !== null) {
      getCrawlHostLogList();
    }
  }, [selectedHostId]);

  useEffect(()=>{
    if(sortDataType !==null){
      if(sortType==="asc"){
        const sortResult = crawlHostList.sort((a, b) => a[sortDataType] - b[sortDataType]);
        setCrawlHostList(sortResult);
      }
      else{
        const sortResult = crawlHostList.sort((a, b) => b[sortDataType] - a[sortDataType]);
        setCrawlHostList(sortResult);
      }
      
    }
  },[sortType,sortDataType])
  return (
    <>
      <Dashboard
        countryPieChartData={countryPieChartData}
        menuHandler={menuHandler}
        menuType={menuType}
        processHandler={processHandler}
        rowClickHandler={rowClickHandler}
        process={process}
        crawlHostList={crawlHostList}
        selectedHostId={selectedHostId}
        currentCrawlHostLog={currentCrawlHostLog}
        crawlSum={crawlSum}
        currentUserIdHandler={currentUserIdHandler}
        setCurrentUserId={setCurrentUserId}
        setDateGte={setDateGte}
        lineGraphData={lineGraphData}
        setDuration={setDuration}
        duration={duration}
        curationWorkModalOpen={curationWorkModalOpen}
        curationWorkList={curationWorkList}
        userWorkAllData={userWorkAllData}
        workAllLogData={workAllLogData}
        workAllStatusHandler={workAllStatusHandler}
        workAllStatus={workAllStatus}
        processTitle={processTitle}
        countryDocumentData={countryDocumentData}
        getCountryMapChartData={getCountryMapChartData}
        crawlCountSort={crawlCountSort}
      />
    </>
  );
}
export default DashboardContainer;
