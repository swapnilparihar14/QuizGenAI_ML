import React from "react";
import { Col, Card } from "react-bootstrap";
import multipleChoiceContainerStyles from "./multiple_choice_container.module.css";
import { RiCheckboxCircleLine } from "react-icons/ri";

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
      if(counter-1 === this.props.multipleChoiceQuestion.answer)
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
