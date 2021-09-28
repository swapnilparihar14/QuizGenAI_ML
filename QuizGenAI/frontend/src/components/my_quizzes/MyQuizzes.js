import React from "react";
import { connect } from "react-redux";
 import { Container, Table } from "react-bootstrap";
import myQuizzesStyles from "./my_quizzes.module.css";
import NavigationBar from "../navbar/Navbar";
import { Redirect } from "react-router";
import Footer from "../footer/Footer";

import { resetReviewQuestions } from "../../actions/review_questions";

class ConnectedMyQuizzes extends React.Component {
  constructor(){
    super();
    this.state = {
      onQuizzesCreated: true,
      onQuizzesTaken: false
    }
  }

  onClickQuizzesCreated = e => {
    e.preventDefault();
    this.setState({
      onQuizzesCreated: true,
      onQuizzesTaken: false
    })
  }

  onClickQuizzesTaken = e => {
    e.preventDefault();
    this.setState({
      onQuizzesCreated: false,
      onQuizzesTaken: true
    })
  }

  clickDeleteAlert =  e => {
    e.preventDefault();
    if(this.props.reviewQuestions)
      this.props.dispatch(
        resetReviewQuestions(this.props.reviewQuestions)
      );
  }

  componentWillUnmount(){
    if(this.props.reviewQuestions)
      this.props.dispatch(
        resetReviewQuestions(this.props.reviewQuestions)
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

    if(this.props.reviewQuestions.createQuizStatus)
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

      // let title = null;

      // if(this.state.onQuizzesCreated){
      //   title = (<h1 className={myQuizzesStyles.title}>Quizzes Created</h1>)
      // }
      // else if ( this.state.onQuizzesTaken){
      //   title = (<h1 className={myQuizzesStyles.title}>Quizzes Taken</h1>)
      // }

      let table = null;

      if(this.state.onQuizzesCreated){
        table = ( <Table className={myQuizzesStyles.table} striped bordered hover >
          <thead>
            <tr>
              <th>#</th>
              <th>Quiz Name</th>
              <th>Created At</th>
              <th>Times Taken</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Quiz 1</td>
              <td>Aug 21, 2021</td>
              <td>5</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Quiz 2</td>
              <td>Sept 1, 2021</td>
              <td>2</td>
            </tr>
            <tr>
              <td>1</td>
              <td>Quiz 1</td>
              <td>Aug 21, 2021</td>
              <td>5</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Quiz 2</td>
              <td>Sept 1, 2021</td>
              <td>2</td>
            </tr>
            <tr>
              <td>1</td>
              <td>Quiz 1</td>
              <td>Aug 21, 2021</td>
              <td>5</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Quiz 2</td>
              <td>Sept 1, 2021</td>
              <td>2</td>
            </tr>
            <tr>
              <td>1</td>
              <td>Quiz 1</td>
              <td>Aug 21, 2021</td>
              <td>5</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Quiz 2</td>
              <td>Sept 1, 2021</td>
              <td>2</td>
            </tr>
            <tr>
              <td>1</td>
              <td>Quiz 1</td>
              <td>Aug 21, 2021</td>
              <td>5</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Quiz 2</td>
              <td>Sept 1, 2021</td>
              <td>2</td>
            </tr>
            <tr>
              <td>1</td>
              <td>Quiz 1</td>
              <td>Aug 21, 2021</td>
              <td>5</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Quiz 2</td>
              <td>Sept 1, 2021</td>
              <td>2</td>
            </tr>
          </tbody>
        </Table>)
      }
      else if ( this.state.onQuizzesTaken){
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
      <Container>
        <div className={this.state.onQuizzesCreated ? myQuizzesStyles.buttonSelected : myQuizzesStyles.buttonUnselected} onClick= {this.onClickQuizzesCreated} >Quizzes Created</div>
        <div className={this.state.onQuizzesTaken ? myQuizzesStyles.buttonSelected : myQuizzesStyles.buttonUnselected}  onClick= {this.onClickQuizzesTaken} >Quizzes Taken</div>
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
    reviewQuestions: state.reviewQuestions };
};

const MyQuizzes = connect(mapStateToProps)(ConnectedMyQuizzes);
export default MyQuizzes;