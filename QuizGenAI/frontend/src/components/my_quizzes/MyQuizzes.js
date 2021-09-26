import React from "react";
import { connect } from "react-redux";
 import { Container } from "react-bootstrap";
import myQuizzesStyles from "./my_quizzes.module.css";
import NavigationBar from "../navbar/Navbar";
import Footer from "../footer/Footer";

import { resetReviewQuestions } from "../../actions/review_questions";

class ConnectedMyQuizzes extends React.Component {


  clickDeleteAlert =  e => {
    e.preventDefault();
    this.props.dispatch(
      resetReviewQuestions(this.props.reviewQuestions)
    );
  }

  componentWillUnmount(){
    this.clickDeleteAlert();
  }

  render() {
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
    
    return (
      <>
      <NavigationBar></NavigationBar> 
      {alert}
      <h1>My Quizzes: My Quizzes Created and My Quizzes Taken</h1>
      <Footer></Footer>
      </>
    );
  }
}

const mapStateToProps = state => {
  return { reviewQuestions: state.reviewQuestions };
};

const MyQuizzes = connect(mapStateToProps)(ConnectedMyQuizzes);
export default MyQuizzes;