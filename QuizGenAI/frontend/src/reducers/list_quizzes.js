import {GET_QUIZZES_LIST, GET_QUIZZES_LIST_FAIL, RESET_GET_QUIZZES, LOG_OUT} from "../actions/types";

const initialState = {
};

const list_quizzes = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_QUIZZES_LIST:
      if(state.message)
        delete state.message;
      return {
        ...state,
        ...payload
      };

    case GET_QUIZZES_LIST_FAIL:
      return {
        message: payload,
      };

    case RESET_GET_QUIZZES:
      return {
        ...initialState,
      };

    case LOG_OUT:
      return {
        ...initialState
      };

    default:
      return state;
  }
}

export default list_quizzes;