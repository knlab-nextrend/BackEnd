import React from "react";
import styled from "styled-components"
import CurationDataListContainer from "../../Common/CurationDataList/CurationDataListContainer";
function UserCurationDataList({...rest}) {
  return (
    <>
      <CurationDataListContainer {...rest} />
    </>
  );
}


export default UserCurationDataList;
