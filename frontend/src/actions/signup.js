import axios from "axios";
import { SIGNUP_SUCCESS, SIGNUP_FAIL } from "./types";
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
    console.log(err);
    // const { errors } = err.response.data;

    // dispatch({
    //   type: SIGNUP_FAIL,
    //   payload: errors
    // });
  }
};
