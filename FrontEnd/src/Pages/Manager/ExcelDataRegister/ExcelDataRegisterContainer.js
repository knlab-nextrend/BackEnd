import React, { useEffect, useState } from "react";
import ExcelDataRegister from "./ExcelDataRegister";
import XLSX from "xlsx";
import { uploadExcelDataApi, categoryListFetchApi } from "../../../Utils/api";
import resolve from "resolve";
import { useHistory } from "react-router-dom";
import { uploadExcel } from "services/api/excel";

function ExcelDataRegisterContainer() {
  const [excelData, setExcelData] = useState([]);
  const [pdfData, setPdfData] = useState([]);
  const [pdfMetaData, setPdfMetaData] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);
  const [thumbnailMetaData, setThumbnailMetaData] = useState([]);
  const [errorList, setErrorList] = useState([]);
  const [step, setStep] = useState(1);

  const history = useHistory();

  function getfileSize(x) {
    var s = ["bytes", "KB", "MB", "GB", "TB", "PB"];
    var e = Math.floor(Math.log(x) / Math.log(1024));
    return (x / Math.pow(1024, e)).toFixed(2) + " " + s[e];
  }

  const deletePdf = (name) => {
    if (confirm("해당 PDF파일을 목록에서 제거하시겠습니까?")) {
      const _newPdfData = pdfData.filter((file) => file.name !== name);
      const _newPdfMetaData = pdfMetaData.filter((file) => file.name !== name);
      setPdfData(_newPdfData);
      setPdfMetaData(_newPdfMetaData);
    }
  };

  const readPdf = (e) => {
    const files = e.target.files;
    console.log(files);
    const _pdfData = [];
    const _pdfMetaData = [];
    for (const file of files) {
      const available = excelData.some(
        (item) => item.pdf_file_name === file.name.normalize("NFC")
      );
      const _obj = {
        size: getfileSize(file.size),
        name: file.name,
        available,
      };
      _pdfData.push(file);
      _pdfMetaData.push(_obj);
    }

    setPdfData(_pdfData);
    setPdfMetaData(_pdfMetaData);
  };

  const readImage = (e) => {
    const images = e.target.files;
    const _thumbnails = [];
    const _thumbnailMetaData = [];
    for (const image of images) {
      const available = excelData.some(
        (item) => item.thumbnail_file_name === image.name.normalize("NFC")
      );
      const _obj = {
        size: getfileSize(image.size),
        name: image.name,
        available,
      };
      _thumbnails.push(image);
      _thumbnailMetaData.push(_obj);
    }
    setThumbnails(_thumbnails);
    setThumbnailMetaData(_thumbnailMetaData);
    console.log(thumbnailMetaData);
  };

  const deleteImage = (name) => {
    if (confirm("해당 이미지 파일을 목록에서 제거하시겠습니까?")) {
      const _newThumbnails = thumbnails.filter(
        (thumbnail) => thumbnail.name !== name
      );
      const _newThumbnailMetaData = thumbnailMetaData.filter(
        (thumbnailmeta) => thumbnailmeta.name !== name
      );
      setThumbnails(_newThumbnails);
      setThumbnailMetaData(_newThumbnailMetaData);
    }
  };

  const readExcel = (e) => {
    setErrorList([]);
    let input = e.target;
    let reader = new FileReader();
    reader.onload = function () {
      let data = reader.result;
      const firstSheet = getFirstSheet(data);
      const copySheetForCheck = { ...firstSheet };
      if (!checkCorrectFormat(copySheetForCheck)) {
        alert("잘못된 엑셀 양식입니다.");
        window.location.reload();
        return;
      }
      const cells = parseHeaderAndRow(copySheetForCheck);
      const errList = checkErrorFields(cells);
      setErrorList(errList);
      const jsonData = XLSX.utils.sheet_to_json(firstSheet, {
        defval: null,
      });

      const _exelData = jsonData.map((item) => {
        return {
          ...item,
          is_crawled: false,
          status: 6, //아카이브
          doc_content_type: item["doc_content_type"]
            ? item["doc_content_type"].split(", ")
            : null,
          doc_content_category: item["doc_content_category"]
            ? item["doc_content_category"].split(", ")
            : null,
          doc_language: item["doc_language"]
            ? item["doc_language"].split(", ")
            : null,
          doc_publish_country: item["doc_publish_country"]
            ? item["doc_publish_country"].split(", ")
            : null,
          doc_country: item["doc_country"]
            ? item["doc_country"].split(", ")
            : null,
          doc_keyowrd: item["doc_keyowrd"]
            ? item["doc_keyowrd"].split(", ")
            : null,
          doc_category: item["doc_category"]
            ? item["doc_category"].replaceAll('"', "").split(", ") //쌍따옴표제거
            : null,
          doc_topic: item["doc_topic"] ? item["doc_topic"].split(", ") : null,
          doc_custom: item["doc_custom"]
            ? item["doc_custom"].split(", ")
            : null,
        };
      });
      setExcelData(_exelData);
    };
    reader.readAsBinaryString(input.files[0]);
  };

  const deleteExcelData = () => {
    setExcelData([]);
    setErrorList([]);
  };

  const regiExcel = () => {
    if (excelData.length === 0) {
      alert("등록할 데이터가 없습니다.");
    } else {
      alert("성공적으로 엑셀 데이터가 로딩되었습니다.");
    }
  };
  const upload = () => {
    const files = new FormData();
    pdfData.forEach((pdf) => files.append("pdfs", pdf));
    thumbnails.forEach((thumbnaiil) => files.append("thumbnails", thumbnaiil));
    files.append("meta", JSON.stringify(excelData));
    console.log(excelData);
    uploadExcel(files)
      .then((res) => {
        console.log(res);
        alert("엑셀 데이터 업로드에 성공했습니다");
        history.push("/curation");
      })
      .catch((err) => {
        console.error(err);
        alert("엑셀 데이터 업로드에 실패했습니다");
        window.location.reload();
      });
    // uploadExcelDataApi(files)
    //   .then((res) => {
    //     console.log(res);
    //     history.push("/curation");
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //     alert("엑셀 데이터 업로드에 실패했습니다");
    //     window.location.reload();
    //   });
  };
  const toNextStep = {
    1: () => {
      if (errorList.length > 0) {
        alert("잘못된 셀을 수정 후 다시 업로드 해주세요");
      } else if (excelData.length === 0) {
        alert("엑셀 데이터를 등록해주세요");
      } else {
        setStep((prev) => prev + 1);
      }
    },
    2: () => {
      if (pdfData.length === 0) {
        setStep((prev) => prev + 2);
      } else {
        setStep((prev) => prev + 1);
      }
    },
    3: () => {
      if (pdfMetaData.some((data) => !data.available)) {
        alert("등록 불가능한 파일을 제거해주세요");
      } else {
        setStep((prev) => prev + 1);
      }
    },
    4: () => {
      if (thumbnails.length === 0) {
        setStep((prev) => prev + 2);
      } else {
        setStep((prev) => prev + 1);
      }
    },
    5: () => {
      if (thumbnailMetaData.some((data) => !data.available)) {
        alert("등록 불가능한 파일을 제거해주세요");
      } else {
        setStep((prev) => prev + 1);
      }
    },
    6: () => {
      upload();
    },
  };

  const nextStep = () => {
    toNextStep[step]();
  };

  const prevStep = () => {
    if (step === 1) {
      return;
    }
    if (
      (step === 4 && pdfData.length === 0) ||
      (step === 6 && thumbnails.length === 0)
    ) {
      setStep((prev) => prev - 2);
    } else setStep((prev) => prev - 1);
  };

  const findCategoryCode = async (카테고리타입, 분류리스트) => {
    let 대분류UpperCode = 0;
    let 중분류UpperCode = 0;
    let 소분류Code = 0;
    if (!분류리스트[0]) {
      // 대분류값을 엑셀에 입력하지 않음
      console.log("대분류 입력 값이 없습니다");
      return null;
    } else {
      // 대분류 값을 엑셀에 입력 하였음
      let 대분류 = await categoryListFetchApi(카테고리타입, 2);
      let 대분류검색결과 = 대분류.data.find((item) => {
        return item.CT_NM === 분류리스트[0];
      });
      // console.log(대분류검색결과)
      if (대분류검색결과) {
        // 검색 결과 대분류가 존재 한다면?
        대분류UpperCode = 대분류검색결과.CODE;
        //console.log(대분류UpperCode);

        if (!분류리스트[1]) {
          // 중분류 값을 엑셀에 입력하지 않음
          console.log("중분류 입력 값이 없습니다");
          return 대분류UpperCode;
        } else {
          let 중분류 = await categoryListFetchApi(
            카테고리타입,
            4,
            대분류UpperCode
          );
          let 중분류검색결과 = 중분류.data.find((item) => {
            return item.CT_NM === 분류리스트[1];
          });
          //console.log(중분류검색결과)
          if (중분류검색결과) {
            // 검색 결과 대분류가 존재 한다면?
            중분류UpperCode = 중분류검색결과.CODE;
            //console.log(중분류UpperCode);

            if (!분류리스트[2]) {
              console.log("소분류 입력 값이 없습니다");
              return 중분류UpperCode;
            } else {
              let 소분류 = await categoryListFetchApi(
                카테고리타입,
                6,
                중분류UpperCode
              );
              let 소분류검색결과 = 소분류.data.find((item) => {
                return item.CT_NM === 분류리스트[2];
              });
              if (소분류검색결과) {
                소분류Code = 소분류검색결과.CODE;
                //console.log(소분류Code);
                return 소분류Code;
              } else {
                console.log("등록되지 않은 소분류 입니다.");
                return 중분류UpperCode;
              }
            }
          } else {
            console.log("등록되지 않은 중분류 입니다.");
            return 대분류UpperCode;
          }
        }
      } else {
        // 등록되지 않은 대분류 라면
        console.log("등록되지 않은 대분류 입니다");
        resolve(null);
      }
    }
  };

  useEffect(() => {
    const str = "기획재정-경제일반-그결과는/국정일반-없는중분류/외교안보";
    const arr1 = str.split("/");
  }, []);
  return (
    <>
      <ExcelDataRegister
        readPdf={readPdf}
        deleteExcelData={deleteExcelData}
        readExcel={readExcel}
        regiExcel={regiExcel}
        nextStep={nextStep}
        prevStep={prevStep}
        step={step}
        pdfMetaData={pdfMetaData}
        deletePdf={deletePdf}
        excelData={excelData}
        pdfData={pdfData}
        readImage={readImage}
        deleteImage={deleteImage}
        imageMetaData={thumbnailMetaData}
        errorList={errorList}
      />
    </>
  );
}
export default ExcelDataRegisterContainer;

