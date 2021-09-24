import React from "react";
import { connect } from "react-redux";
import { Col, Card } from "react-bootstrap";
import FillInTheBlankContainerStyles from "./fillin_the_blank_container.module.css";
import { RiCheckboxCircleLine } from "react-icons/ri";

import { selectQuestion, unselectQuestion } from "../../actions/review_questions";

class ConnectedFillInTheBlankContainer extends React.Component {
  constructor(){
    super();
    this.state = {
      isSelected: false
    }
  }

  componentDidUpdate(prevState) {
    if (this.state.isSelected !== prevState.isSelected) {
      if (this.state.isSelected === true)
        this.props.select("fbq", this.props.position-1);
      else
        this.props.unselect("fbq", this.props.position-1);
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

const mapDispatchToProps = (dispatch) => {
  return {
    select: (type, position) => dispatch(selectQuestion(type, position)),
    unselect: (type, position) => dispatch(unselectQuestion(type, position)),
  }
}

const FillInTheBlankContainer = connect(null, mapDispatchToProps)(ConnectedFillInTheBlankContainer);
export default FillInTheBlankContainer;