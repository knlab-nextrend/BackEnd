import { _axios } from "services/axiosService";
import { HTTP_METHOD } from ".";

export const crawlDataUpdate = async (data) => {
  return _axios({
    url: "/file/uploadExcelData",
    method: HTTP_METHOD.POST,
    data,
  });
};

export const AddThumbnails = async (docId, statusCode, files) => {
  return _axios({
    headers: { "Content-Type": "multipart/form-data" },
    url: `/crawl/thumbnail/${docId}`,
    method: HTTP_METHOD.POST,
    params: { statusCode },
    data: files,
  });
};

export const DeleteThumbnails = async (docId, statusCode, indexes) => {
  return _axios({
    url: `/crawl/thumbnail/${docId}`,
    method: HTTP_METHOD.DELETE,
    params: { statusCode },
    data: {
      deleteIndexes: indexes,
    },
  });
};
