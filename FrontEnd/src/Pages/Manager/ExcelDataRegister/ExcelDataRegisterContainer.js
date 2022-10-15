import React, { useEffect, useState } from "react";
import ExcelDataRegister from "./ExcelDataRegister";
import XLSX from "xlsx";
import { uploadExcelDataApi, categoryListFetchApi } from "../../../Utils/api";
import resolve from "resolve";

function ExcelDataRegisterContainer() {
  const [excelData, setExcelData] = useState([]);
  const [pdfData, setPdfData] = useState([]);
  const [pdfMetaData, setPdfMetaData] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);
  const [thumbnailMetaData, setThumbnailMetaData] = useState([]);
  const [step, setStep] = useState(1);

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
    const _pdfData = [];
    const _pdfMetaData = [];
    for (const file of files) {
      const available = excelData.filter(
        (item) => item.pdf_file_name === file.name.replace(/(.pdf)$/, "")
      );
      const _obj = {
        size: getfileSize(file.size),
        name: file.name.replace(/(.pdf)$/, ""),
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
        (item) =>
          item.thumbnail_file_name ===
          image.name.replace(/(.png|.jpg|.jpeg|.gif)$/, "")
      );

      const _obj = {
        size: getfileSize(image.size),
        name: image.name.replace(/(.png|.jpg|.jpeg|.gif)$/, ""),
        available,
      };
      _thumbnails.push(image);
      _thumbnailMetaData.push(_obj);
    }
    setThumbnails(_thumbnails);
    setThumbnailMetaData(_thumbnailMetaData);
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
    let input = e.target;
    let reader = new FileReader();
    reader.onload = function () {
      let data = reader.result;
      const excelFile = XLSX.read(data, {
        type: "binary",
        cellDates: true,
      });
      const sheetName = excelFile.SheetNames[0];
      const firstSheet = excelFile.Sheets[sheetName];

      console.log(firstSheet);
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
      console.log(_exelData);
      setExcelData(_exelData);
    };
    reader.readAsBinaryString(input.files[0]);
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
    pdfData.forEach((pdf) => {
      files.append("files", pdf);
    });
    thumbnails.forEach((thumbnaiil) => files.append("thumbnails", thumbnaiil));
    files.append("meta", JSON.stringify(excelData));
    console.log(excelData);
    uploadExcelDataApi(files).then((res) => {
      console.log(res);
    });
  };
  const nextStep = () => {
    if (step === 1 && excelData.length === 0) {
      alert("엑셀 데이터 등록 해주세요.");
      return;
    }
    if (step === 2 && pdfData.length === 0) {
      alert("PDF 파일을 등록 해주세요.");
      return;
    }
    if (step === 5) {
      upload();
      return;
    }
    setStep((prev) => prev + 1);
  };
  const prevStep = () => {
    if (step === 1) {
      return;
    }
    setStep((prev) => prev - 1);
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
        setExcelData={setExcelData}
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
      />
    </>
  );
}
export default ExcelDataRegisterContainer;

const dateToDashStyle = (target) => {
  if (!target) return null;
};
