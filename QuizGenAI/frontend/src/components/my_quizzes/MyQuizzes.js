import React from "react";
import { connect } from "react-redux";
import { Container, Table } from "react-bootstrap";
import myQuizzesStyles from "./my_quizzes.module.css";
import NavigationBar from "../navbar/Navbar";
import { Link } from "react-router-dom";
import { Redirect } from "react-router";
import Footer from "../footer/Footer";
import Alert from "../alert/Alert";

import { resetReviewQuestions } from "../../actions/review_questions";
import {
  getCreatedQuizzes,
  getCreatedQuiz,
  getPracticeQuizzes,
  getPracticeQuiz,
  getTakenQuizzes,
  getTakenQuiz,
  resetGetQuizzes,
} from "../../actions/my_quizzes";

class ConnectedMyQuizzes extends React.Component {
  constructor() {
    super();
    this.state = {
      onCreatedQuizzes: true,
      onTakenQuizzes: false,
      onPracticeQuizzes: false,
    };
  }

  async componentDidMount() {
    let id = localStorage.getItem("id");

    await this.props.dispatch(getCreatedQuizzes(id));
  }

  onClickCreatedQuizzes = async (e) => {
    e.preventDefault();
    let id = localStorage.getItem("id");

    await this.props.dispatch(getCreatedQuizzes(id));

    this.setState({
      onCreatedQuizzes: true,
      onTakenQuizzes: false,
      onPracticeQuizzes: false,
    });
  };

  onClickTakenQuizzes = async (e) => {
    e.preventDefault();
    let id = localStorage.getItem("id");

    await this.props.dispatch(getTakenQuizzes(id));

    this.setState({
      onCreatedQuizzes: false,
      onTakenQuizzes: true,
      onPracticeQuizzes: false,
    });
  };

  onClickPracticeQuizzes = async (e) => {
    e.preventDefault();
    let id = localStorage.getItem("id");

    await this.props.dispatch(getPracticeQuizzes(id));

    this.setState({
      onCreatedQuizzes: false,
      onTakenQuizzes: false,
      onPracticeQuizzes: true,
    });
  };

  clickDeleteAlert = (e) => {
    console.log("Hello");
    e.preventDefault();
    if (this.props.reviewQuestions) this.props.dispatch(resetReviewQuestions());
  };

  clickDeleteQuizzesAlert = (e) => {
    e.preventDefault();
    if (this.props.listQuizzes) this.props.dispatch(resetGetQuizzes());
  };

  getCreatedQuiz = async (quizId) => {
    await this.props.dispatch(getCreatedQuiz(quizId));
  };

  getPracticeQuiz = async (quizId) => {
    let id = localStorage.getItem("id");

    let data = {
      quiz_id: quizId,
      user_id: id,
    };

    await this.props.dispatch(getPracticeQuiz(data));
  };

  getTakenQuiz = async (quizId) => {
    let id = localStorage.getItem("id");

    let data = {
      quiz_id: quizId,
      user_id: id,
    };

    await this.props.dispatch(getTakenQuiz(data));
  };

  componentWillUnmount() {
    if (this.props.reviewQuestions) this.props.dispatch(resetReviewQuestions());

    if (this.props.listQuizzes) this.props.dispatch(resetGetQuizzes());
  }

