import { REVIEW_QUESTIONS_SUCCESS, REVIEW_QUESTIONS_FAIL, SELECT_QUESTION, UNSELECT_QUESTION, CREATE_QUIZ_SUCCESS, CREATE_QUIZ_FAIL, LOG_OUT} from "../actions/types";

const initialState = {
};

const review_questions = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case REVIEW_QUESTIONS_SUCCESS:
      return {
        ...state,
        ...payload
      };

    case REVIEW_QUESTIONS_FAIL:
      return {
        message: payload,
      };

    case SELECT_QUESTION:
      state.questions[payload.type][payload.position].isSelected = !state.questions[payload.type][payload.position].isSelected;
      return {
        ...state,
      };

    case UNSELECT_QUESTION:
      state.questions[payload.type][payload.position].isSelected = false;
      return {
        ...state,
      };

    case CREATE_QUIZ_SUCCESS:
      return {
        ...payload,
      };

    case CREATE_QUIZ_FAIL:
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

export default review_questions;
