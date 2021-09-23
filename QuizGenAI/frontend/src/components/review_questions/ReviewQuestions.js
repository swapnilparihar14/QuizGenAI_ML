import React from "react";
import { connect } from "react-redux";
import NavigationBar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { Container, Card, Button, Form } from "react-bootstrap";
import reviewQuestionsStyles from "./review_questions.module.css";
import MultipleChoiceContainer from "./MultipleChoiceContainer";
import FillInTheBlankContainer from "./FillInTheBlankContainer";
import TrueOrFalseContainer from "./TrueOrFalseContainer";

class ConnectedReviewQuestions extends React.Component {
  constructor(){
    super();
    this.state = {
      mcquestions: [
        {
          question: "Which company owns ABC?",
          answers: ["Walt Disney Company", "CNN", "Facebook", "Google"],
          correctAnswer: 1 
        },
        {
          question: "Which city does the Hollywood district belong to?",
          answers: ["New York", "Los Angeles", "San Jose", "San Francisco"],
          correctAnswer: 2 
        }
      ],
      fbquestions: [
        {
          question: "The ________________ newspaper defined southern California.",
          correctAnswer: "Los Angeles Times" 
        },
        {
          question: "Usually all of Southern California have ____________ climate.",
          correctAnswer: "Mediterranean"
        }
      ],
      tfquestions: [
        {
          question: "Southern California is often abbreviated SoCal.",
          correctAnswer: "true"
        },
        {
          question: "Northern California is a major economic center for the state of California and the United States.",
          correctAnswer: "false"
        }
      ]
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  handleChange = e =>{
    this.setState({ [e.target.id]: e.target.value });
  }

  render() {
    let multipleChoiceQuestions = null;
    let fillinTheBlankQuestions = null;
    let trueOrFalseQuestions = null;

    let multipleChoiceQuestionsHeader = null;
    let fillinTheBlankQuestionsHeader = null;
    let trueOrFalseQuestionsHeader = null;

    const review_questions = this.props.reviewQuestions;
    let counter = 0;

    if (review_questions.questions.mcq.lenght !== 0){
      multipleChoiceQuestionsHeader = (<Card className={reviewQuestionsStyles.card_header}>
        <Card.Title className={reviewQuestionsStyles.title}>Multiple Choice Questions</Card.Title>
      </Card>);

      multipleChoiceQuestions = review_questions.questions.mcq.map((multipleChoiceQuestion) => {
        counter++;
        return (
          <MultipleChoiceContainer
            key={"multipleChoiceQuestion"+counter}
            multipleChoiceQuestion={multipleChoiceQuestion}
          />
        )
      });
    }

    counter = 0;

    if (review_questions.questions.fbq.lenght !== 0){
      fillinTheBlankQuestionsHeader=( <Card className={reviewQuestionsStyles.card_header}>
        <Card.Title className={reviewQuestionsStyles.title}>Fill-in the Blank Questions</Card.Title>
      </Card>);

      fillinTheBlankQuestions = review_questions.questions.fbq.map((fillinTheBlankQuestion) => {
        counter++;
        return (
          <FillInTheBlankContainer
            key={"fillinTheBlankQuestion"+counter}
            fillinTheBlankQuestion={fillinTheBlankQuestion}
          />
        )
      });
    }

    counter = 0;

    if (review_questions.questions.tfq.lenght !== 0){
      trueOrFalseQuestionsHeader=(<Card className={reviewQuestionsStyles.card_header}>
        <Card.Title className={reviewQuestionsStyles.title}>True or False Questions</Card.Title>
      </Card>);

      trueOrFalseQuestions = review_questions.questions.tfq.map((trueOrFalseQuestion) => {
        counter++;
        return (
          <TrueOrFalseContainer
            key={"trueOrFalseQuestion"+counter}
            trueOrFalseQuestion={trueOrFalseQuestion}
          />
        )
      });
    }

    return (<>
      <NavigationBar></NavigationBar>
      <Container fluid className={reviewQuestionsStyles.page_header}>REVIEW QUESTIONS</Container>
      <Container className={reviewQuestionsStyles.container}> 

        <h2 style={{fontSize: "1rem", marginBottom: "10px"}}>Select the questions you would like to add to your quiz</h2>

        <Form id="review-questions-form" className={reviewQuestionsStyles.form}>
          
          {multipleChoiceQuestionsHeader}

          {multipleChoiceQuestions}

          {fillinTheBlankQuestionsHeader}

          {fillinTheBlankQuestions}

          {trueOrFalseQuestionsHeader}

          {trueOrFalseQuestions}
        </Form>

        <div style={{float: "right"}}>
          <Button className={reviewQuestionsStyles.buttons} onClick= {this.clickCreateQuiz} >Create Quiz</Button>
        </div>
      </Container>
      <Footer></Footer>
      </>
    );
  }
}

const mapStateToProps = state => {
  return { reviewQuestions: state.reviewQuestions };
};

const ReviewQuestions = connect(mapStateToProps)(ConnectedReviewQuestions);
export default ReviewQuestions;