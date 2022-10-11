import React  from "react";
import { AiOutlineArrowRight, AiOutlineDelete } from "react-icons/ai";
import { FaRegHandPaper } from "react-icons/fa";
import CrawlDataForm from "../../../Components/CrawlDataForm";
import FormHeader from "../../../Components/FormHeader";
import Button from "../../../Components/Button";
import styled from "styled-components";

function CrawlDataDetail({
  crawlDataFormRef,
  docs,
  dataKeep,
  dataReject,
  dataStage,
  cancel,
  STATUS_CODE_SET,
  statusCode,
  type,
  _id
}) {
  return (
    <>
      <FormHeader type="plus" title={STATUS_CODE_SET[statusCode].title} />
      <CrawlDataForm docs={docs} type={type} ref={crawlDataFormRef} _id={_id} />
      <ButtonWrapper>
        <Button color="#dc3545" onClick={dataReject}>
          <AiOutlineDelete color="white" />
          <p>데이터 버리기</p>
        </Button>
        {(type !== "archive") && (type !== "curation") && (
          <Button color="#6DAF44" onClick={dataKeep}>
            <FaRegHandPaper color="white" />
            <p>작업 보류</p>
          </Button>
        )}
        <Button color="#435269" onClick={dataStage}>
          <AiOutlineArrowRight color="white" />
          <p>작업 완료</p>
        </Button>
        <Button onClick={cancel}>
          <AiOutlineDelete color="white" />
          <p>작업 취소</p>
        </Button>
      </ButtonWrapper>
    </>
  );
}

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin: 2rem;
  justify-content: center;
  Button {
    margin: 1rem;
  }
`;

export default CrawlDataDetail;
