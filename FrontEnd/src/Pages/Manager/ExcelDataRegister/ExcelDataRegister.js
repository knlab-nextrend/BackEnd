import React, { useState } from "react";
import styled from "styled-components";
import FormHeader from "../../../Components/FormHeader";
import { HiOutlineDocumentText } from "react-icons/hi";
import { FaCloudUploadAlt } from "react-icons/fa";
import {
  RiFileExcel2Line,
  RiDeleteBinLine,
  RiImageAddLine,
} from "react-icons/ri";
import {
  AiOutlineFilePdf,
  AiOutlineSearch,
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
} from "react-icons/ai";
import { WorkerContentHeader } from "Components/WorkerContentHeader";
import { BsTable } from "react-icons/bs";

function ExcelDataRegister({
  readExcel,
  nextStep,
  prevStep,
  step,
  deleteExcelData,
  readPdf,
  pdfMetaData,
  deletePdf,
  readImage,
  deleteImage,
  imageMetaData,
  excelData,
  errorList,
}) {
  const [excelFilename, setExcelFilename] = useState(null);
  const [pdfFilename, setPdfFilename] = useState(null);
  const [imageFileName, setImagefileName] = useState();
  const excelFileHandler = (e) => {
    setExcelFilename(e.target.files[0].name);
    readExcel(e);
  };
  const pdfFileHandler = (e) => {
    if (e.target.files.length === 1) {
      setPdfFilename(e.target.files[0].name);
    } else {
      setPdfFilename(
        `${e.target.files[0].name} 외 ${e.target.files.length - 1}건`
      );
    }

    readPdf(e);
  };

  const imageFileHandler = (e) => {
    if (e.target.files.length === 1) {
      setImagefileName(e.target.files[0].name);
    } else {
      setImagefileName(
        `${e.target.files[0].name} 외 ${e.target.files.length - 1}장`
      );
    }

    readImage(e);
  };

  const excelFileDelete = (e) => {
    setExcelFilename(null);
    deleteExcelData();
  };
  return (
    <Wrap>
      <WorkerContentHeader title="엑셀 데이터 등록" Icon={BsTable} />
      <Wrapper>
        {/* <----- 엑셀 등록 단계 -----> */}
        {step === 1 && (
          <UploadContainer>
            <HeaderContainer color="#217346">
              <div className="step">STEP 1</div>
              <div className="title">
                <FaCloudUploadAlt size="30" color="#fff" />
                <div className="bold">EXCEL</div>
                <div>파일 업로드</div>
              </div>
            </HeaderContainer>
            <BodyContainer>
              <RiFileExcel2Line size="100" color="#d6d6d6" />
              <div className="explain">
                <span className="emphasis">DB 제출용 포맷</span>
                <span>에 맞추어진 </span>
                <span className="emphasis">엑셀 파일</span>
                <span>을 업로드 후 다음 단계를 진행해주세요.</span>
              </div>
              <div className="upload">
                <div className="select-file">
                  <label htmlFor="excelFile">파일 선택</label>
                  <input
                    onChange={excelFileHandler}
                    type="file"
                    id="excelFile"
                    accept=".csv , .xls , .xlsx"
                  />
                  <span>{excelFilename || "엑셀 파일을 등록해주세요."}</span>
                </div>
                <button className="delete-button" onClick={excelFileDelete}>
                  삭제
                </button>
              </div>
              {errorList.length > 0 && (
                <ErrorListWrapper>
                  <h3>잘못된 입력 목록</h3>
                  <ErrorListHeader>
                    <div>셀번호</div>
                    <div>내용</div>
                  </ErrorListHeader>
                  {errorList.map((err, i) => (
                    <ErrorListRow key={i}>
                      <div>{err.cellInfo}</div>
                      <div>{err.message}</div>
                    </ErrorListRow>
                  ))}
                </ErrorListWrapper>
              )}
            </BodyContainer>
          </UploadContainer>
        )}
        {/* <----- pdf 등록 단계 -----> */}
        {step === 2 && (
          <UploadContainer>
            <HeaderContainer color="#c83636">
              <div className="step">STEP 2</div>
              <div className="title">
                <FaCloudUploadAlt size="30" color="#fff" />
                <div className="bold">PDF</div>
                <div>파일 업로드</div>
              </div>
            </HeaderContainer>
            <BodyContainer>
              <AiOutlineFilePdf size="100" color="#d6d6d6" />
              <div className="explain">
                <span className="emphasis">PDF파일</span>
                <span>을 업로드 해주세요.</span>
              </div>
              <div className="upload">
                <div className="select-file">
                  <label htmlFor="pdfFile">파일 선택</label>
                  <input
                    onChange={pdfFileHandler}
                    type="file"
                    id="pdfFile"
                    accept=".pdf"
                    multiple="multiple"
                  />
                  <span>{pdfFilename || "PDF 파일을 등록해주세요."}</span>
                </div>
                {/* <button className="upload-button">데이터 등록</button> */}
              </div>
            </BodyContainer>
          </UploadContainer>
        )}
        {/* <----- pdf 확인 단계 -----> */}
        {step === 3 && (
          <UploadContainer>
            <HeaderContainer color="#435269">
              <div className="step">STEP 3</div>
              <div className="title">
                <AiOutlineSearch size="30" color="#fff" />
                <div className="bold">PDF 및 EXCEL</div>
                <div>검토</div>
              </div>
            </HeaderContainer>
            <BodyContainer>
              <div className="explain">
                <span className="emphasis">EXCEL 파일</span>
                <span>과 </span>
                <span className="emphasis">PDF 파일</span>
                <span>
                  을 대조한 결과 입니다. 파일을 검토하여 적절하지 못한 파일은
                  삭제하여주세요. PDF가 등록된 문서만 등록됩니다.
                </span>
              </div>
              <FileList>
                {pdfMetaData.map((file, index) => {
                  return (
                    <FileCard>
                      <div className="file-container">
                        <HiOutlineDocumentText size="40" color="#d6d6d6" />
                        <div className="file-info">
                          <div>{file.name}</div>
                          <div>{file.size}</div>
                        </div>
                      </div>
                      {file.available ? (
                        <div className="file-availability">
                          <AiOutlineCheckCircle size="24" color="#6DAF44" />
                          <div>작업 가능</div>
                        </div>
                      ) : (
                        <div className="file-availability">
                          <AiOutlineCloseCircle size="20" color="#d0021b" />
                          <div>EXCEL과 매치 불가</div>
                        </div>
                      )}
                      <button
                        onClick={() => {
                          deletePdf(file.name);
                        }}
                        className="file-delete-button"
                      >
                        <RiDeleteBinLine color="#fff" size="20" />
                      </button>
                    </FileCard>
                  );
                })}
              </FileList>
            </BodyContainer>
          </UploadContainer>
        )}

        {/* <----- image 등록 단계 -----> */}
        {step === 4 && (
          <UploadContainer>
            <HeaderContainer color="#c83636">
              <div className="step">STEP 4</div>
              <div className="title">
                <FaCloudUploadAlt size="30" color="#fff" />
                <div className="bold">이미지</div>
                <div>파일 업로드</div>
              </div>
            </HeaderContainer>
            <BodyContainer>
              <RiImageAddLine size="100" color="#d6d6d6" />
              <div className="explain">
                <span className="emphasis">이미지 파일</span>
                <span>을 업로드 해주세요.</span>
              </div>
              <div className="more-explain">
                등록 가능한 확장자 : [ .jpg, .jpeg, .png, .gif ]
              </div>
              <div className="upload">
                <div className="select-file">
                  <label htmlFor="imageFile">파일 선택</label>
                  <input
                    onChange={imageFileHandler}
                    type="file"
                    id="imageFile"
                    accept=".jpeg, .jpg, .png, .gif"
                    multiple="multiple"
                  />
                  <span>{imageFileName || "이미지 파일을 등록해주세요."}</span>
                </div>
                {/* <button className="upload-button">데이터 등록</button> */}
              </div>
            </BodyContainer>
          </UploadContainer>
        )}
        {/* <----- image 확인 단계 -----> */}
        {step === 5 && (
          <UploadContainer>
            <HeaderContainer color="#435269">
              <div className="step">STEP 5</div>
              <div className="title">
                <AiOutlineSearch size="30" color="#fff" />
                <div className="bold">이미지 및 EXCEL</div>
                <div>검토</div>
              </div>
            </HeaderContainer>
            <BodyContainer>
              <div className="explain">
                <span className="emphasis">EXCEL 파일</span>
                <span>과 </span>
                <span className="emphasis">이미지 파일</span>
                <span>
                  을 대조한 결과 입니다. 파일을 검토하여 적절하지 못한 파일은
                  삭제하여주세요.
                </span>
              </div>
              <FileList>
                {imageMetaData.map((file, index) => {
                  return (
                    <FileCard>
                      <div className="file-container">
                        <HiOutlineDocumentText size="40" color="#d6d6d6" />
                        <div className="file-info">
                          <div>{file.name}</div>
                          <div>{file.size}</div>
                        </div>
                      </div>
                      {file.available ? (
                        <div className="file-availability">
                          <AiOutlineCheckCircle size="24" color="#6DAF44" />
                          <div>작업 가능</div>
                        </div>
                      ) : (
                        <div className="file-availability">
                          <AiOutlineCloseCircle size="20" color="#d0021b" />
                          <div>EXCEL과 매치 불가</div>
                        </div>
                      )}
                      <button
                        onClick={() => {
                          deleteImage(file.name);
                        }}
                        className="file-delete-button"
                      >
                        <RiDeleteBinLine color="#fff" size="20" />
                      </button>
                    </FileCard>
                  );
                })}
              </FileList>
            </BodyContainer>
          </UploadContainer>
        )}

        <ButtonContainer isLastStage={step}>
          {step !== 1 && <button onClick={prevStep}>{"< 이전 단계"}</button>}
          <button onClick={nextStep}>
            {step === 5 ? "업로드" : "다음 단계 >"}
          </button>
        </ButtonContainer>

        {/* 아래쪽 컨테이너 아직 사용안함 */}
        {/* <UploadContainer>
          <HeaderContainer color="#565656">
            <div className="title">
              <HiOutlineDocumentReport size="30" color="#fff" />
              <div>데이터 등록</div>
              <div className="bold">진행 상황</div>
            </div>
          </HeaderContainer>
          <BodyContainer>
            <div className="explain">
              <span>
                등록한 PDF파일과 EXCEL파일의 데이터 등록 진행상황을 확인하세요.
              </span>
            </div>
          </BodyContainer>
        </UploadContainer> */}
      </Wrapper>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 1024px;
  width: 100%;
  padding: 1.5rem 3rem;
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  button {
    background-color: grey;
    color: white;
    font-weight: bold;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
    border: none;
    cursor: pointer;
    width: 10rem;
    border-radius: 4px;
    height: 2rem;
    transition: 0.2s;
    &:hover {
      background-color: #d6d6d6;
    }
  }
`;

const FileList = styled.div`
  width: 90%;
  margin: 2rem auto;
`;
const FileCard = styled.div`
  border-radius: 4px;
  box-shadow: rgb(9 30 66 / 25%) 0px 1px 1px;
  padding: 0.5rem 1rem 0.5rem 1rem;
  width: 100%;
  margin: 1rem 0 1rem 0;
  display: flex;
  justify-content: space-between;
  .file-container {
    display: flex;
  }
  .file-info {
    margin-left: 1rem;
    display: flex;
    justify-content: center;
    flex-direction: column;
    div:nth-child(2) {
      color: #363636;
      font-size: 14px;
    }
  }
  .file-availability {
    display: flex;
    align-items: center;
    div {
      margin-left: 0.5rem;
    }
  }
  .file-delete-button {
    border: none;
    width: 0;
    border-radius: 1.25rem;
    display: none;
    background-color: #d0021b;
    cursor: pointer;
  }
  &:hover {
    .file-delete-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
    }
    .file-availability {
      display: none;
    }
  }
`;
const Wrapper = styled.div`
  width: 100%;
`;

const UploadContainer = styled.div`
  margin-top: 2rem;
  @keyframes loadEffect2 {
    0% {
      opacity: 0;
      transform: translateX(-30px);
    }
    50% {
      opacity: 0.5;
      transform: translateX(30px);
    }
    100% {
      opacity: 1;
      transform: translateX(0px);
    }
  }
  animation: 0.6s ease-in-out loadEffect2;
  box-shadow: rgb(9 30 66 / 25%) 0px 1px 1px;
`;
const HeaderContainer = styled.div`
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: left;
  div {
    font-size: 24px;
  }
  .bold {
    font-weight: bold;
  }
  .step {
    font-size: 18px;
    border-top-left-radius: 4px;
    display: flex;
    align-items: center;
    padding-right: 2rem;
    padding-left: 2rem;
    height: 100%;
    background-color: grey;
    /* background-color: #435269; */
  }
  .title {
    display: flex;
    margin-left: 1rem;
    div {
      margin-left: 5px;
    }
  }
  background-color: ${(props) => props.color || "grey"};
  color: white;
  height: 3rem;
`;
const BodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: right;
  align-items: center;
  padding: 2rem;
  min-height: 20rem;
  .explain {
    margin: 1rem 1rem 0.5rem;
  }
  .emphasis {
    font-weight: bold;
  }
  .more-explain {
    margin-bottom: 0.5rem;
    font-size: 0.8rem;
    color: #444444;
  }
  .upload {
    display: flex;
    height: 32px;
  }
  .upload-button,
  .delete-button {
    margin-left: 1rem;
    border: none;
    padding: 0 1rem 0 1rem;
    border-radius: 5px;
    background-color: grey;
    color: white;
    font-weight: bold;
    cursor: pointer;
  }
  .select-file {
    display: flex;
    align-items: center;
    border-radius: 4px;
    font-size: 14px;
    border: solid 1px #d6d6d6;
    label {
      display: flex;
      align-items: center;
      background: #eee;
      height: 100%;
      cursor: pointer;
      padding-left: 1rem;
      padding-right: 1rem;
      width: 5rem;
      justify-content: center;
      white-space: nowrap;
    }
    span {
      padding-left: 1rem;
      padding-right: 1rem;
      min-width: 15rem;
      max-width: 20rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    input[type="file"] {
      display: none;
    }
  }
`;

const ErrorListHeader = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: #d0021b;
  color: #ffffff;
  font-weight: bold;

  & > div {
    padding: 0.5rem;
  }

  & > div:nth-of-type(1) {
    width: 30%;
  }

  & > div:nth-of-type(2) {
    width: 70%;
  }
`;
const ErrorListRow = styled.div`
  box-sizing: border-box;

  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid #dfdfdf;
  border-left: 1px solid #dfdfdf;
  border-right: 1px solid #dfdfdf;

  & > * + * {
    border-left: 1px solid #dfdfdf;
  }

  & > div {
    padding: 0.5rem;
  }

  & > div:nth-of-type(1) {
    width: 30%;
  }

  & > div:nth-of-type(2) {
    width: 70%;
  }
`;

const ErrorListWrapper = styled.div`
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding-bottom: 4rem;
  text-align: center;
  & > h3 {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 2rem;
  }

  & > ${ErrorListRow}:nth-of-type(2n) {
    background-color: #fafafa;
  }
`;

export default ExcelDataRegister;
