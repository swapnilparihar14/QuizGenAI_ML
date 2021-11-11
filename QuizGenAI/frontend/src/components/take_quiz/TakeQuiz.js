import React from "react";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import NavigationBar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { Container, Card, Form, Button } from "react-bootstrap";
import takeQuizStyles from "./take_quiz.module.css";

import { takeQuiz, resetTakeQuiz } from "../../actions/take_quiz";

class ConnectedTakeQuiz extends React.Component {
  constructor(){
    super();
    this.state = {
      privacy: "",
      quiz_name: "",
      password: ""
    }
  }

  handleChange = e =>{
    this.setState({ [e.target.id]: e.target.value });
  }

  clickTakeQuiz = async (e)=> {
    e.preventDefault();

    let id = localStorage.getItem("id");

    let data = {
      user_id: id,
      quiz_name: this.state.quiz_name,
      access_code: this.state.password
    }

    await this.props.dispatch(
      takeQuiz(data)
    );
  }

  clickDeleteAlert =  e => {
    e.preventDefault();
    if(this.props.takeQuiz)
      this.props.dispatch(
        resetTakeQuiz()
      );
  }

  render() {
    let redirectVar1 = null;
    let redirectVar2 = null;

    let auth = this.props.auth;
    let take_quiz = this.props.takeQuiz;

    // redirect based on successful signup
    if (auth.isAuthenticated === false) {
      const path = "/my_quizzes";
      redirectVar1 = <Redirect to={path} />;
    }

    //redirect when getting questions for the quiz
    if (take_quiz.quiz) {
      const path = "/take_quiz_questions";
      redirectVar2 = <Redirect to={path} />;
    }

    let alert = null;

    if(take_quiz.message){
      if(take_quiz.message === "Error")
        alert = (<Container  className={takeQuizStyles.alertFail}> 
          <p><span>Error:</span> Quiz could not be fetched. Retry.</p>
          <p style={{float: "right", cursor: "pointer"}}><span onClick={this.clickDeleteAlert}>X</span></p>
        </Container>);
      else
        alert = (<Container  className={takeQuizStyles.alertFail}> 
          <p><span>Error:</span> {take_quiz.message}</p>
          <p style={{float: "right", cursor: "pointer"}}><span onClick={this.clickDeleteAlert}>X</span></p>
        </Container>);
    }

    let infoFields = "";
    if (this.state.privacy === "private") {
      infoFields = (<>
        {/* Enter Quiz Name */}
        <Form.Group controlId="quiz_name">
            <Form.Label className={takeQuizStyles.labels}>Quiz Name</Form.Label>
              <Form.Control
                onChange={this.handleChange}
              />
          </Form.Group>
          
          {/* Enter Password */}
          <Form.Group controlId="password">
            <Form.Label className={takeQuizStyles.labels}>Password</Form.Label>
              <Form.Control
                onChange={this.handleChange}
              />
          </Form.Group>
        </>
      );
    }
    else if (this.state.privacy === "public"){
      infoFields = (<>
        {/* Enter Quiz Name */}
        <Form.Group controlId="quiz_name">
            <Form.Label className={takeQuizStyles.labels}>Quiz Name</Form.Label>
              <Form.Control
                onChange={this.handleChange}
              />
          </Form.Group>
        </>
      );
    }
    
    return (<>
      {redirectVar1}
      {redirectVar2}
      <NavigationBar></NavigationBar>
      <Container fluid className={takeQuizStyles.page_header}>TAKE QUIZ</Container>
      {alert}
      <Container className={takeQuizStyles.container}> 
        <Form id="take-existing-quiz-form" className={takeQuizStyles.form}>
          
          <Card className={takeQuizStyles.card_header}>
            <Form.Group controlId="privacy" style={{margin: "0"}}>
              <Form.Label className={takeQuizStyles.labels}>Public or Private</Form.Label>
              <Form.Control
                as="select"
                onChange={this.handleChange}
                name="timed"
                style={{marginBottom: "10px"}}
              >
                <option hidden>{"Select"} </option>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </Form.Control>
            </Form.Group>

            {infoFields}
          </Card>
        </Form>

        <div style={{float: "right"}}>
          <Button className={takeQuizStyles.buttons} onClick= {this.clickTakeQuiz} >Take Quiz</Button>
        </div>
      </Container>
      <Footer></Footer>
      </>
    );
  }
}

const mapStateToProps = state => {
  return { auth: state.auth,
    takeQuiz: state.takeQuiz };
};

const TakeQuiz = connect(mapStateToProps)(ConnectedTakeQuiz);
export default TakeQuiz;