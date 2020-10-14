import { combineReducers } from "redux";
import userReducer from "./userReducer";
import authReducer from "./authReducer";
import taskReducer from "./TaskReducer";
export default combineReducers({
  auth: authReducer,
  users: userReducer,
  tasks: taskReducer,
});
