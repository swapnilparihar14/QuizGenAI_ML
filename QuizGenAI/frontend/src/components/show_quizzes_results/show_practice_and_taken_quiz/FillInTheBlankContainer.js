import React from "react";
import { Col, Card } from "react-bootstrap";
import FillInTheBlankContainerStyles from "./fillin_the_blank_container.module.css";
import { RiCheckboxCircleLine, RiCloseCircleLine } from "react-icons/ri";

class FillInTheBlankContainer extends React.Component {
  constructor(){
    super();
    this.state = {
    }
  }

  render() {
    let counter = 0;
    let letters = ["A. ", "B. ", "C. ", "D. "];

    let answers = this.props.fillinTheBlankQuestion.options.map((answer) => { 
      counter++;
      if(counter-1 === this.props.fillinTheBlankQuestion.correctAnswer)
        return (<div style={{display: "block"}}>
          <h6 className={FillInTheBlankContainerStyles.correct_answers} key={"fillinTheBlankAnswers"+counter}>{letters[counter-1]}{answer}</h6>
          <RiCheckboxCircleLine key={"fillinTheBlankAnswersSymbol"+counter} style={{ color: "var(--green)", paddingBottom: "2px"}}></RiCheckboxCircleLine>
          <h6 style={{fontStyle: "italic", display: "inline-block", marginLeft: "5px", color: "var(--dark-blue)"}}> Correct Answer!</h6>
          </div>
        )
      else if (this.props.fillinTheBlankQuestion.correctAnswer !== this.props.fillinTheBlankQuestion.yourAnswer && this.props.fillinTheBlankQuestion.yourAnswer !== "" && counter-1 === this.props.fillinTheBlankQuestion.yourAnswer)
        return (<div style={{display: "block"}}>
          <h6 key={"fillinTheBlankAnswers"+counter} className={FillInTheBlankContainerStyles.wrong_answers}>{letters[counter-1]}{answer}</h6>
          <RiCloseCircleLine key={"fillinTheBlankAnswersSymbol"+counter} style={{ color: "var(--red)", paddingBottom: "2px"}}></RiCloseCircleLine>
          <h6 style={{fontStyle: "italic", display: "inline-block", marginLeft: "5px", color: "var(--dark-blue)"}}> You Answered </h6>
          </div>
        )
      else
        return (
          <h6 className={FillInTheBlankContainerStyles.answers} key={"fillinTheBlankAnswers"+counter}>{letters[counter-1]}{answer}</h6>
        )
    });

    return (
      <Card className={FillInTheBlankContainerStyles.card}>
        <Col style={{textAlign: "left"}}>
            <h4 className={FillInTheBlankContainerStyles.questions}>{this.props.fillinTheBlankQuestion.question}</h4>
            {answers}
        </Col>
    </Card>
    );
  }
}

export default FillInTheBlankContainer;