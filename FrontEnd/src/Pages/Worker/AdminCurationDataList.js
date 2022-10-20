import React from "react";
import styled from "styled-components";
import FormHeader from "../../Components/FormHeader";
import { LoadingWrapper } from "../../Components/LoadingWrapper";
import CurationDataListContainer from "../Common/CurationDataList/CurationDataListContainer";
function AdminCurationDataList() {
  return (
    <LoadingWrapper>
      <FormHeader type="view" title={"큐레이션 데이터 조회"} />
      <Wrapper>
        <CurationDataListContainer />
      </Wrapper>
    </LoadingWrapper>
  );
}

const Wrapper = styled.div`
  margin: 0 5rem 0 5rem;
`;

export default AdminCurationDataList;