  render() {
    // redirect based on authentication
    let redirectVar = null;

    const auth = this.props.auth;

    if (auth.isAuthenticated === false) {
      const path = "/";
      redirectVar = <Redirect to={path} />;
    }

    let alert = null;

    if (this.props.reviewQuestions.createQuizStatus) {
      if (this.props.reviewQuestions.createQuizStatus === "success") {
        let type = "success";
        let message = "Quiz Created.";
        alert = (
          <Alert
            type={type}
            message={message}
            delete={this.clickDeleteAlert}
          ></Alert>
        );
      }
      if (this.props.reviewQuestions.createQuizStatus === "fail") {
        let type = "fail";
        let message = "Quiz could not be created. Retry.";
        alert = (
          <Alert
            type={type}
            message={message}
            delete={this.clickDeleteAlert}
          ></Alert>
        );
      }
    }

    let table = null;
    let counter = 0;

    let createdQuizzesRows = null;
    let practiceQuizzesRows = null;
    let takenQuizzesRows = null;

    let alert2 = null;

    if (this.props.listQuizzes.quizzes) {
      if (this.state.onCreatedQuizzes)
        createdQuizzesRows = this.props.listQuizzes.quizzes.map(
          (createdQuizzesRow) => {
            counter++;
            return (
              <tr key={counter} position={counter}>
                <td>
                  <Link
                    className={myQuizzesStyles.link}
                    to={`/my_quizzes/created/${createdQuizzesRow.id}`}
                    onClick={(e) => {
                      this.getCreatedQuiz(createdQuizzesRow.id);
                    }}
                  >
                    {createdQuizzesRow.id}
                  </Link>
                </td>
                <td>{createdQuizzesRow.name}</td>
                <td>{createdQuizzesRow.quiz_type}</td>
                <td>
                  <p className={myQuizzesStyles.ac}>
                    {createdQuizzesRow.access_code}
                  </p>
                </td>
                <td>{createdQuizzesRow.no_of_questions}</td>
                <td>{createdQuizzesRow.duration}</td>
                <td>{createdQuizzesRow.created_on}</td>
              </tr>
            );
          }
        );
      else if (this.state.onTakenQuizzes)
        takenQuizzesRows = this.props.listQuizzes.quizzes.map(
          (takenQuizzesRow) => {
            counter++;
            return (
              <tr key={counter} position={counter}>
                <td>
                  <Link
                    className={myQuizzesStyles.link}
                    to={`/my_quizzes/taken/${takenQuizzesRow.id}`}
                    onClick={(e) => {
                      this.getTakenQuiz(takenQuizzesRow.id);
                    }}
                  >
                    {takenQuizzesRow.id}
                  </Link>
                </td>
                <td>{takenQuizzesRow.name}</td>
                <td>{takenQuizzesRow.score}</td>
                <td>{takenQuizzesRow.no_of_questions}</td>
                <td>{takenQuizzesRow.duration}</td>
                <td>{takenQuizzesRow.taken_on}</td>
              </tr>
            );
          }
        );
      else if (this.state.onPracticeQuizzes)
        practiceQuizzesRows = this.props.listQuizzes.quizzes.map(
          (practiceQuizzesRow) => {
            counter++;
            return (
              <tr key={counter} position={counter}>
                <td>
                  <Link
                    className={myQuizzesStyles.link}
                    to={`/my_quizzes/practice/${practiceQuizzesRow.id}`}
                    onClick={(e) => {
                      this.getPracticeQuiz(practiceQuizzesRow.id);
                    }}
                  >
                    {practiceQuizzesRow.id}
                  </Link>
                </td>
                <td>{practiceQuizzesRow.name}</td>
                <td>{practiceQuizzesRow.score}</td>
                <td>{practiceQuizzesRow.no_of_questions}</td>
                <td>{practiceQuizzesRow.duration}</td>
                <td>{practiceQuizzesRow.taken_on}</td>
              </tr>
            );
          }
        );
    } else if (this.props.listQuizzes.message) {
      let type = "fail";
      let message = "Could not fetch quizzes.";
      alert2 = (
        <Alert
          type={type}
          message={message}
          delete={this.clickDeleteQuizzesAlert}
        ></Alert>
      );
    }

    if (this.state.onCreatedQuizzes) {
      table = (
        <Table className={myQuizzesStyles.table} striped bordered hover>
          <thead>
            <tr>
              <th>Quiz ID</th>
              <th>Quiz Name</th>
              <th>Quiz Type</th>
              <th style={{ width: "200px" }}>Password</th>
              <th>No. of Questions</th>
              <th>Duration</th>
              <th>Created On</th>
            </tr>
          </thead>
          <tbody>{createdQuizzesRows}</tbody>
        </Table>
      );
    } else if (this.state.onPracticeQuizzes) {
      table = (
        <Table className={myQuizzesStyles.table} striped bordered hover>
          <thead>
            <tr>
              <th>Quiz ID</th>
              <th>Quiz Name</th>
              <th>Score</th>
              <th>No. of Questions</th>
              <th>Duration</th>
              <th>Taken On</th>
            </tr>
          </thead>
          <tbody>{practiceQuizzesRows}</tbody>
        </Table>
      );
    } else if (this.state.onTakenQuizzes) {
      table = (
        <Table className={myQuizzesStyles.table} striped bordered hover>
          <thead>
            <tr>
              <th>Quiz ID</th>
              <th>Quiz Name</th>
              <th>Score</th>
              <th>No. of Questions</th>
              <th>Duration</th>
              <th>Taken On</th>
            </tr>
          </thead>
          <tbody>{takenQuizzesRows}</tbody>
        </Table>
      );
    }

    return (
      <>
        {redirectVar}
        <NavigationBar></NavigationBar>
        {alert}
        {alert2}
        <Container fluid>
          <div
            className={
              this.state.onCreatedQuizzes
                ? myQuizzesStyles.buttonSelected
                : myQuizzesStyles.buttonUnselected
            }
            onClick={this.onClickCreatedQuizzes}
          >
            Created Quizzes
          </div>
          <div
            className={
              this.state.onPracticeQuizzes
                ? myQuizzesStyles.buttonSelected
                : myQuizzesStyles.buttonUnselected
            }
            onClick={this.onClickPracticeQuizzes}
          >
            Practice Quizzes
          </div>
          <div
            className={
              this.state.onTakenQuizzes
                ? myQuizzesStyles.buttonSelected
                : myQuizzesStyles.buttonUnselected
            }
            onClick={this.onClickTakenQuizzes}
          >
            Taken Quizzes
          </div>
          {/* {title} */}
          <div className={myQuizzesStyles.tableContainer}>{table}</div>
        </Container>
        <Footer></Footer>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    reviewQuestions: state.reviewQuestions,
    listQuizzes: state.listQuizzes,
  };
};

const MyQuizzes = connect(mapStateToProps)(ConnectedMyQuizzes);
export default MyQuizzes;
