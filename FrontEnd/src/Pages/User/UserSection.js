import React from "react";
import { Switch, Redirect } from "react-router-dom";
import PrivateRoute from "../../Route/PrivateRoute";

import UserOnlyDataLookUpPageContainer from "./UserOnlyDataLookUpPage/UserOnlyDataLookUpPageContainer";
import UserCurationDataDetailContainer from "./CurationDataDetail/CurationDataDetailContainer";
function UserSection() {
  return (
    <Switch>
      <PrivateRoute
        path="/library"
        component={UserOnlyDataLookUpPageContainer}
        exact
      />
      <PrivateRoute
        path="/library/:_id"
        component={UserCurationDataDetailContainer}
        exact
      />
      <Redirect from="/" to="/library" />
      {/*사용자는 /library 경로 외 접근 금지*/}
    </Switch>
  );
}

export default UserSection;
