import React from "react";
import { Col, Card } from "react-bootstrap";
import TrueOrFalseContainerStyles from "./true_or_false_container.module.css";
import { RiCheckboxCircleLine } from "react-icons/ri";


class TrueOrFalseContainer extends React.Component {
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
    let t = null;
    let f = null;

    if (this.props.trueOrFalseQuestion.correctAnswer.toLowerCase() === "true") {
      t = (<>
        <h6 className={TrueOrFalseContainerStyles.correct_answers}>A. True</h6>
        <RiCheckboxCircleLine style={{ color: "var(--green)", paddingBottom: "2px"}}></RiCheckboxCircleLine>
        </>
      )
    } else {
      t = (
        <h6 className={TrueOrFalseContainerStyles.answers}>A. True</h6>
      )
    }

    if (this.props.trueOrFalseQuestion.correctAnswer.toLowerCase() === "false") {
      f = (<>
        <h6 className={TrueOrFalseContainerStyles.correct_answers}>B. False</h6>
        <RiCheckboxCircleLine style={{ color: "var(--green)", paddingBottom: "2px"}}></RiCheckboxCircleLine>
        </>
      )
    } else {
      f = (
        <h6 className={TrueOrFalseContainerStyles.answers}>B. False</h6>
      )
    }

    return (
      <Card onClick= {this.setSelected} className={this.state.isSelected ? TrueOrFalseContainerStyles.cardSelected: TrueOrFalseContainerStyles.card}>
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