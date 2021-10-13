import {GET_TAKEN_QUIZZES_LIST, GET_TAKEN_QUIZZES_LIST_FAIL, LOG_OUT} from "../actions/types";

const initialState = {
};

const taken_quizzes = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_TAKEN_QUIZZES_LIST:
      return {
        ...state,
        ...payload
      };

    case GET_TAKEN_QUIZZES_LIST_FAIL:
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

export default taken_quizzes;