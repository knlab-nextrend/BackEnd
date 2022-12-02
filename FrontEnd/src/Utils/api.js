import axios from "axios";
import { getToken, getRefreshToken, setTokens } from "./tokens";
import { setUser } from "../Modules/user";
import { setLogout } from "../Modules/login";

/* 
    get 요청에서 headers와 params를 동시에 보내려면 아래와 같이 config 객체를 생성한 후 얘를 담아야 함
    https://stackoverflow.com/questions/48261227/use-axios-get-with-params-and-config-together
  */

/* 
  로그인 상태가 아니라면 아래의  통신 함수들은 모두 사용할 일이 없음. 
  로그인에 성공하였다면 그 때 토큰을 받아와서 통신 때마다 토큰의 유효성을 검사함. 
*/
const headers = { authorization: `Bearer ${getToken()}` };

const refreshHeaders = {
  authorization: `Bearer ${getToken()}`,
  refresh: getRefreshToken(),
};

const baseURL = "http://localhost:5000";

/* 크롤데이터 스크리닝 데이터 받아오기 */
const ScreeningDataFetchApi = (listSize, pageNo, isKeep, searchObj = null) => {
  let config = {
    headers: { authorization: `Bearer ${getToken()}` },
    params: {
      listSize: listSize,
      pageNo: pageNo,
      ...searchObj,
    },
  };
  if (isKeep) {
    config.params.keep = 1;
  }
  return axios.get(`${baseURL}/crawl/screening`, config);
};

/* 크롤데이터 스크리닝에서 정제 단계로 넘기기 */
const ScreeningDataStageApi = (stageDataList) => {
  const config = {
    headers: { authorization: `Bearer ${getToken()}` },
  };
  let body = {
    list: stageDataList,
  };
  return axios.put(`${baseURL}/crawl/screening`, body, config);
};

/* 크롤데이터 스크리닝 단계에서 보류하기 */
const ScreeningDataKeepApi = (keepDataList) => {
  const config = {
    headers: { authorization: `Bearer ${getToken()}` },
  };
  let body = {
    list: keepDataList,
  };
  return axios.post(`/crawl/screening`, body, config);
};
/* 크롤데이터 스크리닝 단계에서 버리기 */
const ScreeningDataDeleteApi = (deleteDataList) => {
  const config = {
    headers: { authorization: `Bearer ${getToken()}` },
    params: {
      list: deleteDataList,
    },
  };
  return axios.delete(`${baseURL}/crawl/screening`, config);
};

/* 크롤데이터 리스트 받아오기 */
const CrawlDataListFetchApi = (
  statusCode,
  listSize,
  pageNo,
  searchObj = null,
  general = false,
  query,
  isCrawled = null
) => {
  const params = {
    listSize,
    pageNo,
    ...searchObj,
    general,
    query,
    is_crawled: isCrawled,
  };
  const config = {
    headers: { authorization: `Bearer ${getToken()}` },
    params,
  };
  return axios.get(`${baseURL}/crawl/list/${statusCode}`, config);
};

const userCustomCurationDataFetchApi = (
  axis,
  listSize = 10,
  pageNo = 1,
  archive = null,
  query = null
) => {
  const general = query ? true : false;
  const config = {
    headers: { authorization: `Bearer ${getToken()}` },
    params: {
      axis,
      statusCode: archive ? 6 : 8,
      listSize,
      pageNo,
      query,
      general,
    },
  };
  return axios.get(`${baseURL}/nextrend/custom/search`, config);
};

/* 크롤데이터 버리기 */
const CrawlDataRejectApi = (_id, statusCode) => {
  const config = {
    headers: { authorization: `Bearer ${getToken()}` },
    params: {
      statusCode,
    },
  };
  return axios.delete(`${baseURL}/crawl/detail/${_id}`, config);
};

/* 크롤데이터 보류 하기*/

const CrawlDataKeepApi = (_id, statusCode) => {
  let body = {
    statusCode,
  };
  const config = {
    headers: { authorization: `Bearer ${getToken()}` },
  };
  return axios.put(`${baseURL}/crawl/detail/${_id}`, body, config);
};
/* 크롤데이터 넘기기*/
const CrawlDataStageApi = (statusCode, _id, docs) => {
  const body = {
    statusCode,
    _id,
    docs,
  };
  const config = {
    headers: { authorization: `Bearer ${getToken()}` },
  };

  return axios.post(`${baseURL}/crawl/detail/${_id}`, body, config);
};

