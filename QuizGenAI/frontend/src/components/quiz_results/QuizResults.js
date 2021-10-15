import React from "react";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import Footer from "../footer/Footer";
import { Container, Button } from "react-bootstrap";
import quizResultsStyles from "./quiz_results.module.css";

class ConnectedQuizResults extends React.Component {
  constructor(){
    super();
    this.state = {
    }
  }

  clickDone = async (e)=> {
    e.preventDefault();

    //erase quizresults in store
    //redirect to main page
  }

  render() {
    let redirectVar = null;

    let auth = this.props.auth;
    let quiz_results = this.props.quizResult;

    // redirect based on successful signup
    if (auth.isAuthenticated === false && quiz_results.isEmpty()) {
      const path = "/my_quizzes";
      redirectVar = <Redirect to={path} />;
    }
 
    return (<>
      {redirectVar}
      <Container fluid className={quizResultsStyles.page_header}>TAKE QUIZ</Container>
      <h1>Correct Answers: {quiz_results.correct_answers}</h1>
      <h1>Wrong Answers: {quiz_results.wrong_answers}</h1>
      <h1>Score: {quiz_results.your_score}</h1>
      <h1>Max Score:{quiz_results.max_score}</h1>
      <Button className={quizResultsStyles.buttons} onClick= {this.clickDone} >Done</Button>
      <Footer></Footer>
      </>
    );
  }
}

const mapStateToProps = state => {
  return { auth: state.auth,
    quizResult: state.quizResult };
};

const QuizResults = connect(mapStateToProps)(ConnectedQuizResults);
export default QuizResults;