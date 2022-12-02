import React from "react";
import styled from "styled-components";
import {
  BsCheckCircle,
  BsDashCircle,
  BsTrash,
  BsXCircle,
} from "react-icons/bs";

import { STATUS_CODE_SET } from "Data/crawlStatus";
import { myColors, tailwindColors } from "styles/colors";
import CrawlDataForm from "Components/CrawlDataForm";
import Button from "Components/Button";
import { WorkerContentHeader } from "Components/WorkerContentHeader";

function CrawlDataDetail({
  crawlDataFormRef,
  docs,
  dataKeep,
  dataReject,
  dataStage,
  dataUpdate,
  cancel,
  statusCode,
  type,
  _id,
}) {
  return (
    <Wrap>
      <WorkerContentHeader
        title={STATUS_CODE_SET[statusCode].title}
        Icon={STATUS_CODE_SET[statusCode].icon}
      />
      <Content>
        <CrawlDataForm
          docs={docs}
          type={type}
          ref={crawlDataFormRef}
          _id={_id}
        />
        <ButtonWrapper>
          <Button color={myColors.green300} onClick={dataStage}>
            <BsCheckCircle />
            <p>작업 완료</p>
          </Button>
          {type === "archive" && (
            <Button color={myColors.orange} onClick={dataUpdate}>
              <BsCheckCircle />
              <p>수정하기</p>
            </Button>
          )}
          {type !== "archive" && type !== "curation" && (
            <Button color={myColors.orange} onClick={dataKeep}>
              <BsDashCircle />
              <p>작업 보류</p>
            </Button>
          )}
          <Button color={myColors.red} onClick={dataReject}>
            <BsTrash />
            <p>데이터 버리기</p>
          </Button>
          <Button onClick={cancel}>
            <BsXCircle />
            <p>작업 취소</p>
          </Button>
        </ButtonWrapper>
      </Content>
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
  background-color: ${tailwindColors["grey-50"]};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 1rem;
`;

const ButtonWrapper = styled.div`
  display: flex;
  margin: 2rem;
  justify-content: center;
  gap: 1rem;
`;

export default CrawlDataDetail;
