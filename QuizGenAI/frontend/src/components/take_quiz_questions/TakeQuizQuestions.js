import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import Footer from "../footer/Footer";
import Timer from "react-compound-timer";
import { Container, Form } from "react-bootstrap";
import takeQuizQuestionsStyles from "./take_quiz_questions.module.css";
import MultipleChoiceContainer from "./MultipleChoiceContainer";
import FillInTheBlankContainer from "./FillInTheBlankContainer";
import TrueOrFalseContainer from "./TrueOrFalseContainer";

import { submitQuiz } from "../../actions/user_answers";

class ConnectedTakeQuizQuestions extends React.Component {
  constructor() {
    super();
    this.state = {
      questionCounter: 0,
      submit: false,
    };
  }

  clickNext = async (e) => {
    e.preventDefault();
    this.setState((prevState) => ({
      questionCounter: prevState.questionCounter + 1,
    }));
  };

  clickSubmit = async () => {
    let data = {
      user_id: localStorage.getItem("id"),
      quiz_id: this.props.takeQuiz.quiz.quiz_id,
      questions: this.props.userAnswers.questions,
      nonsense_questions: this.props.userAnswers.nonsense_questions,
    };

    console.log("data", data.questions);

    await this.props.dispatch(submitQuiz(data));

    this.setState({ submit: true });
  };

  render() {
    let redirectVar = null;

    let auth = this.props.auth;
    let take_quiz = this.props.takeQuiz;

    // redirect based on successful signup and fetching of questions
    if (auth.isAuthenticated === false) {
      const path = "/my_quizzes";
      redirectVar = <Redirect to={path} />;
    }

    let question = null;
    let questionCounter = this.state.questionCounter;
    let totalQuestions = 0;

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
            <p style={{ display: "inline", fontWeight: "500" }}>Time Running: </p>
            <p className={takeQuizQuestionsStyles.hours}>
              <Timer.Hours />
              <span> Hours, </span>
            </p>
            <p className={takeQuizQuestionsStyles.minutes}>
              <Timer.Minutes />
              <span> Minutes, </span>
            </p>
            <p className={takeQuizQuestionsStyles.seconds}>
              <Timer.Seconds />
              <span> Seconds </span>
            </p>
          </Timer>
        );

    let submitRedirect = null;
    if (this.state.submit) submitRedirect = <Redirect to="/quiz_results" />;

    return (
      <>
        {redirectVar}
        {submitRedirect}
        <Container fluid className={takeQuizQuestionsStyles.page_header}>
          QUESTION {questionCounter + 1} OUT OF {totalQuestions}{" "}
        </Container>
        <Container className={takeQuizQuestionsStyles.container}>
          <div style={{ float: "right" }}>{timer}</div>
          <Form
            id="review-questions-form"
            className={takeQuizQuestionsStyles.form}
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
    takeQuiz: state.takeQuiz,
    userAnswers: state.userAnswers,
  };
};

const TakeQuizQuestions = connect(mapStateToProps)(ConnectedTakeQuizQuestions);
export default TakeQuizQuestions;
