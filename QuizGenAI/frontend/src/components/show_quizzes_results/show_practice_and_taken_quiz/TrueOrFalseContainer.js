import React from "react";
import { Col, Card } from "react-bootstrap";
import TrueOrFalseContainerStyles from "./true_or_false_container.module.css";
import { RiCheckboxCircleLine, RiCloseCircleLine } from "react-icons/ri";

class TrueOrFalseContainer extends React.Component {
  constructor(){
    super();
    this.state = {
    }
  }

  render() {
    let t = null;
    let f = null;

    if (this.props.trueOrFalseQuestion.correctAnswer === true) {
      t = (<div style={{display: "block"}}>
        <h6 className={TrueOrFalseContainerStyles.correct_answers}>A. True</h6>
        <RiCheckboxCircleLine style={{ color: "var(--green)", paddingBottom: "2px"}}></RiCheckboxCircleLine>
        <h6 style={{fontStyle: "italic", display: "inline-block", marginLeft: "5px", color: "var(--dark-blue)"}}> Correct Answer!</h6>
        </div>
      )
    } 
    else if (this.props.trueOrFalseQuestion.correctAnswer.toString() !== this.props.trueOrFalseQuestion.yourAnswer && this.props.trueOrFalseQuestion.yourAnswer !== "" && this.props.trueOrFalseQuestion.yourAnswer === "true") {
      t = (<div style={{display: "block"}}>
        <h6 className={TrueOrFalseContainerStyles.wrong_answers}>A. True</h6>
        <RiCloseCircleLine style={{ color: "var(--red)", paddingBottom: "2px"}}></RiCloseCircleLine>
        <h6 style={{fontStyle: "italic", display: "inline-block", marginLeft: "5px", color: "var(--dark-blue)"}}> You Answered </h6>
        </div>
      )
    }
    else {
      t = (
        <h6 className={TrueOrFalseContainerStyles.answers}>A. True</h6>
      )
    }

    if (this.props.trueOrFalseQuestion.correctAnswer === false) {
      f = (<div style={{display: "block"}}>
        <h6 className={TrueOrFalseContainerStyles.correct_answers}>B. False</h6>
        <RiCheckboxCircleLine style={{ color: "var(--green)", paddingBottom: "2px"}}></RiCheckboxCircleLine>
        <h6 style={{fontStyle: "italic", display: "inline-block", marginLeft: "5px", color: "var(--dark-blue)"}}> Correct Answer!</h6>
        </div>
      )
    } 
    else if (this.props.trueOrFalseQuestion.correctAnswer.toString() !== this.props.trueOrFalseQuestion.yourAnswer && this.props.trueOrFalseQuestion.yourAnswer !== "" && this.props.trueOrFalseQuestion.yourAnswer === "false") {
      f = (<div style={{display: "block"}}>
        <h6 className={TrueOrFalseContainerStyles.wrong_answers}>B. False</h6>
        <RiCloseCircleLine style={{ color: "var(--red)", paddingBottom: "2px"}}></RiCloseCircleLine>
        <h6 style={{fontStyle: "italic", display: "inline-block", marginLeft: "5px", color: "var(--dark-blue)"}}> You Answered </h6>
        </div>
      )
    }
    else {
      f = (
        <h6 className={TrueOrFalseContainerStyles.answers}>B. False</h6>
      )
    }

    return (
      <Card className={TrueOrFalseContainerStyles.card}>
        <Col  style={{textAlign: "left"}}>
            <h4 className={TrueOrFalseContainerStyles.questions}>{this.props.trueOrFalseQuestion.question}</h4>
            {t}
            {f}
        </Col>
      </Card> 
    );
  }
}

export default TrueOrFalseContainer;
