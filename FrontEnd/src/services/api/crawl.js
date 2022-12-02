import { _axios } from "services/axiosService";
import { HTTP_METHOD } from ".";

export const crawlDataUpdate = async (data) => {
  return _axios({
    url: "/file/uploadExcelData",
    method: HTTP_METHOD.POST,
    data,
  });
};
