import { REVIEW_QUESTIONS_SUCCESS, REVIEW_QUESTIONS_FAIL } from "../actions/types";

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

    default:
      return state;
  }
}

export default review_questions;
