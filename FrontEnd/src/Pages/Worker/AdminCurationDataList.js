import React from "react";
import styled from "styled-components";
import { LoadingWrapper } from "../../Components/LoadingWrapper";
import CurationDataListContainer from "./CurationDataList/CurationDataListContainer";
function AdminCurationDataList() {
  return (
    <LoadingWrapper>
      <CurationDataListContainer />
    </LoadingWrapper>
  );
}

export default AdminCurationDataList;
