import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import Footer from "../footer/Footer";
import { Container, Form } from "react-bootstrap";
import Timer from "react-compound-timer";
import practiceQuizQuestionsStyles from "./take_quiz_questions.module.css";
import MultipleChoiceContainer from "./MultipleChoiceContainer";
import FillInTheBlankContainer from "./FillInTheBlankContainer";
import TrueOrFalseContainer from "./TrueOrFalseContainer";
import Alert from "../alert/Alert";

import { submitQuiz } from "../../actions/user_answers";

class ConnectedpracticeQuizQuestions extends React.Component {
  constructor() {
    super();
    this.state = {
      questionCounter: 0,
      submit: false,
    };
  }

  clickNext = async () => {
    this.setState((prevState) => ({
      questionCounter: prevState.questionCounter + 1,
    }));
  };

  clickSubmit = async () => {
    let data = {
      user_id: localStorage.getItem("id"),
      quiz_id: this.props.practiceQuiz.quiz.quiz_id,
      questions: this.props.userAnswers.questions,
      nonsense_questions: this.props.userAnswers.nonsense_questions,
      quiz_type: "practice",
    };

    console.log("data", data.questions);

    await this.props.dispatch(submitQuiz(data));

    this.setState({ submit: true });
  };

  render() {
    let redirectVar = null;

    let auth = this.props.auth;
    let take_quiz = this.props.practiceQuiz;

    // redirect based on successful signup
    if (auth.isAuthenticated === false) {
      const path = "/my_quizzes";
      redirectVar = <Redirect to={path} />;
    }

    let question = null;
    let questionCounter = this.state.questionCounter;
    let totalQuestions = 0;

    if (
      this.props.practiceQuiz.message &&
      this.props.practiceQuiz.message != "Success"
    ) {
      alert = (
        <Alert
          type="fail"
          message={this.props.reviewQuestions.message}
          delete={this.clickDeleteAlert}
        />
      );
    }

    if (take_quiz.quiz) {
      totalQuestions = take_quiz.quiz.questions.length;
      if (take_quiz.quiz.questions.length !== 0) {
        let last = false;
        if (questionCounter < take_quiz.quiz.questions.length) {
          if (questionCounter === take_quiz.quiz.questions.length - 1)
            last = true;

          if (take_quiz.quiz.questions[questionCounter].type === "mcq")
            question = (
              <MultipleChoiceContainer
                key={questionCounter}
                multipleChoiceQuestion={
                  take_quiz.quiz.questions[questionCounter]
                }
                last={last}
                clickNext={this.clickNext}
                clickSubmit={this.clickSubmit}
              />
            );
          else if (take_quiz.quiz.questions[questionCounter].type === "fbq")
            question = (
              <FillInTheBlankContainer
                key={questionCounter}
                fillinTheBlankQuestion={
                  take_quiz.quiz.questions[questionCounter]
                }
                last={last}
                clickNext={this.clickNext}
                clickSubmit={this.clickSubmit}
              />
            );
          else if (take_quiz.quiz.questions[questionCounter].type === "tfq")
            question = (
              <TrueOrFalseContainer
                key={questionCounter}
                trueOrFalseQuestion={take_quiz.quiz.questions[questionCounter]}
                last={last}
                clickNext={this.clickNext}
                clickSubmit={this.clickSubmit}
              />
            );
        }
      }
    }

    let timer = null;

    if (take_quiz.quiz)
      if (take_quiz.quiz.duration !== "")
        timer = (
          <Timer
            initialTime={take_quiz.quiz.duration * 60000}
            direction="backward"
            checkpoints={[
              {
                time: 0,
                callback: () => {
                  this.clickSubmit();
                },
              },
            ]}
          >
            <p style={{ display: "inline", fontWeight: "500" }}>Timer: </p>
            <p className={practiceQuizQuestionsStyles.hours}>
              <Timer.Hours />
              <span>hours </span>
            </p>
            <p className={practiceQuizQuestionsStyles.minutes}>
              <Timer.Minutes />
              <span>minutes </span>
            </p>
            <p className={practiceQuizQuestionsStyles.seconds}>
              <Timer.Seconds />
              <span>seconds </span>
            </p>
          </Timer>
        );

    let submitRedirect = null;
    if (this.state.submit) submitRedirect = <Redirect to="/quiz_results" />;

    return (
      <>
        {redirectVar}
        {submitRedirect}
        <Container fluid className={practiceQuizQuestionsStyles.page_header}>
          QUESTION {questionCounter + 1} OUT OF {totalQuestions}{" "}
        </Container>
        <Container className={practiceQuizQuestionsStyles.container}>
          <div style={{ float: "right" }}>{timer}</div>
          <Form
            id="review-questions-form"
            className={practiceQuizQuestionsStyles.form}
          >
            {question}
          </Form>
        </Container>
        <Footer></Footer>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    practiceQuiz: state.practiceQuiz,
    userAnswers: state.userAnswers,
  };
};

const practiceQuizQuestions = connect(mapStateToProps)(
  ConnectedpracticeQuizQuestions
);
export default practiceQuizQuestions;
