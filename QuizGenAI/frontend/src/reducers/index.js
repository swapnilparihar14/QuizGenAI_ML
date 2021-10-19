import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import auth from "./auth";
import reviewQuestions from "./review_questions";
import listQuizzes from "./list_quizzes";
import showCreatedQuiz from "./show_created_quiz";
import takeQuiz from "./take_quiz";
import userAnswers from "./user_answers";
import quizResults from "./quiz_results";
import practiceQuiz from "./take_practice_quiz";

const persistConfig = {
  key: "root",
  storage,
  whitelist: [
    "auth",
    "reviewQuestions",
    "listQuizzes",
    "showCreatedQuiz",
    "takeQuiz",
    "userAnswers",
    "quizResults",
    "practiceQuiz",
  ],
};

const rootReducer = combineReducers({
  auth,
  reviewQuestions,
  listQuizzes,
  showCreatedQuiz,
  takeQuiz,
  userAnswers,
  quizResults,
  practiceQuiz,
});

export default persistReducer(persistConfig, rootReducer);
