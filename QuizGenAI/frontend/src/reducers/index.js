import { combineReducers } from "redux";
import { persistReducer } from 'redux-persist';
import storage from "redux-persist/lib/storage";

import auth from "./auth";
import createQuiz from "./create_quiz";

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'createQuiz']
}

const rootReducer = combineReducers({
  auth,
  createQuiz
});

export default persistReducer(persistConfig, rootReducer);