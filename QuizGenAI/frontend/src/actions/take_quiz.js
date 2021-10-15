import axios from "axios";
import {RESET_TAKE_QUIZ, TAKE_QUIZ, TAKE_QUIZ_FAIL} from "./types";
import url from "../config/config";

// Take Quiz: Get Questions
export const takeQuiz = (data) => async dispatch => {
  try {
    // axios.defaults.withCredentials = true;
    
    const res = await axios.get(
      url + "/take_created_quiz",
      {
        params: data
      }
    );

    dispatch({
      type: TAKE_QUIZ,
      payload: res.data
    });
  } catch (err) {
    console.log("err", err);
    const error = err.response.data.message;

    dispatch({
      type: TAKE_QUIZ_FAIL,
      payload: error
    });
  }
};

// Reset take quiz questions in the store
export const resetTakeQuiz = () => dispatch => {

  dispatch({
    type: RESET_TAKE_QUIZ,
  });

};
