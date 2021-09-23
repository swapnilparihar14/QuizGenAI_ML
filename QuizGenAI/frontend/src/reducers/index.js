import { combineReducers } from "redux";
import { persistReducer } from 'redux-persist';
import storage from "redux-persist/lib/storage";

import auth from "./auth";
import reviewQuestions from "./review_questions";

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'reviewQuestions']
}

const rootReducer = combineReducers({
  auth,
  reviewQuestions
});

export default persistReducer(persistConfig, rootReducer);