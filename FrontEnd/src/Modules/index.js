import { combineReducers } from "redux";

import login from "./login";
import modal from "./modal";
import user from "./user";
import custom, { editingAxis, axisMenuData } from "./custom";
import { sidebar } from "./sidebar";

const rootReducer = combineReducers({
  login,
  modal,
  user,
  custom,
  editingAxis,
  sidebar,
  axisMenuData,
});

export default rootReducer;