// SheetJS 라이브러리용
const CELL_OBJECT_TYPE = {
  n: "number",
  s: "string",
  b: "boolean",
  d: "date",
};

const DATA_TYPE = {
  NUMBER: "number",
  STRING: "string",
  DATE: "date",
  BOOLEAN: "boolean",
};

const EXCEL_SCHEMA = {
  // pdf 있으면 필요함
  dc_domain: {
    isRequired: false,
    type: DATA_TYPE.STRING,
  },
  doc_biblio: {
    isRequired: false,
    type: DATA_TYPE.STRING,
  },
  doc_bundle_title: {
    isRequired: false,
    type: DATA_TYPE.STRING,
  },
  doc_bundle_url: {
    isRequired: false,
    type: DATA_TYPE.STRING,
  },
  doc_category: {
    // 카테고리 받아와야함
    isRequired: false,
    type: DATA_TYPE.STRING,
  },
  doc_collect_date: {
    isRequired: false,
    type: DATA_TYPE.DATE,
  },
  doc_content: {
    isRequired: false,
    type: DATA_TYPE.STRING,
  },
  doc_content_category: {
    // 카테고리 받아와야함
    isRequired: false,
    type: DATA_TYPE.STRING,
  },
  doc_content_type: {
    // 카테고리 받아오기
    isRequired: false,
    type: DATA_TYPE.STRING,
  },
  doc_country: {
    // 국가 받아오기
    isRequired: false,
    type: DATA_TYPE.STRING,
  },
  doc_custom: {
    isRequired: false,
    type: DATA_TYPE.STRING,
  },
  doc_language: {
    isRequired: false,
    type: DATA_TYPE.STRING,
  },
  doc_keyword: {
    isRequired: false,
    type: DATA_TYPE.STRING,
  },
  doc_kor_summary: {
    isRequired: false,
    type: DATA_TYPE.STRING,
  },
  doc_kor_title: {
    isRequired: false,
    type: DATA_TYPE.STRING,
  },
  doc_memo: {
    isRequired: false,
    type: DATA_TYPE.STRING,
  },
  doc_modify_date: {
    isRequired: false,
    type: DATA_TYPE.DATE,
  },
  doc_origin_title: {
    isRequired: false,
    type: DATA_TYPE.STRING,
  },
  doc_original_summary: {
    isRequired: false,
    type: DATA_TYPE.STRING,
  },
  //pdf 있으면 필요함
  doc_page: {
    isRequired: false,
    type: DATA_TYPE.NUMBER,
  },
  doc_poject: {
    isRequired: false,
    type: DATA_TYPE.STRING,
  },
  doc_publish_country: {
    //  받아오기
    isRequired: false,
    type: DATA_TYPE.STRING,
  },
  doc_publish_date: {
    isRequired: false,
    type: DATA_TYPE.DATE,
  },
  doc_publisher: {
    isRequired: false,
    type: DATA_TYPE.STRING,
  },
  doc_publishing: {
    isRequired: false,
    type: DATA_TYPE.STRING,
  },
  doc_recomment: {
    isRequired: false,
    type: DATA_TYPE.STRING,
  },
  doc_register_date: {
    isRequired: false,
    type: DATA_TYPE.DATE,
  },
  doc_relate_title: {
    isRequired: false,
    type: DATA_TYPE.STRING,
  },
  doc_relate_url: {
    isRequired: false,
    type: DATA_TYPE.STRING,
  },

  doc_topic: {
    // 받아오기
    isRequired: false,
    type: DATA_TYPE.STRING,
  },
  doc_url: {
    isRequired: false,
    type: DATA_TYPE.STRING,
  },
  doc_url_intro: {
    isRequired: false,
    type: DATA_TYPE.STRING,
  },
  doc_write_date: {
    isRequired: false,
    type: DATA_TYPE.DATE,
  },

  pdf_file_name: {
    isRequired: false,
    type: DATA_TYPE.STRING,
    validate: (v) => {
      const result = {};
      result.isValid = v.split(".").pop() === "pdf";
      if (!result.isValid)
        result.message = "확장자까지 올바르게 입력되어야합니다.";
      return result;
    },
  },

  thumbnail_file_name: {
    isRequired: false,
    type: DATA_TYPE.STRING,
    validate: (fileName) => {
      const result = {};
      result.isValid = ["jpeg,", "jpg", "gif", "png"].some(
        (v) => v === fileName.split(".").pop()
      );
      if (!result.isValid)
        result.message = "확장자까지 올바르게 입력되어야합니다.";
      return result;
    },
  },

  /// 사용자 입력 필요없는 필드
  // doc_file: {
  //   isRequired: false,
  //   type: DATA_TYPE.STRING,
  // },
  // doc_hit: {
  //   isRequired: false,
  //   type: DATA_TYPE.NUMBER,
  // },
  // doc_host: {
  //   isRequired: false,
  //   type: DATA_TYPE.STRING,
  // },
  // status: {
  //   isRequired: false,
  //   type: DATA_TYPE.NUMBER,
  // },
  // item_id: {
  //   isRequired: false,
  //   type: DATA_TYPE.NUMBER,
  // },
  // is_crawled: {
  //   isRequired: false,
  //   type: DATA_TYPE.BOOLEAN,
  // },
  // doc_thumbnail: {
  //   isRequired: false,
  //   type: DATA_TYPE.STRING,
  // },
};

