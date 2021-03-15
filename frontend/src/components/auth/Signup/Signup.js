import React from "react";

class Signup extends React.Component {
  constructor(){
    super();
    this.state = {
      fname: "",
      lname: "",
      email: "",
      password: "",
      type: "",
    }
  }

  handleChange = e =>{
    this.setState({ [e.target.id]: e.target.value });
  }

  render() {
    
  }
}