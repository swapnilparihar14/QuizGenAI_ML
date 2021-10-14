import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import NavigationBar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { Container, Button, Form } from "react-bootstrap";
import takeQuizQuestionsStyles from "./take_quiz_questions.module.css";
import MultipleChoiceContainer from "./MultipleChoiceContainer";
import FillInTheBlankContainer from "./FillInTheBlankContainer";
import TrueOrFalseContainer from "./TrueOrFalseContainer";

class ConnectedTakeQuizQuestions extends React.Component {
  constructor(){
    super();
    this.state = {
      questionCounter: 0
    }
  }

  clickNext = () => {
    this.setState((prevState) => ({ questionCounter: prevState.questionCounter + 1  }));
  }

  clickSubmit = () => {
    alert('YAY');

  }

  render() {
    let redirectVar = null;

    let auth = this.props.auth;
    let take_quiz = this.props.takeQuiz;

    // redirect based on successful signup
    if (auth.isAuthenticated === false) {
      const path = "/my_quizzes";
      redirectVar = <Redirect to={path} />;
    }

    let question = null;
    let questionCounter = this.state.questionCounter;

    if(take_quiz.quiz.questions.length !== 0) {
      if(questionCounter <= take_quiz.quiz.questions.length){
        if(take_quiz.quiz.questions[questionCounter].type === "mcq")
          question = (
            <MultipleChoiceContainer
              key={questionCounter}
              multipleChoiceQuestion={take_quiz.quiz.questions[questionCounter]}
            />
          );
        else if(take_quiz.quiz.questions[questionCounter].type === "fbq")
          question = (
            <FillInTheBlankContainer
              key={questionCounter}
              fillinTheBlankQuestion={take_quiz.quiz.questions[questionCounter]}
            />
          );
        else if(take_quiz.quiz.questions[questionCounter].type === "tfq")
          question = (
            <TrueOrFalseContainer
              key={questionCounter}  
              trueOrFalseQuestion={take_quiz.quiz.questions[questionCounter]}
            />
          );
      }
    }

    let button = null;

    if(questionCounter === take_quiz.quiz.questions.length-1){
      button =  <Button className={takeQuizQuestionsStyles.buttons} onClick= {this.clickSubmit} >Submit</Button>
    } else {
      button =  <Button className={takeQuizQuestionsStyles.buttons} onClick= {this.clickNext} >Next</Button>
    }
  
    return (<>
      {redirectVar}
      <Container fluid className={takeQuizQuestionsStyles.page_header}>QUESTION {questionCounter + 1} OUT OF {take_quiz.quiz.questions.length} </Container>
      <Container className={takeQuizQuestionsStyles.container}> 

        <Form id="review-questions-form" className={takeQuizQuestionsStyles.form}>    
          {question}
        </Form>

        <div style={{float: "right"}}>
          {button}
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

const TakeQuizQuestions = connect(mapStateToProps)(ConnectedTakeQuizQuestions);
export default TakeQuizQuestions;