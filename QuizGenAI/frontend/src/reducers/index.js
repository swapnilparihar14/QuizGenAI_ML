import { combineReducers } from "redux";
import { persistReducer } from 'redux-persist';
import storage from "redux-persist/lib/storage";

import auth from "./auth";
import reviewQuestions from "./review_questions";
import createdQuizzes from "./created_quizzes";
import practiceQuizzes from "./practice_quizzes";
import takenQuizzes from "./taken_quizzes";
import showCreatedQuiz from "./show_created_quiz";

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'reviewQuestions', 'createdQuizzes', 'practiceQuizzes', 'takenQuizzes', 'showCreatedQuiz']
}

const rootReducer = combineReducers({
  auth,
  reviewQuestions,
  createdQuizzes,
  practiceQuizzes,
  takenQuizzes,
  showCreatedQuiz
});

export default persistReducer(persistConfig, rootReducer);