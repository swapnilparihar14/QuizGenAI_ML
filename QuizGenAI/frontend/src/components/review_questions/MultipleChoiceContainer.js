import React from "react";
import { connect } from "react-redux";
import { Col, Card } from "react-bootstrap";
import multipleChoiceContainerStyles from "./multiple_choice_container.module.css";
import { RiCheckboxCircleLine } from "react-icons/ri";

import { selectQuestion } from "../../actions/review_questions";

class ConnectedMultipleChoiceContainer extends React.Component {
  constructor(props){
    super();
    this.state = {
    }
  }

  setSelected = e =>{
    e.preventDefault();
    this.props.dispatch(
      selectQuestion("mcq", this.props.position-1)
    );
  }

  render() {
    let counter = 0;
    let letters = ["A. ", "B. ", "C. ", "D. "];

    let answers = this.props.multipleChoiceQuestion.options.map((answer) => { 
      counter++;
      if(counter === this.props.multipleChoiceQuestion.correctAnswer)
        return (<>
          <h6 key={"multipleChoiceAnswers"+counter} className={multipleChoiceContainerStyles.correct_answers}>{letters[counter-1]}{answer}</h6>
          <RiCheckboxCircleLine key={"multipleChoiceAnswersSymbol"+counter} style={{ color: "var(--green)", paddingBottom: "2px"}}></RiCheckboxCircleLine>
          </>
        )
      else
        return (
          <h6 key={"multipleChoiceAnswers"+counter} className={multipleChoiceContainerStyles.answers}>{letters[counter-1]}{answer}</h6>
        )
    });

    return (
      <Card onClick= {this.setSelected} className={this.props.reviewQuestions.questions.mcq[this.props.position-1].isSelected  ? multipleChoiceContainerStyles.cardSelected: multipleChoiceContainerStyles.card}>
        <Col style={{textAlign: "left"}}>
            <h4 className={multipleChoiceContainerStyles.questions}>{this.props.multipleChoiceQuestion.question}</h4>
            {answers}
        </Col>
      </Card> 
    );
  }
}

const mapStateToProps = state => {
  return { reviewQuestions: state.reviewQuestions };
};

const MultipleChoiceContainer = connect(mapStateToProps)(ConnectedMultipleChoiceContainer);
export default MultipleChoiceContainer;
