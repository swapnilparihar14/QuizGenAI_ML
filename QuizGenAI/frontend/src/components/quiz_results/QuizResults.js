import React from "react";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import Footer from "../footer/Footer";
import { Container, Button } from "react-bootstrap";
import quizResultsStyles from "./quiz_results.module.css";
import congratulations from "./congratulations.png";
import { resetQuizScores } from "../../actions/user_answers";

class ConnectedQuizResults extends React.Component {
  constructor() {
    super();
    this.state = {
      redirect: false,
    };
  }

  clickDone = async (e) => {
    e.preventDefault();

    //erase quizresults in store
    //redirect to main page
    this.props.dispatch(resetQuizScores());
    this.setState({
      redirect: true,
    });
  };

  render() {
    let redirectVar = null;

    let auth = this.props.auth;
    let quiz_results = this.props.quizResults;

    // redirect based on successful signup
    if (this.state.redirect === true) {
      const path = "/my_quizzes";
      redirectVar = <Redirect to={path} />;
    }

    return (
      <>
        {redirectVar}
        <Container fluid className={quizResultsStyles.page_header}>
          TAKE QUIZ
        </Container>
        <Container className={quizResultsStyles.custom_container}>
          <img
            className={quizResultsStyles.congratulations_image}
            src={congratulations}
          />
          <h2>
            You scored{" "}
            <span className={quizResultsStyles.score}>
              {quiz_results.your_score}
            </span>{" "}
            out of{" "}
            <span className={quizResultsStyles.score}>
              {quiz_results.max_score}
            </span>
          </h2>
          {/* <h3>
            No of correct Answers:{" "}
            <span className={quizResultsStyles.question_count}>
              {quiz_results.correct_ans}
            </span>
          </h3>
          <h3>
            No of wrong Answers:{" "}
            <span className={quizResultsStyles.question_count}>
              {quiz_results.wrong_ans}
            </span>
          </h3> */}

          <Button
            className={quizResultsStyles.buttons}
            onClick={this.clickDone}
          >
            Done
          </Button>
        </Container>
        <Footer></Footer>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return { auth: state.auth, quizResults: state.quizResults };
};

const QuizResults = connect(mapStateToProps)(ConnectedQuizResults);
export default QuizResults;
