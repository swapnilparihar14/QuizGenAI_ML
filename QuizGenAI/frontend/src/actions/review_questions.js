import axios from "axios";
import { REVIEW_QUESTIONS_SUCCESS, REVIEW_QUESTIONS_FAIL, SELECT_QUESTION, CREATE_QUIZ_SUCCESS, CREATE_QUIZ_FAIL, RESET_REVIEW_QUESTIONS} from "./types";
import url from "../config/config";

// Get review questions
export const createQuizForm = (data, file) => async dispatch => {
  const config = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data'
    }
  };

  const {
    quizname, timed, hours, minutes, privacy, password, multiplechoicequestions, fillintheblankquestions, trueorfalsequestions, id
  } = data;

  let formData = new FormData();
  formData.append("quiz_name", quizname);
  formData.append("quiz_type", privacy);
  formData.append("access_code", password);
  formData.append("timed", timed);
  formData.append("hours", hours);
  formData.append("minutes", minutes);
  formData.append("mcq", multiplechoicequestions);
  formData.append("fbq", fillintheblankquestions);
  formData.append("tfq", trueorfalsequestions);
  formData.append("creator_id", id);

  formData.append("file", file);

  for(var pair of formData.entries()) {
    console.log(pair[0]+ ', '+ pair[1]);
 }

  try {
    // axios.defaults.withCredentials = true;
    
    const res = await axios.post(
      url + "/review_questions",
      formData,
      config
    );

    dispatch({
      type: REVIEW_QUESTIONS_SUCCESS,
      payload: res.data
    });
  } catch (err) {
    console.log(err.response);
    const error = err.response.data.message;

    dispatch({
      type: REVIEW_QUESTIONS_FAIL,
      payload: error
    });
  }
};

// Select question
export const selectQuestion = (type, position) => dispatch => {

  let data={type, position};

  dispatch({
    type: SELECT_QUESTION,
    payload: data
  });

};

// Reset review questions store
export const resetReviewQuestions = () => dispatch => {

  dispatch({
    type: RESET_REVIEW_QUESTIONS,
  });

};

// Create Quiz
export const createQuiz = (data) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    // axios.defaults.withCredentials = true;
    
    const res = await axios.post(
      url + "/create_quiz",
      data,
      config
    );

    dispatch({
      type: CREATE_QUIZ_SUCCESS,
      payload: res.data
    });
  } catch (err) {
    console.log(err);
    const error = err.response.data.message;

    dispatch({
      type: CREATE_QUIZ_FAIL,
      payload: error
    });
  }
};