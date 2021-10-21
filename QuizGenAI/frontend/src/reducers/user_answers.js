import { SAVE_ANSWER, RESET_ANSWERS, LOG_OUT} from "../actions/types";

const initialState = {
  questions: [],
  nonsense_questions: []
};

const user_answers = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SAVE_ANSWER:
      if(state.message)
        delete state.message;

      let match = false;
      for (var i = 0; i < state.questions.length; i++) {

        if(state.questions[i].question_id === payload.question_id){
          match = true;
          state.questions[i].answer = payload.answer;
          break;
        }
      }

      if(!match)
        state.questions.push(payload);
      
      return state;

    case RESET_ANSWERS:
      console.log("reset answers");
      return {
        questions: [],
        nonsense_questions: []
      };

    case LOG_OUT:
      return {
        questions: [],
        nonsense_questions: []
      };

    default:
      return state;
  }
}

export default user_answers;