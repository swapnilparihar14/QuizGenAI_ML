import {
  REVIEW_QUESTIONS_SUCCESS,
  REVIEW_QUESTIONS_FAIL,
  SELECT_QUESTION,
  CREATE_QUIZ_SUCCESS,
  CREATE_QUIZ_FAIL,
  RESET_REVIEW_QUESTIONS,
  DELETE_ERROR_REVIEW_QUESTION_MESSAGE,
  LOG_OUT,
} from "../actions/types";

const initialState = {};

const review_questions = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case REVIEW_QUESTIONS_SUCCESS:
      if (state.message) delete state.message;
      return {
        ...state,
        ...payload,
      };

    case REVIEW_QUESTIONS_FAIL:
      return {
        message: payload,
      };

    case SELECT_QUESTION:
      state.questions[payload.type][payload.position].isSelected =
        !state.questions[payload.type][payload.position].isSelected;
      return {
        ...state,
      };

    case CREATE_QUIZ_SUCCESS:
      return {
        ...payload,
        createQuizStatus: "success",
      };

    case CREATE_QUIZ_FAIL:
      return {
        message: payload,
        createQuizStatus: "fail",
      };

    case RESET_REVIEW_QUESTIONS:
      return {
        ...initialState,
      };

    case DELETE_ERROR_REVIEW_QUESTION_MESSAGE:
      if (state.message) delete state.message;
      return {
        ...state,
      };

    case LOG_OUT:
      return {
        ...initialState,
      };

    default:
      return state;
  }
};

export default review_questions;