/**
 *
 * @param {XLSX.WorkSheet} sheet
 */
const removeUnusedFiled = (sheet) => {
  delete sheet["!margins"];
  delete sheet["!ref"];
};

/**
 *
 * @param {string | ArrayBuffer | null} data
 * FileReader로 읽은 result
 */
const getFirstSheet = (data) => {
  const excelFile = XLSX.read(data, {
    type: "binary",
    cellDates: true,
  });
  const sheetName = excelFile.SheetNames[0];
  const firstSheet = excelFile.Sheets[sheetName];
  return firstSheet;
};

/**
 *
 * @param {XLSX.WorkSheet} sheet
 */
const parseHeaderAndRow = (sheet) => {
  removeUnusedFiled(sheet);
  const cells = { headers: {}, rows: {} };
  const columnRegex = /[^A-Z]/g;
  const rowRegex = /[^0-9]/g;
  for (let cellName in sheet) {
    const column = cellName.replace(columnRegex, "");
    const row = parseInt(cellName.replace(rowRegex, ""));

    if (row === 1) {
      const headerName = sheet[cellName].v;
      cells.headers[column] = {
        value: headerName,
        type: EXCEL_SCHEMA[headerName].type,
        isRequired: EXCEL_SCHEMA[headerName].isRequired,
      };
    } else {
      if (!cells.rows.hasOwnProperty(row)) cells.rows[row] = [];
      cells.rows[row].push({
        column,
        row,
        value: sheet[cellName].v,
        type: CELL_OBJECT_TYPE[sheet[cellName].t],
      });
    }
  }
  return cells;
};