/* 크롤데이터 상세조회에서 사용하는 통신 함수 */
const CrawlDataDetailFetchApi = (statusCode, _id) => {
  let config = {
    headers: { authorization: `Bearer ${getToken()}` },
    params: {
      statusCode: statusCode,
    },
  };
  return axios.get(`${baseURL}/crawl/detail/${_id}`, config);
};

/* 본문 이미지 첨부 후 url 받아오는 함수 */
const documentPastedImageApi = (imageForm) => {
  return axios.post(`${baseURL}/file/docImageAttach/`, imageForm, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const uploadExcelDataApi = (formData) => {
  return axios.post(`${baseURL}/file/uploadExcelData/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      authorization: `Bearer ${getToken()}`,
    },
  });
};

const documentDetachImageApi = (_id) => {
  let config = {
    headers: { authorization: `Bearer ${getToken()}` },
    params: { _id },
  };
  return axios.get(`${baseURL}/file/docImageDetach/`, config);
};

/* 대륙 리스트 전체 받아오는 함수 */
const ContinentsListDataFetchApi = () => {
  let config = {
    headers: { authorization: `Bearer ${getToken()}` },
  };
  return axios.get(`${baseURL}/nextrend/continents`, config);
};

/* 대륙 별 국가 리스트를 받아오는 함수 */
const CountrysListDataFetchApi = (continent) => {
  let config = {
    headers: { authorization: `Bearer ${getToken()}` },
  };

  return axios.get(`${baseURL}/nextrend/countrys/${continent}`, config);
};

/* 주제 분류 리스트를 받아오는 함수 */
const CategorysListDataFetchApi = (upperCode = null) => {
  let config = {
    headers: { authorization: `Bearer ${getToken()}` },
    params: { upperCode },
  };
  return axios.get(`${baseURL}/nextrend/categorys`, config);
};

/* 주제 분류 리스트를 모두 받아오는 함수 */
const CategoryOptionFetchApi = (type) => {
  let config = {
    headers: { authorization: `Bearer ${getToken()}` },
    params: { type },
  };
  return axios.get(`${baseURL}/nextrend/categorys/dict`, config);
};

/* 로그인 할 때 사용하는 통신 함수 */
const LoginApi = async (userID, userPW) => {
  const body = {
    userID,
    userPW,
  };

  return axios.post(`${baseURL}/nextrend/login`, body);
};

/* 일반 token 만료 후 refreshToken 검증 하는 함수 */

const RefreshTokenApi = () => {
  const config = {
    headers: refreshHeaders,
  };
  return axios.get(`${baseURL}/nextrend/refresh`, config);
};

/* user 토큰 인증 및 유저 정보 가져오기 */
const userAuthApi = () => {
  let config = {
    headers: { authorization: `Bearer ${getToken()}` },
  };
  return axios.get(`${baseURL}/nextrend/user`, config);
};

/* 데이터 요청 시 토큰 만료 및 리프레시 토큰 만료 세션 처리 함수 */
const sessionHandler = (err, dispatch) => {
  /* dispatch 를 사용하기 위해서 인자로 받아옴 */
  return new Promise((resolve, reject) => {
    console.log(err);
    if (err.response.status === 401) {
      RefreshTokenApi()
        .then((res) => {
          setTokens(res);
          userAuthApi().then((res) => {
            dispatch(
              setUser({
                name: res.data.Name,
                permission: Number(res.data.Category),
              })
            );
            resolve("세션유효");
          });
        })
        .catch((err) => {
          if (err.response.status === 401) {
            dispatch(setLogout("EXPIRED_LOGOUT"));
          }
        });
    }
  });
};

const FetchUsersApi = () => {
  let config = {
    headers: { authorization: `Bearer ${getToken()}` },
  };
  return axios.get(`${baseURL}/nextrend/user/list`, config);
};

const getUserInfoApi = (uid) => {
  let config = {
    headers: { authorization: `Bearer ${getToken()}` },
    params: {
      uid: uid,
    },
  };
  return axios.get(`${baseURL}/nextrend/user/get`, config);
};

const getUserLogoApi = (uid) => {
  const config = {
    headers: { authorization: `Bearer ${getToken()}` },
    params: {
      uid,
    },
  };
  return axios.get(`${baseURL}/nextrend/user/logo`, config);
};

const modifyUserInfoApi = (formData) => {
  return axios.post(`${baseURL}/nextrend/user/modify`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      authorization: `Bearer ${getToken()}`,
    },
  });
};

const deleteUserByIdApi = (uid) => {
  const body = {
    uid,
  };
  const config = {
    headers: { authorization: `Bearer ${getToken()}` },
  };
  return axios.post(`${baseURL}/nextrend/user/delete`, body, config);
};
const verifyUserIdApi = (userId, id) => {
  const body = {
    userId,
    id,
  };
  const config = {
    headers: { authorization: `Bearer ${getToken()}` },
  };
  return axios.post(`${baseURL}/nextrend/user/verify`, body, config);
};

const addUserApi = (formData) => {
  return axios.post(`${baseURL}/nextrend/user/add`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      authorization: `Bearer ${getToken()}`,
    },
  });
};

const restrictUserApi = (uid, restrict) => {
  const body = {
    uid,
    restrict,
  };
  const config = {
    headers: { authorization: `Bearer ${getToken()}` },
  };
  return axios.post(`${baseURL}/nextrend/user/restrict`, body, config);
};

/* 카테고리 관리 */

/* 카테고리 데이터 받아오기 */
const categoryListFetchApi = (type, length, code = null) => {
  let config = {
    headers: { authorization: `Bearer ${getToken()}` },
    params: {
      type,
      length,
      code,
    },
  };
  return axios.get(`${baseURL}/nextrend/cat`, config);
};
/* 카테고리 추가하기 */
const categoryItemAddApi = (type, length, ct_nm, code = null) => {
  const body = {
    type,
    length,
    ct_nm,
    code,
  };
  const config = {
    headers: { authorization: `Bearer ${getToken()}` },
  };
  return axios.post(`${baseURL}/nextrend/cat`, body, config);
};
/* 카테고리 수정하기 */
const categoryItemEditApi = (type, code, ct_nm) => {
  let body = {
    type,
    code,
    ct_nm,
  };
  const config = {
    headers: { authorization: `Bearer ${getToken()}` },
  };
  return axios.put(`${baseURL}/nextrend/cat`, body, config);
};
/* 카테고리 삭제하기 */
const categoryItemDeleteApi = (type, code) => {
  const config = {
    headers: headers,
    params: {
      type,
      code,
    },
  };
  return axios.delete(`${baseURL}/nextrend/cat`, config);
};

/* 사용자 맞춤형 메뉴 관련 api */

/* 특정 카테고리의 하위 카테고리 목록을 받아오는 기능을 함. */
const axisMenuPreviewFetchApi = (cid) => {
  const config = {
    headers: headers,
    params: { cid },
  };
  return axios.get(`${baseURL}/nextrend/custom/test`, config);
};
/* uid에 해당하는 유저의 설정된 x축, y축 의 하위 메뉴 정보를 받아옴. (사용자화면 출력용?? ) */
const userAxisMenuFetchApi = (uid) => {
  let config = {
    headers: { authorization: `Bearer ${getToken()}` },
    params: { uid },
  };
  return axios.get(`${baseURL}/nextrend/custom/load`, config);
};
/* uid에 해당하는 유저의 메뉴 세팅 정보를 받아옴.*/
const userAxisMenuSettingFetchApi = (uid) => {
  let config = {
    headers: { authorization: `Bearer ${getToken()}` },
    params: { uid },
  };
  return axios.get(`${baseURL}/nextrend/custom`, config);
};
const userAxisMenuSaveApi = (axisSetObj, saveType) => {
  const config = {
    headers: { authorization: `Bearer ${getToken()}` },
  };
  if (saveType === "create") {
    return axios.post(`${baseURL}/nextrend/custom`, axisSetObj, config);
  }
  if (saveType === "update") {
    return axios.put(`${baseURL}/nextrend/custom`, axisSetObj, config);
  }
};

//data와 method 형태로 변경..
const MultilingualDictionaryApi = (data = null, method) => {
  const config = {
    headers: { authorization: `Bearer ${getToken()}` },
  };
  if (method === "GET") {
    const config = {
      headers: { authorization: `Bearer ${getToken()}` },
    };
    return axios.get(`${baseURL}/nextrend/multilingual`, config);
  }
  if (method === "POST") {
    if ("multi_text" in data) {
      return axios.post(`${baseURL}/nextrend/multilingual`, data, config);
    }
    if ("list" in data) {
      return axios.post(
        `${baseURL}/nextrend/multilingual/upload`,
        data,
        config
      );
    }
  }
  if (method === "PUT") {
    return axios.put(`${baseURL}/nextrend/multilingual`, data, config);
  }
  if (method === "DELETE") {
    const config2 = {
      headers: { authorization: `Bearer ${getToken()}` },
      params: {
        ...data,
      },
    };
    return axios.delete(`${baseURL}/nextrend/multilingual`, config2);
  }
};

const HostManagementApi = (data = null, method) => {
  const config = {
    headers: { authorization: `Bearer ${getToken()}` },
  };
  if (method === "GET") {
    if (data !== null) {
      // 검색 쿼리가 있다면?
      config["params"] = { ...data };
    }
    return axios.get(`${baseURL}/nextrend/host`, config);
  }
  if (method === "POST") {
    return axios.post(`${baseURL}/nextrend/host`, data, config);
  }
};
const HostTestApi = (data = null, method) => {
  const config = {
    headers: { authorization: `Bearer ${getToken()}` },
  };
  if (method === "GET") {
    return axios.get(`${baseURL}/nextrend/host/test`, config);
  }
  if (method === "POST") {
    return axios.post(`${baseURL}/nextrend/host/test`, data, config);
  }
};

const curationRequestApi = (_id) => {
  const body = {
    statusCode: 6,
    _id,
    requested: true,
    docs: {},
  };
  const config = {
    headers: { authorization: `Bearer ${getToken()}` },
  };
  return axios.post(`${baseURL}/crawl/detail/${_id}`, body, config);
};

const crawlHostDataFetchApi = (host_id = null) => {
  const config = {
    headers: { authorization: `Bearer ${getToken()}` },
  };
  const router = host_id
    ? `${baseURL}/crawl/host/${host_id}`
    : `${baseURL}/crawl/host`;

  return axios.get(router, config);
};

const crawlSumDataFetchApi = () => {
  return axios.get(`${baseURL}/crawl/sum`, { headers: { headers } });
};
const userWorkLogFetchApi = (dataObj) => {
  const config = {
    headers: { headers },
    params: { ...dataObj },
  };
  return axios.get(`${baseURL}/nextrend/board/work`, config);
};
const curationWorkListFetchApi = (dataObj) => {
  const config = {
    headers: { headers },
    params: { ...dataObj },
  };
  return axios.get(`${baseURL}/nextrend/board/curation`, config);
};

const countryWorkListFetchApi = (process) => {
  const config = {
    headers: { headers },
    params: { status: process },
  };
  return axios.get(`${baseURL}/nextrend/board`, config);
};

const workAllLogFetchApi = (process) => {
  return axios.get(`${baseURL}/nextrend/board/all`, { headers: { headers } });
};

const hostSyncApi = () => {
  const config = {
    headers: { authorization: `Bearer ${getToken()}` },
  };
  return axios.put(`${baseURL}/nextrend/host/sync/ `, config);
};

export {
  LoginApi,
  RefreshTokenApi,
  CrawlDataListFetchApi,
  CrawlDataDetailFetchApi,
  CrawlDataRejectApi,
  CrawlDataStageApi,
  CrawlDataKeepApi,
  ScreeningDataDeleteApi,
  ScreeningDataKeepApi,
  ScreeningDataStageApi,
  ScreeningDataFetchApi,
  ContinentsListDataFetchApi,
  CountrysListDataFetchApi,
  FetchUsersApi,
  getUserInfoApi,
  modifyUserInfoApi,
  deleteUserByIdApi,
  addUserApi,
  CategorysListDataFetchApi,
  CategoryOptionFetchApi,
  userAuthApi,
  sessionHandler,
  documentPastedImageApi,
  documentDetachImageApi,
  uploadExcelDataApi,
  restrictUserApi,
  verifyUserIdApi,
  categoryListFetchApi,
  categoryItemAddApi,
  categoryItemDeleteApi,
  categoryItemEditApi,
  axisMenuPreviewFetchApi,
  userAxisMenuFetchApi,
  userAxisMenuSettingFetchApi,
  userAxisMenuSaveApi,
  MultilingualDictionaryApi,
  HostManagementApi,
  HostTestApi,
  userCustomCurationDataFetchApi,
  curationRequestApi,
  crawlHostDataFetchApi,
  crawlSumDataFetchApi,
  userWorkLogFetchApi,
  curationWorkListFetchApi,
  countryWorkListFetchApi,
  workAllLogFetchApi,
  hostSyncApi,
  getUserLogoApi,
};
