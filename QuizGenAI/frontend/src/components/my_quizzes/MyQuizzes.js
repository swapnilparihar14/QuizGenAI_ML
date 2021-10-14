import React from "react";
import { connect } from "react-redux";
import { Container, Table } from "react-bootstrap";
import myQuizzesStyles from "./my_quizzes.module.css";
import NavigationBar from "../navbar/Navbar";
import { Link } from "react-router-dom";
import { Redirect } from "react-router";
import Footer from "../footer/Footer";

import { resetReviewQuestions } from "../../actions/review_questions";
import { getCreatedQuizzes, getCreatedQuiz } from "../../actions/my_quizzes";

class ConnectedMyQuizzes extends React.Component {
  constructor(){
    super();
    this.state = {
      onCreatedQuizzes: true,
      onTakenQuizzes: false,
      onPracticeQuizzes: false
    }
  }

  async componentDidMount() {  
    let id = localStorage.getItem("id");

    await this.props.dispatch(
      getCreatedQuizzes(id)
    );
  }

  onClickCreatedQuizzes = e => {
    e.preventDefault();
    this.setState({
      onCreatedQuizzes: true,
      onTakenQuizzes: false,
      onPracticeQuizzes: false
    })
  }

  onClickTakenQuizzes = e => {
    e.preventDefault();
    this.setState({
      onCreatedQuizzes: false,
      onTakenQuizzes: true,
      onPracticeQuizzes: false
    })
  }

  onClickPracticeQuizzes = e => {
    e.preventDefault();
    this.setState({
      onCreatedQuizzes: false,
      onTakenQuizzes: false,
      onPracticeQuizzes: true
    })
  }

  clickDeleteAlert =  e => {
    e.preventDefault();
    if(this.props.reviewQuestions)
      this.props.dispatch(
        resetReviewQuestions()
      );
  }

  getCreatedQuiz = async (quizId) => {
    await this.props.dispatch(
      getCreatedQuiz(quizId)
    );
  }

  componentWillUnmount(){
    if(this.props.reviewQuestions)
      this.props.dispatch(
        resetReviewQuestions()
      );
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

    if(this.props.reviewQuestions.createQuizStatus){
      if(this.props.reviewQuestions.createQuizStatus === "success")
        alert = (<Container  className={myQuizzesStyles.alertSuccess}> 
          <p><span>Success:</span> Quiz Created</p>
          <p style={{float: "right", cursor: "pointer"}}><span onClick={this.clickDeleteAlert}>X</span></p>
        </Container>);
      if(this.props.reviewQuestions.createQuizStatus === "fail")
      alert = (<Container  className={myQuizzesStyles.alertFail}> 
        <p><span>Error:</span> Quiz could not be created. Retry.</p>
        <p style={{float: "right", cursor: "pointer"}}><span onClick={this.clickDeleteAlert}>X</span></p>
      </Container>);
    }

    let table = null;
    let counter = 0;

    let createdQuizzesRows = null;

    if (this.props.createdQuizzes.quizzes){
      
      createdQuizzesRows = this.props.createdQuizzes.quizzes.map((createdQuizzesRow) => {
        counter++;
        return (
          <tr
            key={counter}
            position={counter}
          >
            <td><Link className={myQuizzesStyles.link} to={`/my_quizzes/${createdQuizzesRow.id}`} onClick={(e) => {this.getCreatedQuiz(createdQuizzesRow.id)}}>{createdQuizzesRow.id}</Link></td>
            <td>{createdQuizzesRow.name}</td>
            <td>{createdQuizzesRow.quiz_type}</td>
            <td><p className={myQuizzesStyles.ac}>{createdQuizzesRow.access_code}</p></td>
            <td>{createdQuizzesRow.times_taken}</td>
            <td>{createdQuizzesRow.created_on}</td>
          </tr>
        )
      });
    }

    if(this.state.onCreatedQuizzes){
      table = ( <Table className={myQuizzesStyles.table} striped bordered hover >
        <thead>
          <tr>
            <th>Quiz ID</th>
            <th>Quiz Name</th>
            <th>Quiz Type</th>
            <th style={{width: "200px"}}>Password</th>
            <th>Times Taken</th>
            <th>Created On</th>
          </tr>
        </thead>
        <tbody>
          {createdQuizzesRows}
        </tbody>
      </Table>)
    }
    else if ( this.state.onTakenQuizzes){
      table = (<Table className={myQuizzesStyles.table} striped bordered hover >
        <thead>
          <tr>
            <th>#</th>
            <th>Quiz Name</th>
            <th>Created At</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Quiz 1</td>
            <td>Aug 21, 2021</td>
            <td>20</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Quiz 2</td>
            <td>Sept 1, 2021</td>
            <td>10</td>
          </tr>
        </tbody>
      </Table>)
    }
    
    return (
      <>
      {redirectVar}
      <NavigationBar></NavigationBar> 
      {alert}
      <Container fluid>
        <div className={this.state.onCreatedQuizzes ? myQuizzesStyles.buttonSelected : myQuizzesStyles.buttonUnselected} onClick= {this.onClickCreatedQuizzes} >Quizzes Created</div>
        <div className={this.state.onTakenQuizzes ? myQuizzesStyles.buttonSelected : myQuizzesStyles.buttonUnselected}  onClick= {this.onClickTakenQuizzes} >Quizzes Taken</div>
        {/* {title} */}
        <div className={myQuizzesStyles.tableContainer}>
          {table}
        </div>
      </Container>
      <Footer></Footer>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {  auth: state.auth,
    reviewQuestions: state.reviewQuestions,
    createdQuizzes: state.createdQuizzes };
};

const MyQuizzes = connect(mapStateToProps)(ConnectedMyQuizzes);
export default MyQuizzes;