import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { trackPromise } from "react-promise-tracker";
import { LoadingWrapper } from "Components/LoadingWrapper";

import {
  ScreeningDataFetchApi,
  ScreeningDataStageApi,
  ScreeningDataDeleteApi,
  ScreeningDataKeepApi,
  sessionHandler,
} from "Utils/api";
import CrawlDataScreening from "./CrawlDataScreening";

const TAB_VALUES = {
  "스크리닝 대기": false,
  "스크리닝 보류": true,
};

const pageSorts = {
  asc: (rows) => [...rows].sort((a, b) => a.doc_page - b.doc_page),
  desc: (rows) => [...rows].sort((a, b) => b.doc_page - a.doc_page),
};

const languageSort = {
  asc: (rows) =>
    [...rows].sort((a, b) =>
      a.doc_language < b.doc_language
        ? -1
        : a.doc_language < b.doc_language
        ? 1
        : 0
    ),
  desc: (rows) =>
    [...rows].sort((a, b) =>
      a.doc_language > b.doc_language
        ? -1
        : a.doc_language > b.doc_language
        ? 1
        : 0
    ),
};

const dateSort = {
  asc: (rows) =>
    [...rows].sort(
      (a, b) =>
        new Date(a.doc_collect_date).getTime() -
        new Date(b.doc_collect_date).getTime()
    ),
  desc: (rows) =>
    [...rows].sort(
      (a, b) =>
        new Date(b.doc_collect_date).getTime() -
        new Date(a.doc_collect_date).getTime()
    ),
};

const screeningSortRules = {
  page: pageSorts,
  language: languageSort,
  date: dateSort,
};

export const SORT_ORDER = ["asc", "desc"];

