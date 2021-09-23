import React from "react";
import { Col, Card } from "react-bootstrap";
import FillInTheBlankContainerStyles from "./fillin_the_blank_container.module.css";
import { RiCheckboxCircleLine } from "react-icons/ri";


class FillInTheBlankContainer extends React.Component {
  constructor(){
    super();
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

    let answers = this.props.fillinTheBlankQuestion.options.map((answer) => { 
      counter++;
      if(counter === this.props.fillinTheBlankQuestion.correctAnswer)
        return (<>
          <h6 className={FillInTheBlankContainerStyles.correct_answers}>{letters[counter-1]}{answer}</h6>
          <RiCheckboxCircleLine style={{ color: "var(--green)", paddingBottom: "2px"}}></RiCheckboxCircleLine>
          </>
        )
      else
        return (
          <h6 className={FillInTheBlankContainerStyles.answers}>{letters[counter-1]}{answer}</h6>
        )
    });

    return (
      <Card onClick= {this.setSelected} className={this.state.isSelected ? FillInTheBlankContainerStyles.cardSelected: FillInTheBlankContainerStyles.card}>
        <Col style={{textAlign: "left"}}>
            <h4 className={FillInTheBlankContainerStyles.questions}>{this.props.fillinTheBlankQuestion.question}</h4>
            {answers}
        </Col>
    </Card>
    );
  }
}

export default FillInTheBlankContainer;