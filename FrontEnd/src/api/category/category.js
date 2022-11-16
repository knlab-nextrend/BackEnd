import axios from "axios";
import { getToken } from "../../Utils/tokens";

export const getCategryListAPI = (code = null) => {
  let config = {
    headers: { authorization: `Bearer ${getToken()}` },
    params: { type: code },
  };
  return axios.get(`/nextrend/cat/list`, config);
};
