import React from "react";
import { connect } from "react-redux";
import NavigationBar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { Container, Card, Button, Form } from "react-bootstrap";
import { Redirect } from "react-router";
import reviewQuestionsStyles from "./review_questions.module.css";
import MultipleChoiceContainer from "./MultipleChoiceContainer";
import FillInTheBlankContainer from "./FillInTheBlankContainer";
import TrueOrFalseContainer from "./TrueOrFalseContainer";
import Alert from "../alert/Alert";

import {
  createQuiz,
  deleteMessage,
  deleteCancelMessage,
  cancelReviewQuestions,
} from "../../actions/review_questions";

class ConnectedReviewQuestions extends React.Component {
  constructor() {
    super();
    this.state = {
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  clickCreateQuiz = async (e) => {
    e.preventDefault();

    await this.props.dispatch(createQuiz(this.props.reviewQuestions));
  };

  clickCancel = async (e) => {
    e.preventDefault();
    let data = {
      quiz_id: this.props.reviewQuestions.quiz_id,
    };
    await this.props.dispatch(cancelReviewQuestions(data));
  };

  clickDeleteAlert = async (e) => {
    e.preventDefault();
    await this.props.dispatch(deleteMessage());
  };

  clickDeleteCancelAlert = async (e) => {
    e.preventDefault();
    await this.props.dispatch(deleteCancelMessage());
  }

  render() {
    let cancelRedirect = null;
    let redirectVar = null;

    const review_questions = this.props.reviewQuestions;

    if (review_questions.cancel && review_questions.cancel === "true") cancelRedirect = <Redirect to="/my_quizzes" />;

    let multipleChoiceQuestions = null;
    let fillinTheBlankQuestions = null;
    let trueOrFalseQuestions = null;

    let multipleChoiceQuestionsHeader = null;
    let fillinTheBlankQuestionsHeader = null;
    let trueOrFalseQuestionsHeader = null;

    let counter = 0;
    let alert = null;
    let cancelAlert = null;

    if (review_questions.message && review_questions.message !== "Success") {
      alert = (
        <Alert
          type="fail"
          message={review_questions.message}
          delete={this.clickDeleteAlert}
        />
      );
    }

    if (review_questions.cancel && review_questions.cancel === "false") {
      cancelAlert = (
        <Alert
          type="fail"
          message={"Failed to cancel quiz."}
          delete={this.clickDeleteCancelAlert}
        />
      );
    }

    if (review_questions.createQuizStatus)
      redirectVar = <Redirect to="/my_quizzes" />;
    else if (review_questions.questions) {
      if (review_questions.questions.mcq.length !== 0) {
        multipleChoiceQuestionsHeader = (
          <Card className={reviewQuestionsStyles.card_header}>
            <Card.Title className={reviewQuestionsStyles.title}>
              Multiple Choice Questions
            </Card.Title>
          </Card>
        );

        multipleChoiceQuestions = review_questions.questions.mcq.map(
          (multipleChoiceQuestion) => {
            counter++;
            return (
              <MultipleChoiceContainer
                key={counter}
                position={counter}
                multipleChoiceQuestion={multipleChoiceQuestion}
              />
            );
          }
        );
      }

      counter = 0;

      if (review_questions.questions.fbq.length !== 0) {
        fillinTheBlankQuestionsHeader = (
          <Card className={reviewQuestionsStyles.card_header}>
            <Card.Title className={reviewQuestionsStyles.title}>
              Fill-in the Blank Questions
            </Card.Title>
          </Card>
        );

        fillinTheBlankQuestions = review_questions.questions.fbq.map(
          (fillinTheBlankQuestion) => {
            counter++;
            return (
              <FillInTheBlankContainer
                key={counter}
                position={counter}
                fillinTheBlankQuestion={fillinTheBlankQuestion}
              />
            );
          }
        );
      }

      counter = 0;

      if (review_questions.questions.tfq.length !== 0) {
        trueOrFalseQuestionsHeader = (
          <Card className={reviewQuestionsStyles.card_header}>
            <Card.Title className={reviewQuestionsStyles.title}>
              True or False Questions
            </Card.Title>
          </Card>
        );

        trueOrFalseQuestions = review_questions.questions.tfq.map(
          (trueOrFalseQuestion) => {
            counter++;
            return (
              <TrueOrFalseContainer
                key={counter}
                position={counter}
                trueOrFalseQuestion={trueOrFalseQuestion}
              />
            );
          }
        );
      }
    }

    //if (review_questions.message == "message") alert;

    return (
      <>
        {redirectVar}
        {cancelRedirect}
        <NavigationBar></NavigationBar>
        <Container fluid className={reviewQuestionsStyles.page_header}>
          REVIEW QUESTIONS
        </Container>
        {alert}
        {cancelAlert}
        <Container className={reviewQuestionsStyles.container}>
          <h2 style={{ fontSize: "1rem", marginBottom: "10px" }}>
            Select the questions you would like to add to your quiz
          </h2>

          <Form
            id="review-questions-form"
            className={reviewQuestionsStyles.form}
          >
            {multipleChoiceQuestionsHeader}

            {multipleChoiceQuestions}

            {fillinTheBlankQuestionsHeader}

            {fillinTheBlankQuestions}

            {trueOrFalseQuestionsHeader}

            {trueOrFalseQuestions}
          </Form>

          <div style={{ float: "right" }}>
            <Button
              className={reviewQuestionsStyles.buttonCancel}
              onClick={this.clickCancel}
            >
              Cancel
            </Button>
            <Button
              className={reviewQuestionsStyles.buttonCreate}
              onClick={this.clickCreateQuiz}
            >
              Create Quiz
            </Button>
          </div>
        </Container>
        <Footer></Footer>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return { reviewQuestions: state.reviewQuestions };
};

const ReviewQuestions = connect(mapStateToProps)(ConnectedReviewQuestions);
export default ReviewQuestions;
