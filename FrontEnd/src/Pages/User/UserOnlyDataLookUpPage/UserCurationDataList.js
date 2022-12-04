import React from "react";
import CurationDataListContainer from "../../Common/CurationDataList/CurationDataListContainer";
function UserCurationDataList({ ...rest }) {
  return (
    <>
      <CurationDataListContainer {...rest} />
    </>
  );
}

export default UserCurationDataList;
