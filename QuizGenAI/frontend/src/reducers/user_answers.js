import {
  SAVE_ANSWER,
  RESET_ANSWERS,
  SAVE_NON_SENSE_QUESTION,
  LOG_OUT,
} from "../actions/types";

const initialState = {
  questions: [],
  nonsense_questions: [],
};

const user_answers = (state = initialState, action) => {
  const { type, payload } = action;
  console.log(type);
  switch (type) {
    case SAVE_ANSWER:
      if (state.message) delete state.message;

      let match = false;
      for (let i = 0; i < state.questions.length; i++) {
        if (state.questions[i].question_id === payload.question_id) {
          match = true;
          state.questions[i].answer = payload.answer;
          break;
        }
      }

      if (!match) state.questions.push(payload);

      return state;

    case SAVE_NON_SENSE_QUESTION:
      if (state.message) delete state.message;

      let i = 0;
      for (i = 0; i < state.questions.length; i++) {
        if (state.questions[i].question_id === payload.question_id) {
          break;
        }
      }

      state.questions.splice(i, 1);
      state.nonsense_questions.push(payload.question_id);

      return state;

    case RESET_ANSWERS:
      return {
        questions: [],
        nonsense_questions: [],
      };

    case LOG_OUT:
      return {
        ...initialState,
      };

    default:
      return state;
  }
};

export default user_answers;
