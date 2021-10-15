import axios from "axios";
import {GET_QUIZZES_LIST, GET_QUIZZES_LIST_FAIL, GET_CREATED_QUIZ, GET_CREATED_QUIZ_FAIL, GET_PRACTICE_QUIZ, GET_PRACTICE_QUIZ_FAIL, GET_TAKEN_QUIZ, GET_TAKEN_QUIZ_FAIL, RESET_SHOW_QUIZ} from "./types";
import url from "../config/config";

// Get Created Quizzes List
export const getCreatedQuizzes = (id) => async dispatch => {
  let data = {"id": id};
  try {
    // axios.defaults.withCredentials = true;
    
    const res = await axios.get(
      url + "/get_created_quizzes",
      {
        params: data
      }
    );

    dispatch({
      type: GET_QUIZZES_LIST,
      payload: res.data
    });
  } catch (err) {
    console.log("err", err);
    const error = err.response.data.message;

    dispatch({
      type: GET_QUIZZES_LIST_FAIL,
      payload: error
    });
  }
};

// Get Created Quiz
export const getCreatedQuiz = (quizId) => async dispatch => {
  let data = {"quiz_id": quizId};
  try {
    // axios.defaults.withCredentials = true;
    
    const res = await axios.get(
      url + "/get_your_created_quiz",
      {
        params: data
      }
    );

    dispatch({
      type: GET_CREATED_QUIZ,
      payload: res.data
    });
  } catch (err) {
    console.log("err", err);
    const error = err.response.data.message;

    dispatch({
      type: GET_CREATED_QUIZ_FAIL,
      payload: error
    });
  }
};

// Reset show quiz
export const resetShowQuiz = () => dispatch => {
  dispatch({
    type: RESET_SHOW_QUIZ,
  });

};
