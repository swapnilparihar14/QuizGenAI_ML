import { SUBMIT_QUIZ, SUBMIT_QUIZ_FAIL, LOG_OUT} from "../actions/types";

const initialState = {
};

const quiz_results = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SUBMIT_QUIZ:
      if(state.message)
        delete state.message;
      return {
        ...state,
        ...payload
      };

    case SUBMIT_QUIZ_FAIL:
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

export default quiz_results;