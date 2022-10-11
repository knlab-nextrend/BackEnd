import React, { useEffect, useState } from "react";
import ExcelDataRegister from "./ExcelDataRegister";
import XLSX from "xlsx";
import { uploadExcelDataApi, categoryListFetchApi } from "../../../Utils/api";
import resolve from "resolve";

function ExcelDataRegisterContainer() {
  const [excelData, setExcelData] = useState([]);
  const [pdfData, setPdfData] = useState([]);
  const [pdfMetaData, setPdfMetaData] = useState([]);
  const [step, setStep] = useState(1);

  function getfileSize(x) {
    var s = ["bytes", "kB", "MB", "GB", "TB", "PB"];
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
        (data) => data.pdf === file.name.replace(/(.pdf)$/, "")
      );
      const _obj = {
        size: getfileSize(file.size),
        name: file.name.replace(/(.pdf)$/, ""),
        available: available.length !== 0,
      };
      _pdfData.push(file);
      _pdfMetaData.push(_obj);
    }

    setPdfData(_pdfData);
    setPdfMetaData(_pdfMetaData);
  };
  const readExcel = (e) => {
    
    let input = e.target;
    let reader = new FileReader();
    reader.onload = function () {
      let data = reader.result;
      let _excelData = [];
      const excelFile = XLSX.read(data, { type: "binary" });
      const sheetName = excelFile.SheetNames[0];
      const firstSheet = excelFile.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet, { defval: "" });

      jsonData.map((item) => {
        
        _excelData.push({
          item_id: item["1"] === "" ? null : item["1"],
          is_crawled: item["2"] === "" ? null : item["2"],
          status: item["3"] === "" ? null : item["3"],
          doc_thumbnail: item["4"] === "" ? null : item["4"],
          doc_file: item["5"] === "" ? null : item["5"],
          doc_origin_title: item["6"] === "" ? null : item["6"],
          doc_kor_title: item["7"] === "" ? null : item["7"],
          doc_kor_summary: item["8"] === "" ? null : item["8"],
          doc_publish_date:
            item["9"] === ""
              ? null
              : item["9"]
                  .split(".")
                  .filter((item) => item !== "")
                  .join("-"), // 날짜형식 수정
          doc_write_date:
            item["10"] === ""
              ? null
              : item["10"]
                  .split(".")
                  .filter((item) => item !== "")
                  .join("-"),
          doc_collect_date:
            item["11"] === ""
              ? null
              : item["11"]
                  .split(".")
                  .filter((item) => item !== "")
                  .join("-"),
          doc_url: item["12"] === "" ? null : item["12"],
          doc_url_intro: item["13"] === "" ? null : item["13"],
          doc_bundle_title: item["14"] === "" ? null : item["14"],
          doc_bundle_url: item["15"] === "" ? null : item["15"],
          doc_relate_title: item["16"] === "" ? null : item["16"],
          doc_relate_url: item["17"] === "" ? null : item["17"],
          doc_publisher: item["18"] === "" ? null : item["18"],
          doc_page: item["19"] === "" ? null : item["19"],
          doc_biblio: item["20"] === "" ? null : item["20"],
          doc_content_type: item["21"] === "" ? null : item["21"].split(", "),
          doc_content_category:
            item["22"] === "" ? null : item["22"].split(", "),
          doc_language: item["23"] === "" ? null : item["23"].split(", "),
          doc_publish_country:
            item["24"] === "" ? null : item["24"].split(", "),
          doc_country: item["25"] === "" ? null : item["25"].split(", "),
          doc_keyowrd: item["26"] === "" ? null : item["26"].split(", "),
          doc_content: item["27"] === "" ? null : item["27"],
          doc_hit: item["28"] === "" ? null : item["28"],
          doc_host: item["29"] === "" ? null : item["29"],
          doc_register_date:
            item["30"] === ""
              ? null
              : item["30"]
                  .split(".")
                  .filter((item) => item !== "")
                  .join("-"),
          doc_modify_date:
            item["31"] === ""
              ? null
              : item["31"]
                  .split(".")
                  .filter((item) => item !== "")
                  .join("-"),
          doc_origin_summary: item["32"] === "" ? null : item["32"],
          doc_category:
            item["33"] === ""
              ? null
              : item["33"].replaceAll('"', "").split(", "), // 쌍따옴표 제거
          doc_topic: item["34"] === "" ? null : item["34"].split(", "),
          doc_project: item["35"] === "" ? null : item["35"],
          doc_custom: item["36"] === "" ? null : item["36"].split(", "),
          doc_publishing: item["37"] === "" ? null : item["37"],
          doc_recomment: item["38"] === "" ? null : item["38"],
          doc_memo: item["39"] === "" ? null : item["39"],
          pdf: item["pdf"] === "" ? null : item["pdf"],
        });
      });
      setExcelData(_excelData);
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
    files.append("meta", JSON.stringify(excelData));
    uploadExcelDataApi(files).then((res) => {});
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
    if (step === 3) {
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

  const findCategoryCode = async (
    카테고리타입,
    분류리스트
  ) => {
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
              if(소분류검색결과){
                소분류Code = 소분류검색결과.CODE;
                //console.log(소분류Code);
                return 소분류Code
              }
              else{
                console.log("등록되지 않은 소분류 입니다.")
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

  useEffect( () => {
    const str = "기획재정-경제일반-그결과는/국정일반-없는중분류/외교안보";
    const arr1 = str.split("/")
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
      />
    </>
  );
}
export default ExcelDataRegisterContainer;
