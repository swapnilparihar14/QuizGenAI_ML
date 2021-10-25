import React from "react";
import { Col, Card } from "react-bootstrap";
import multipleChoiceContainerStyles from "./multiple_choice_container.module.css";
import { RiCheckboxCircleLine, RiCloseCircleLine } from "react-icons/ri";

class MultipleChoiceContainer extends React.Component {
  constructor(props){
    super();
    this.state = {
    }
  }

  render() {
    let counter = 0;
    let letters = ["A. ", "B. ", "C. ", "D. "];

    let answers = this.props.multipleChoiceQuestion.options.map((answer) => { 
      counter++;
      if(counter-1 === this.props.multipleChoiceQuestion.correctAnswer)
        return (<div style={{display: "block"}}>
          <h6 key={"multipleChoiceAnswers"+counter} className={multipleChoiceContainerStyles.correct_answers}>{letters[counter-1]}{answer}</h6>
          <RiCheckboxCircleLine key={"multipleChoiceAnswersSymbol"+counter} style={{ color: "var(--green)", paddingBottom: "2px"}}></RiCheckboxCircleLine>
          <h6 style={{fontStyle: "italic", display: "inline-block", marginLeft: "5px", color: "var(--dark-blue)"}}> Correct Answer!</h6>
          </div>
        )
      else if (this.props.multipleChoiceQuestion.correctAnswer !== this.props.multipleChoiceQuestion.yourAnswer && this.props.multipleChoiceQuestion.yourAnswer !== "" && counter-1 === this.props.multipleChoiceQuestion.yourAnswer)
        return (<div style={{display: "block"}}>
          <h6 key={"multipleChoiceAnswers"+counter} className={multipleChoiceContainerStyles.wrong_answers}>{letters[counter-1]}{answer}</h6>
          <RiCloseCircleLine key={"multipleChoiceAnswersSymbol"+counter} style={{ color: "var(--red)", paddingBottom: "2px"}}></RiCloseCircleLine>
          <h6 style={{fontStyle: "italic", display: "inline-block", marginLeft: "5px", color: "var(--dark-blue)"}}> You Answered </h6>
          </div>
        )
      else
        return (
          <h6 key={"multipleChoiceAnswers"+counter} className={multipleChoiceContainerStyles.answers}>{letters[counter-1]}{answer}</h6>
        )
    });

    return (
      <Card className={multipleChoiceContainerStyles.card}>
        <Col style={{textAlign: "left"}}>
            <h4 className={multipleChoiceContainerStyles.questions}>{this.props.multipleChoiceQuestion.question}</h4>
            {answers}
        </Col>
      </Card> 
    );
  }
}

export default MultipleChoiceContainer;
