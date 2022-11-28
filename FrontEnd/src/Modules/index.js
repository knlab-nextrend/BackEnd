import { combineReducers } from "redux";

import login from "./login";
import modal from "./modal";
import user from "./user";
import custom, { editingAxis } from "./custom";
import { sidebar } from "./sidebar";

const rootReducer = combineReducers({
  login,
  modal,
  user,
  custom,
  editingAxis,
  sidebar,
});

export default rootReducer;
