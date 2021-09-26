import React from "react";
import { connect } from "react-redux";
import { Col, Card } from "react-bootstrap";
import FillInTheBlankContainerStyles from "./fillin_the_blank_container.module.css";
import { RiCheckboxCircleLine } from "react-icons/ri";

import { selectQuestion } from "../../actions/review_questions";

class ConnectedFillInTheBlankContainer extends React.Component {
  constructor(){
    super();
    this.state = {
    }
  }

  setSelected = e =>{
    e.preventDefault();
    this.props.dispatch(
      selectQuestion("fbq", this.props.position-1)
    );
  }

  render() {
    let counter = 0;
    let letters = ["A. ", "B. ", "C. ", "D. "];

    let answers = this.props.fillinTheBlankQuestion.options.map((answer) => { 
      counter++;
      if(counter === this.props.fillinTheBlankQuestion.correctAnswer)
        return (<>
          <h6 className={FillInTheBlankContainerStyles.correct_answers} key={"fillinTheBlankAnswers"+counter}>{letters[counter-1]}{answer}</h6>
          <RiCheckboxCircleLine key={"fillinTheBlankAnswersSymbol"+counter} style={{ color: "var(--green)", paddingBottom: "2px"}}></RiCheckboxCircleLine>
          </>
        )
      else
        return (
          <h6 className={FillInTheBlankContainerStyles.answers} key={"fillinTheBlankAnswers"+counter}>{letters[counter-1]}{answer}</h6>
        )
    });

    return (
      <Card onClick= {this.setSelected} className={this.props.reviewQuestions.questions.fbq[this.props.position-1].isSelected ? FillInTheBlankContainerStyles.cardSelected: FillInTheBlankContainerStyles.card}>
        <Col style={{textAlign: "left"}}>
            <h4 className={FillInTheBlankContainerStyles.questions}>{this.props.fillinTheBlankQuestion.question}</h4>
            {answers}
        </Col>
    </Card>
    );
  }
}

const mapStateToProps = state => {
  return { reviewQuestions: state.reviewQuestions };
};

const FillInTheBlankContainer = connect(mapStateToProps)(ConnectedFillInTheBlankContainer);
export default FillInTheBlankContainer;