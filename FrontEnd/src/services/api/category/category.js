import axios from "axios";
import { _axios } from "services/axiosService";
import { getToken } from "Utils/tokens";
import { HTTP_METHOD } from "..";

export const getCategryListAPI = (code = null) => {
  return _axios({
    method: HTTP_METHOD.GET,
    url: `/nextrend/cat/list`,
    params: { type: code },
  });
};
