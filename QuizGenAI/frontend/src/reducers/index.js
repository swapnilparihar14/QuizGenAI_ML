import { combineReducers } from "redux";
import auth from "./auth";
import createQuiz from "./create_quiz";

export default combineReducers({
  auth,
  createQuiz
});