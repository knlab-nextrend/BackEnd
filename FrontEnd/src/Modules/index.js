import { combineReducers } from "redux";
import login from "./login";
import modal from "./modal";
import user from "./user";
import custom from "./custom"

const rootReducer = combineReducers({ login, modal, user,custom });

export default rootReducer;
