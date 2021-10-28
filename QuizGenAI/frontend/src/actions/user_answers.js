import axios from "axios";
import {
  SAVE_ANSWER,
  SUBMIT_QUIZ,
  SUBMIT_QUIZ_FAIL,
  RESET_ANSWERS,
  RESET_TAKE_QUIZ,
  RESET_QUIZ_RESULTS,
  RESET_PRACTICE_QUIZ,
  SAVE_NON_SENSE_QUESTION,
  DELETE_QUESTION,
} from "./types";
import url from "../config/config";

// Save answer in the store
export const saveAnswer = (question_id, answer) => (dispatch) => {
  let data = {
    question_id,
    answer,
  };

  dispatch({
    type: SAVE_ANSWER,
    payload: data,
  });
};

export const saveNonSenseQuestion = (question_id) => (dispatch) => {
  let data = {
    question_id,
  };

  dispatch({
    type: SAVE_NON_SENSE_QUESTION,
    payload: data,
  });

  dispatch({
    type: DELETE_QUESTION,
    payload: data,
  });
};

// submit quiz
export const submitQuiz = (data) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    // axios.defaults.withCredentials = true;

    const res = await axios.post(url + "/get_quiz_score", data, config);

    dispatch({
      type: SUBMIT_QUIZ,
      payload: res.data,
    });

    dispatch({
      type: RESET_TAKE_QUIZ,
    });

    dispatch({
      type: RESET_PRACTICE_QUIZ,
    });

    dispatch({
      type: RESET_ANSWERS,
    });
  } catch (err) {
    console.log("err", err);
    const error = err.response.data.message;

    dispatch({
      type: SUBMIT_QUIZ_FAIL,
      payload: error,
    });
  }
};

export const resetQuizScores = () => (dispatch) => {
  dispatch({
    type: RESET_QUIZ_RESULTS,
  });
};