function CrawlDataScreeningContainer() {
  const [screeningData, setScreeningData] = useState([]); // 현재 보여질 데이터
  const [unsortedData, setUnsortedData] = useState([]);
  const [searchObj, setSearchObj] = useState(null); // 검색 옵션
  /* 페이지네이션 */
  const [dcCount, setDcCount] = useState(0); // document 총 개수
  const [pageNo, setPageNo] = useState(1); // 현재 활성화 된 페이지 번호
  const [listSize, setListSize] = useState(50); // 한 페이지에 나타낼 document 개수
  /* 완료, 보류, 삭제 전체선택 구현하기 */
  const [itemList, setItemList] = useState([]); // {id,status} 객체 리스트로 구성되어 있음.
  const [checkedAll, setCheckedAll] = useState("delete"); // 전체선택 기본값은 delete
  const [stageDataList, setStageDataList] = useState([]);
  const [keepDataList, setKeepDataList] = useState([]);
  const [deleteDataList, setDeleteDataList] = useState([]); // 기본 값은 delete
  const [selectedTab, setSelectedTab] = useState("스크리닝 대기");
  const [isKeep, setIsKeep] = useState(TAB_VALUES["스크리닝 대기"]);
  /* 정렬 */
  const [sortState, setSortState] = useState({ type: null, order: 0 });

  const dispatch = useDispatch();

  const onClickTab = (tabName) => {
    if (selectedTab === tabName) return;

    setSelectedTab(tabName);
    setIsKeep(TAB_VALUES[tabName]);
    setPageNo(1);
    setSortState({ type: null, order: 0 });
  };

  const onChangeListSize = (e) => {
    setListSize(e.target.value);
    setPageNo(1);
    setSortState({ type: null, order: 0 });
  };

  const sort = (type) => {
    if (sortState.type !== type) {
      const order = 0;
      const newScreeningData =
        screeningSortRules[type][SORT_ORDER[order]](unsortedData);
      setSortState({ type, order });
      setScreeningData(newScreeningData);
    } else if (sortState.order === 1) {
      setSortState({ type: null, order: 0 });
      setScreeningData(unsortedData);
    } else {
      const order = sortState.order + 1;
      const newScreeningData =
        screeningSortRules[type][SORT_ORDER[order]](unsortedData);
      setSortState((prev) => ({ ...prev, order }));
      setScreeningData(newScreeningData);
    }
    setCheckedAll("delete");
  };

  const onChangeCheckedAll = (e) => {
    if (e.target.checked) {
      setCheckedAll(e.target.value);
    }
  };

  const onChangeEach = (e, type) => {
    const _item_id = e.target.value;
    const _index = itemList.findIndex(
      (item) => item.item_id === Number(_item_id)
    );
    const _newItemList = [...itemList];
    _newItemList[_index].status = type;
    setItemList(_newItemList);
    console.log(_newItemList);
  };

  const dataFilterFetch = (searchObj) => {
    setSearchObj(searchObj);
  };

  /* 선택된 데이터를 크롤데이터 정제 단계로 넘기고 나머지 데이터는 버리기 */
  const stageScreeningData = async () => {
    if (window.confirm("선택 하신 대로 스크리닝을 진행하시겠습니까?")) {
      ScreeningDataStageApi(stageDataList).then((res) => {
        if (res.status === 200) {
          ScreeningDataKeepApi(keepDataList).then((res) => {
            if (res.status === 200) {
              if (deleteDataList.length !== 0) {
                ScreeningDataDeleteApi(deleteDataList).then((res) => {
                  if (res.status === 200) {
                    alert("스크리닝이 성공적으로 완료되었습니다.");
                    dataFetch();
                  }
                });
              } else {
                alert("스크리닝이 성공적으로 완료되었습니다.");
                dataFetch();
              }
            }
          });
        }
      });
    }
  };

  /* 데이터 불러오기 */
  const dataFetch = (searchObj = null) => {
    trackPromise(
      ScreeningDataFetchApi(listSize, pageNo, isKeep, searchObj)
        .then((res) => {
          console.log(res.data);
          dataCleansing(res.data);
        })
        .catch((err) => {
          sessionHandler(err, dispatch).then((res) => {
            ScreeningDataFetchApi(listSize, pageNo).then((res) => {
              dataCleansing(res.data);
            });
          });
        })
    );
  };

  /* 데이터 정제하기 */
  const dataCleansing = (rawData) => {
    let _screeningData = [];
    let _rawScreeningData = rawData.docs;
    let _dcCount = rawData.dcCount;

    _rawScreeningData.forEach((item, index) => {
      const obj = {
        item_id: item.item_id,
        doc_origin_summary: item.doc_origin_summary,
        doc_host: item.doc_host,
        doc_language: item.doc_language,
        doc_collect_date: item.doc_collect_date.substring(0, 10),
        doc_page: item.doc_page,
        doc_url: item.doc_url,
      };
      _screeningData.push(obj);
    });

    setDcCount(_dcCount);
    setScreeningData(_screeningData);
    setUnsortedData(_screeningData);
  };

  /* pageNo, listSize 가 변경되었을 때 데이터를 다시 불러옴 */
  useEffect(() => {
    setCheckedAll("delete");
    dataFetch(searchObj);
  }, [pageNo, listSize, isKeep, searchObj]);

  /* 데이터를 불러오는데 성공하였을 경우 각 데이터의 id값과 해당 데이터의 status를 list에 먼저 세팅해줌*/
  useEffect(() => {
    const _itemList = screeningData.map((item) => ({
      item_id: item.item_id,
      status: "delete",
    }));
    setItemList(_itemList);
  }, [screeningData]);

  useEffect(() => {
    const _newItemList = [...itemList];
    _newItemList.map((item, index) => {
      item.status = checkedAll;
      return item;
    });

    setItemList(_newItemList);
  }, [checkedAll]);
  /* itemList 의 status가 변경되었을 경우 */
  useEffect(() => {
    setStageDataList(
      itemList
        .filter((item) => item.status === "stage")
        .map((item) => item.item_id)
    );
    setKeepDataList(
      itemList
        .filter((item) => item.status === "keep")
        .map((item) => item.item_id)
    );
    setDeleteDataList(
      itemList
        .filter((item) => item.status === "delete")
        .map((item) => item.item_id)
    );
  }, [itemList]);

  return (
    <LoadingWrapper>
      <CrawlDataScreening
        screeningData={screeningData}
        dcCount={dcCount}
        listSize={listSize}
        onChangeListSize={onChangeListSize}
        pageNo={pageNo}
        setPageNo={setPageNo}
        stageScreeningData={stageScreeningData}
        checkedAll={checkedAll}
        onChangeCheckedAll={onChangeCheckedAll}
        onChangeEach={onChangeEach}
        stageDataList={stageDataList}
        keepDataList={keepDataList}
        deleteDataList={deleteDataList}
        selectedTab={selectedTab}
        onClickTab={onClickTab}
        dataFilterFetch={dataFilterFetch}
        sort={sort}
        sortState={sortState}
      />
    </LoadingWrapper>
  );
}

export default CrawlDataScreeningContainer;
