import { _axios } from "services/axiosService";
import { HTTP_METHOD } from ".";

const customUrl = "nextrend/custom";

/**
 *
 * @param {{xaxis:number[],yaxis:number[],uid:number}} data
 * @returns
 */
export const setUserCustomMenu = async (data) => {
  return _axios({
    url: `${customUrl}`,
    method: HTTP_METHOD.POST,
    data,
  });
};

export const removeUserCustomMenu = async (data) => {
  return _axios({
    url: `${customUrl}`,
    method: HTTP_METHOD.DELETE,
    data,
  });
};

//관리자 , 사용자 공동사용
export const getUserCustomMenuByUserId = async (uid) => {
  return _axios({
    url: `${customUrl}`,
    method: HTTP_METHOD.GET,
    params: { uid },
  });
};
