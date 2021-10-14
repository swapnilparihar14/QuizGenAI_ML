import {GET_PRACTICE_QUIZZES_LIST, GET_PRACTICE_QUIZZES_LIST_FAIL, LOG_OUT} from "../actions/types";

const initialState = {
};

const practice_quizzes = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_PRACTICE_QUIZZES_LIST:
      if(state.message)
       delete state.message;
      return {
        ...state,
        ...payload
      };

    case GET_PRACTICE_QUIZZES_LIST_FAIL:
      return {
        message: payload,
      };

    case LOG_OUT:
      return {
        ...initialState
      };

    default:
      return state;
  }
}

export default practice_quizzes;