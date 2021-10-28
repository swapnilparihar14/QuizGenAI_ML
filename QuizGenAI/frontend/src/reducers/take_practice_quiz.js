import {
  TAKE_PRACTICE_QUIZ_FAIL,
  TAKE_PRACTICE_QUIZ,
  RESET_PRACTICE_QUIZ,
  LOG_OUT,
  DELETE_QUESTION,
} from "../actions/types";

const initialState = {};

const take_practice_quiz = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case TAKE_PRACTICE_QUIZ:
      if (state.message) delete state.message;
      return {
        ...state,
        ...payload,
      };

    case DELETE_QUESTION:
      if (state.message) delete state.message;

      let i = 0;
      for (i = 0; i < state.quiz.questions.length; i++) {
        if (state.quiz.questions[i].question_id === payload.question_id) {
          break;
        }
      }

      state.quiz.questions.splice(i, 1);

      return state;

    case RESET_PRACTICE_QUIZ:
      return {};

    case TAKE_PRACTICE_QUIZ_FAIL:
      return {
        message: payload,
      };

    case LOG_OUT:
      return {
        ...initialState,
      };

    default:
      return state;
  }
};

export default take_practice_quiz;
