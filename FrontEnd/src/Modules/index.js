import { combineReducers } from "redux";
import login from "./login";
import modal from "./modal";
import user from "./user";
import custom, { editingAxis } from "./custom";

const rootReducer = combineReducers({
  login,
  modal,
  user,
  custom,
  editingAxis,
});

export default rootReducer;
