import { _axios } from "services/axiosService";
import { HTTP_METHOD } from ".";

export const uploadExcel = async (data) => {
  return _axios({
    url: "/file/uploadExcelData",
    method: HTTP_METHOD.POST,
    data,
  });
};
