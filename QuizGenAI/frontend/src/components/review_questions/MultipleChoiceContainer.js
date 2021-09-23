import React from "react";
import { Col, Card } from "react-bootstrap";
import multipleChoiceContainerStyles from "./multiple_choice_container.module.css";
import { RiCheckboxCircleLine } from "react-icons/ri";


class MultipleChoiceContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isSelected: false
    }
  }

  setSelected = e =>{
    e.preventDefault();

    this.setState({ isSelected: !this.state.isSelected });
  }

  render() {
    let counter = 0;
    let letters = ["A. ", "B. ", "C. ", "D. "];

    let answers = this.props.multipleChoiceQuestion.options.map((answer) => { 
      counter++;
      if(counter === this.props.multipleChoiceQuestion.correctAnswer)
        return (<>
          <h6 className={multipleChoiceContainerStyles.correct_answers}>{letters[counter-1]}{answer}</h6>
          <RiCheckboxCircleLine style={{ color: "var(--green)", paddingBottom: "2px"}}></RiCheckboxCircleLine>
          </>
        )
      else
        return (
          <h6 className={multipleChoiceContainerStyles.answers}>{letters[counter-1]}{answer}</h6>
        )
    });

    return (
      <Card onClick= {this.setSelected} className={this.state.isSelected ? multipleChoiceContainerStyles.cardSelected: multipleChoiceContainerStyles.card}>
        <Col style={{textAlign: "left"}}>
            <h4 className={multipleChoiceContainerStyles.questions}>{this.props.multipleChoiceQuestion.question}</h4>
            {answers}
        </Col>
      </Card> 
    );
  }
}

export default MultipleChoiceContainer;