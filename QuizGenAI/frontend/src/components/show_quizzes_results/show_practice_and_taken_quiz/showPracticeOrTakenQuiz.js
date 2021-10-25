import React from "react";
import { connect } from "react-redux";
import NavigationBar from "../../navbar/Navbar";
import Footer from "../../footer/Footer";
import { Container, Card, Form } from "react-bootstrap";
import { Redirect } from "react-router";
import showPracticeOrTakenQuizStyles from "./showPracticeOrTakenQuizStyles.module.css";
import MultipleChoiceContainer from "./MultipleChoiceContainer";
import FillInTheBlankContainer from "./FillInTheBlankContainer";
import TrueOrFalseContainer from "./TrueOrFalseContainer";

import { resetShowQuiz } from "../../../actions/my_quizzes";

class ConnectedShowPracticeOrTakenQuiz extends React.Component {
  constructor(){
    super();
    this.state = {
    }
  }

  async componentDidMount() {
    window.scrollTo(0, 0);

    // const quizId = this.props.match.params.quizid;
    // console.log("HERE", quizId)

    // await this.props.dispatch(
    //   getCreatedQuiz(quizId)
    // );
  }

  componentWillUnmount(){
    if(this.props.showSpecificQuiz)
      this.props.dispatch(
        resetShowQuiz()
      );
  }

  render() {
    let redirectVar = null;
    const auth = this.props.auth;

    if (auth.isAuthenticated === false) {
      const path = "/";
      redirectVar = <Redirect to={path} />;
    }

    const show_quiz = this.props.showSpecificQuiz;

    let multipleChoiceQuestions = null;
    let fillinTheBlankQuestions = null;
    let trueOrFalseQuestions = null;

    let multipleChoiceQuestionsHeader = null;
    let fillinTheBlankQuestionsHeader = null;
    let trueOrFalseQuestionsHeader = null;

    let counter = 0;

    if(show_quiz.questions){
      if (show_quiz.questions.mcq.length !== 0){
        multipleChoiceQuestionsHeader = (<Card className={showPracticeOrTakenQuizStyles.card_header}>
          <Card.Title className={showPracticeOrTakenQuizStyles.title}>Multiple Choice Questions</Card.Title>
        </Card>);

        multipleChoiceQuestions = show_quiz.questions.mcq.map((multipleChoiceQuestion) => {
          counter++;
          return (
            <MultipleChoiceContainer
              key={counter}
              position={counter}
              multipleChoiceQuestion={multipleChoiceQuestion}
            />
          )
        });
      }

      counter = 0;

      if (show_quiz.questions.fbq.length !== 0){
        fillinTheBlankQuestionsHeader=( <Card className={showPracticeOrTakenQuizStyles.card_header}>
          <Card.Title className={showPracticeOrTakenQuizStyles.title}>Fill-in the Blank Questions</Card.Title>
        </Card>);

        fillinTheBlankQuestions = show_quiz.questions.fbq.map((fillinTheBlankQuestion) => {
          counter++;
          return (
            <FillInTheBlankContainer
              key={counter}
              position={counter}
              fillinTheBlankQuestion={fillinTheBlankQuestion}
            />
          )
        });
      }

      counter = 0;

      if (show_quiz.questions.tfq.length !== 0){
        trueOrFalseQuestionsHeader=(<Card className={showPracticeOrTakenQuizStyles.card_header}>
          <Card.Title className={showPracticeOrTakenQuizStyles.title}>True or False Questions</Card.Title>
        </Card>);

        trueOrFalseQuestions = show_quiz.questions.tfq.map((trueOrFalseQuestion) => {
          counter++;
          return (
            <TrueOrFalseContainer
              key={counter}
              position={counter}
              trueOrFalseQuestion={trueOrFalseQuestion}
            />
          )
        });
      }
    } 

    return (<>
      {redirectVar}
      <NavigationBar></NavigationBar>
      <Container className={showPracticeOrTakenQuizStyles.container}> 

        <Form className={showPracticeOrTakenQuizStyles.form}>
          
          {multipleChoiceQuestionsHeader}

          {multipleChoiceQuestions}

          {fillinTheBlankQuestionsHeader}

          {fillinTheBlankQuestions}

          {trueOrFalseQuestionsHeader}

          {trueOrFalseQuestions}
        </Form>
      </Container>
      <Footer></Footer>
      </>
    );
  }
}

const mapStateToProps = state => {
  return { auth: state.auth,
    showSpecificQuiz: state.showSpecificQuiz };
};

const ShowPracticeOrTakenQuiz = connect(mapStateToProps)(ConnectedShowPracticeOrTakenQuiz);
export default ShowPracticeOrTakenQuiz;