/**
 *
 * @param {XLSX.WorkSheet} sheet
 */
const checkCorrectFormat = (sheet) => {
  const rowRegex = /[^0-9]/g;
  const headerCellNames = Object.keys(sheet)
    .filter((cellName) => cellName.replace(rowRegex, "") === "1")
    .map((cellName) => sheet[cellName].v)
    .sort();

  const schemaNames = Object.keys(EXCEL_SCHEMA).sort();
  if (
    headerCellNames.length !== schemaNames.length ||
    headerCellNames.some((v, i) => v !== schemaNames[i])
  ) {
    return false;
  }
  return true;
};

/**
 *
 * @param {{headers: {}, rows: {}} data
 *
 */
const checkErrorFields = (data) => {
  const errorList = [];
  const requiredFieldNames = Object.keys(EXCEL_SCHEMA).filter(
    (key) => EXCEL_SCHEMA[key].isRequired
  );

  Object.values(data.rows).forEach((row) => {
    //필수 필드가 채워졌는지 확인
    requiredFieldNames.forEach((fieldName) => {
      if (
        !Object.values(row)
          .map((field) => data.headers[field.column].value)
          .includes(fieldName)
      ) {
        const columnName = Object.keys(data.headers).find(
          (key) => data.headers[key].value === fieldName
        );
        const rowNumber = row[0].row;
        errorList.push({
          cellInfo: `${columnName} - ${rowNumber}`,
          message: `${fieldName}은 필수 필드입니다.`,
        });
      }
    });

    //입력된 필드의 타입이 맞는지 확인
    Object.values(row).forEach((field) => {
      if (data.headers[field.column].type !== field.type)
        errorList.push({
          cellInfo: `${field.column} - ${field.row}`,
          message: `${data.headers[field.column].type} 타입으로 입력해주세요`,
        });
    });

    //validate 로직이 있는 필드 체크
    Object.values(row).forEach((field) => {
      if (
        EXCEL_SCHEMA[data.headers[field.column].value].hasOwnProperty(
          "validate"
        )
      ) {
        const { isValid, message } = EXCEL_SCHEMA[
          data.headers[field.column].value
        ].validate(field.value);
        if (!isValid) {
          errorList.push({
            cellInfo: `${field.column} - ${field.row}`,
            message,
          });
        }
      }
    });
  });

  return errorList;
};
