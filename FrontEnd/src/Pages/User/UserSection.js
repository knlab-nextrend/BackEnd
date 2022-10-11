import React from "react";
import { Switch,Redirect } from "react-router-dom";
import PrivateRoute from "../../Route/PrivateRoute";

import UserOnlyDataLookUpPageContainer from "./UserOnlyDataLookUpPage/UserOnlyDataLookUpPageContainer"
import CurationDataDetailContainer from "../Common/CurationDataDetail/CurationDataDetailContainer"
function UserSection() {
  return (
    <Switch>
       <Redirect from="/home" to="/library" /> {/*사용자는 home에 접근 금지*/}
      <PrivateRoute
        path="/library"
        component={UserOnlyDataLookUpPageContainer}
        exact
      />
      <PrivateRoute
        path="/library/:_id"
        component={CurationDataDetailContainer}
        exact
      />
    </Switch>
  );
}

export default UserSection;
