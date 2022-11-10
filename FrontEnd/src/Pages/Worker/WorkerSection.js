import React from "react";
import { Switch, Redirect } from "react-router-dom";
import PrivateRoute from "../../Route/PrivateRoute";

import CrawlDataDetailContainer from "./CrawlDataDetail/CrawlDataDetailContainer";
import CrawlDataScreeningContainer from "./CrawlDataScreening/CrawlDataScreeningContainer";
import CrawlDataListContainer from "./CrawlDataList/CrawlDataListContainer";
import ArchiveDataListContainer from "./ArchiveDataList/ArchiveDataListContainer";
import CurationDataDetailContainer from "./CurationDataDetail/CurationDataDetailContainer";
import AdminCurationDataList from "./AdminCurationDataList";
import LegacyDataListContainer from "./LegacyDatalist/LegacyDataListContainer";

function WorkerSection() {
  return (
    <Switch>
      <PrivateRoute
        path="/crawl/screening"
        component={CrawlDataScreeningContainer}
        exact
      />
      <Redirect from="/crawl/3" to="/crawl/2" />
      {/* statusCode 3번 , 5번 접근 방지*/}
      <Redirect from="/crawl/5" to="/crawl/4" />
      {/* statusCode 3번 , 5번 접근 방지*/}
      <PrivateRoute
        path="/crawl/:statusCode"
        component={CrawlDataListContainer}
        exact
      />
      <PrivateRoute
        path="/archive"
        component={ArchiveDataListContainer}
        exact
      />
      <PrivateRoute
        path="/crawl/:statusCode/:_id"
        component={CrawlDataDetailContainer}
        exact
      />
      <PrivateRoute path="/curation" component={AdminCurationDataList} exact />
      <PrivateRoute
        path="/curation/:_id"
        component={CurationDataDetailContainer}
        exact
      />
      <PrivateRoute path="/legacy" component={LegacyDataListContainer} exact />
    </Switch>
  );
}

export default WorkerSection;
