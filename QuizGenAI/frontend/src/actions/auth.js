import axios from "axios";
import { SIGNUP_SUCCESS, SIGNUP_FAIL, LOGIN_SUCCESS, LOGIN_FAIL, LOG_OUT} from "./types";
import url from "../config/config";


//Sign Up
export const signup = (data) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({
    first_name: data.fname,
    last_name: data.lname,
    email_id: data.email,
    password: data.password,
    type: data.type
  });

  console.log(body);

  try {
    // axios.defaults.withCredentials = true;
    
    const res = await axios.post(
      url + "/registerUser",
      body,
      config
    );

    dispatch({
      type: SIGNUP_SUCCESS,
      payload: res.data
    });
  } catch (err) {
    console.log(err.response);
    const error = err.response.data.message;

    dispatch({
      type: SIGNUP_FAIL,
      payload: error
    });
  }
};


//Log In
export const login = (data) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({
    email_id: data.email,
    password: data.password,
  });

  console.log(body);

  try {    
    const res = await axios.post(
      url + "/login",
      body,
      config
    );

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });
  } catch (err) {
    console.log(err.response);
    const error = err.response.data.message;

    dispatch({
      type: LOGIN_FAIL,
      payload: error
    });
  }
};