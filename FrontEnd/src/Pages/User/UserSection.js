import React from "react";
import { Switch, Redirect } from "react-router-dom";
import PrivateRoute from "routes/PrivateRoute";

import UserOnlyDataLookUpPageContainer from "./UserOnlyDataLookUpPage/UserOnlyDataLookUpPageContainer";
import CurationDataDetailContainer from "../Worker/CurationDataDetail/CurationDataDetailContainer";

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
        component={CurationDataDetailContainer}
        exact
      />
      <Redirect from="/" to="/library" />
      {/*사용자는 /library 경로 외 접근 금지*/}
    </Switch>
  );
}

export default UserSection;
