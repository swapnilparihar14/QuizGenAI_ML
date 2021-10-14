import { TAKE_QUIZ, TAKE_QUIZ_FAIL, RESET_TAKE_QUIZ, LOG_OUT} from "../actions/types";

const initialState = {
};

const take_quiz = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case TAKE_QUIZ:
      if(state.message)
        delete state.message;
      return {
        ...state,
        ...payload
      };

    case TAKE_QUIZ_FAIL:
      return {
        message: payload,
      };

    // case SELECT_QUESTION:
    //   state.questions[payload.type][payload.position].isSelected = !state.questions[payload.type][payload.position].isSelected;
    //   return {
    //     ...state,
    //   };

    // case CREATE_QUIZ_SUCCESS:
    //   return {
    //     ...payload,
    //     createQuizStatus: "success"
    //   };

    // case CREATE_QUIZ_FAIL:
    //   return {
    //     message: payload,
    //     createQuizStatus: "fail"
    //   };

    case RESET_TAKE_QUIZ:
      return {};

    case LOG_OUT:
      return {
        ...initialState
      };

    default:
      return state;
  }
}

export default take_quiz;