import {GET_CREATED_QUIZZES_LIST, GET_CREATED_QUIZZES_LIST_FAIL, LOG_OUT} from "../actions/types";

const initialState = {
};

const created_quizzes = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_CREATED_QUIZZES_LIST:
      if(state.message)
        delete state.message;
      return {
        ...state,
        ...payload
      };

    case GET_CREATED_QUIZZES_LIST_FAIL:
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

export default created_quizzes;