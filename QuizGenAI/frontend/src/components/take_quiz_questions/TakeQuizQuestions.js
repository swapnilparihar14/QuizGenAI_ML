import React from "react";
import { connect } from "react-redux";
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
     questions: [
        {
          question: "Which company owns ABC?",
          type: "mcq",
          answers: ["Walt Disney Company", "CNN", "Facebook", "Google"],
          correctAnswer: 1 
        },
        {
          question: "Which city does the Hollywood district belong to?",
          type: "mcq",
          answers: ["New York", "Los Angeles", "San Jose", "San Francisco"],
          correctAnswer: 2 
        },
        {
          question: "The ________________ newspaper defined southern California.",
          type: "fbq",
          correctAnswer: "Los Angeles Times" 
        },
        {
          question: "Usually all of Southern California have ____________ climate.",
          type: "fbq",
          correctAnswer: "Mediterranean"
        },
        {
          question: "Southern California is often abbreviated SoCal.",
          type: "tfq",
          correctAnswer: "true"
        },
        {
          question: "Northern California is a major economic center for the state of California and the United States.",
          type: "fbq",
          correctAnswer: "false"
        }
      ],
      questionCounter: 0,
      timed: "timed",
      hours: 1,
      minutes: 10,
    }
  }

  clickNext = () => {
    this.setState((prevState) => ({ questionCounter: prevState.questionCounter + 1  }));
  }

  clickSubmit = () => {
    alert('YAY');
  }

  render() {
    let question = null;
    let questions = this.state.questions;
    let questionCounter = this.state.questionCounter;

    if(questions[questionCounter] !== undefined) {
      if(questions[questionCounter].type === "mcq")
        question = (
          <MultipleChoiceContainer
            // key={job._id}
            // jobid={job._id}
            // id={this.state.id}
            multipleChoiceQuestion={questions[questionCounter]}
          />
        );
      else if(questions[questionCounter].type === "fbq")
        question = (
          <FillInTheBlankContainer
            // key={job._id}
            // jobid={job._id}
            // id={this.state.id}
            fillinTheBlankQuestion={questions[questionCounter]}
          />
        );
      else if(questions[questionCounter].type === "tfq")
        question = (
          <TrueOrFalseContainer
            // key={job._id}
            // jobid={job._id}
            // id={this.state.id}
            trueOrFalseQuestion={questions[questionCounter]}
          />
        );
    }

    let button = null;

    if(questionCounter === questions.length-1){
      button =  <Button className={takeQuizQuestionsStyles.buttons} onClick= {this.clickSubmit} >Submit</Button>
    } else {
      button =  <Button className={takeQuizQuestionsStyles.buttons} onClick= {this.clickNext} >Next</Button>
    }
  
    return (<>
      <NavigationBar boolLoggedIn={true}></NavigationBar>
      <Container fluid className={takeQuizQuestionsStyles.page_header}>QUESTION {questionCounter + 1} OUT OF {questions.length} </Container>
      <Container className={takeQuizQuestionsStyles.container}> 

        <Form id="review-questions-form" className={takeQuizQuestionsStyles.form}>    
          {question}
        </Form>

        <div style={{float: "right"}}>
          {button}
        </div>
      </Container>
      <Footer boolLoggedIn={true}></Footer>
      </>
    );
  }
}

const mapStateToProps = (state) => ({});
const TakeQuizQuestions = connect(mapStateToProps)(ConnectedTakeQuizQuestions);
export default TakeQuizQuestions;