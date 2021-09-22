import React from "react";
// import { Container, Image, Col, Row } from "react-bootstrap";
// import myQuizzesStyles from "./my_quizzes.module.css";
import NavigationBar from "../navbar/Navbar";
import Footer from "../footer/Footer";

class MyQuizzes extends React.Component {

  render() {

    
    return (
      <>
      <NavigationBar boolLoggedIn={true}></NavigationBar> 
      <h1>My Quizzes: My Quizzes Created and My Quizzes Taken</h1>
      <Footer boolLoggedIn={true}></Footer>
      </>
    );
  }
}

export default MyQuizzes;