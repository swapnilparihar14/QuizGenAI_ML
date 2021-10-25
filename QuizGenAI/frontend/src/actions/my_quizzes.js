import axios from "axios";
import {GET_QUIZZES_LIST, GET_QUIZZES_LIST_FAIL, GET_SPECIFIC_QUIZ, GET_SPECIFIC_QUIZ_FAIL, RESET_SHOW_QUIZ} from "./types";
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
      type: GET_SPECIFIC_QUIZ,
      payload: res.data
    });
  } catch (err) {
    console.log("err", err);
    const error = err.response.data.message;

    dispatch({
      type: GET_SPECIFIC_QUIZ_FAIL,
      payload: error
    });
  }
};

// Get Practice Quizzes List
export const getPracticeQuizzes = (id) => async dispatch => {
  let data = {"id": id};
  try {
    // axios.defaults.withCredentials = true;
    
    const res = await axios.get(
      url + "/get_practice_quizzes",
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

// Get Practice Quiz
export const getPracticeQuiz = (data) => async dispatch => {
  try {
    // axios.defaults.withCredentials = true;
    
    const res = await axios.get(
      url + "/get_your_taken_or_practice_quiz",
      {
        params: data
      }
    );

    dispatch({
      type: GET_SPECIFIC_QUIZ,
      payload: res.data
    });
  } catch (err) {
    console.log("err", err);
    const error = err.response.data.message;

    dispatch({
      type: GET_SPECIFIC_QUIZ_FAIL,
      payload: error
    });
  }
};

// Get Taken Quizzes List
export const getTakenQuizzes = (id) => async dispatch => {
  let data = {"id": id};
  try {
    // axios.defaults.withCredentials = true;
    
    const res = await axios.get(
      url + "/get_taken_quizzes",
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

// Get Taken Quiz
export const getTakenQuiz = (data) => async dispatch => {
  try {
    // axios.defaults.withCredentials = true;
    
    const res = await axios.get(
      url + "/get_your_taken_or_practice_quiz",
      {
        params: data
      }
    );

    dispatch({
      type: GET_SPECIFIC_QUIZ,
      payload: res.data
    });
  } catch (err) {
    console.log("err", err);
    const error = err.response.data.message;

    dispatch({
      type: GET_SPECIFIC_QUIZ_FAIL,
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
