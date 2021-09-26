import React from "react";
import { connect } from "react-redux";
import { Col, Card } from "react-bootstrap";
import TrueOrFalseContainerStyles from "./true_or_false_container.module.css";
import { RiCheckboxCircleLine } from "react-icons/ri";

import { selectQuestion } from "../../actions/review_questions";

class ConnectedTrueOrFalseContainer extends React.Component {
  constructor(){
    super();
    this.state = {
    }
  }

  setSelected = e =>{
    e.preventDefault();
    this.props.dispatch(
      selectQuestion("tfq", this.props.position-1)
    );
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
      <Card onClick= {this.setSelected} className={this.props.reviewQuestions.questions.tfq[this.props.position-1].isSelected ? TrueOrFalseContainerStyles.cardSelected: TrueOrFalseContainerStyles.card}>
        <Col  style={{textAlign: "left"}}>
            <h4 className={TrueOrFalseContainerStyles.questions}>{this.props.trueOrFalseQuestion.question}</h4>
            {t}
            {f}
        </Col>
      </Card> 
    );
  }
}

const mapStateToProps = state => {
  return { reviewQuestions: state.reviewQuestions };
};

const TrueOrFalseContainer = connect(mapStateToProps)(ConnectedTrueOrFalseContainer);
export default TrueOrFalseContainer;
