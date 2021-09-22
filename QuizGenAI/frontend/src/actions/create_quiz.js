import axios from "axios";
import { CREATE_QUIZ_SUCCESS, CREATE_QUIZ_FAIL} from "./types";
import url from "../config/config";

//Create Quiz
export const createQuiz = (data, file) => async dispatch => {
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
      type: CREATE_QUIZ_SUCCESS,
      payload: res.data
    });
  } catch (err) {
    console.log(err.response);
    const error = err.response.data.message;

    dispatch({
      type: CREATE_QUIZ_FAIL,
      payload: error
    });
  }
};