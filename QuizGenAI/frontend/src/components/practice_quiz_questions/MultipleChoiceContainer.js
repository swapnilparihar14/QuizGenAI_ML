import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Row, Card, Form, Col, Button } from "react-bootstrap";
import multipleChoiceContainerStyles from "./multiple_choice_container.module.css";

import { saveAnswer, saveNonSenseQuestion } from "../../actions/user_answers";

class ConnectedMultipleChoiceContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      answer: false,
    };
  }

  saveAnswerOption = async (answer) => {
    await this.props.dispatch(
      saveAnswer(this.props.multipleChoiceQuestion.question_id, answer - 1)
    );
  };

  onNonSenseCheck = async () => {
    await this.props.dispatch(
      saveNonSenseQuestion(this.props.multipleChoiceQuestion.question_id)
    );
    if (this.props.last) {
      this.props.clickSubmit();
    } else {
      this.props.clickNext();
    }
  };

  render() {
    let counter = 0;

    let options = this.props.multipleChoiceQuestion.options.map((answer) => {
      counter++;
      return (
        <Form.Check
          key={counter}
          className={multipleChoiceContainerStyles.answers}
          style={{ marginLeft: "20px" }}
          label={answer}
          value={counter}
          name="group1"
          type="radio"
          id="default-radio-1"
          onChange={(e) => {
            this.setState({ answer: true });
            this.saveAnswerOption(e.currentTarget.value);
          }}
          disabled={this.state.nonSenseFlag === true ? true : false}
        />
      );
    });

    let button = null;

    if (this.props.last) {
      button = (
        <Button
          className={multipleChoiceContainerStyles.buttons}
          onClick={(e) => {
            e.preventDefault();
            this.props.clickSubmit();
          }}
          style={{
            visibility: `${this.state.answer === false ? "hidden" : "visible"}`,
          }}
        >
          Submit
        </Button>
      );
    } else {
      button = (
        <Button
          className={multipleChoiceContainerStyles.buttons}
          onClick={(e) => this.props.clickNext(e)}
          style={{
            visibility: `${this.state.answer === false ? "hidden" : "visible"}`,
          }}
        >
          Next
        </Button>
      );
    }

    return (
      <>
        <h2 style={{ fontSize: "1rem", marginBottom: "10px" }}>
          Choose the correct answer to the following question.
        </h2>
        <Card
          onClick={this.clickCreateQuiz}
          className={multipleChoiceContainerStyles.card}
        >
          <Row xs={12} md={12} lg={12}>
            <Col xs={9} md={9} lg={9}>
              <h4 className={multipleChoiceContainerStyles.questions}>
                {this.props.multipleChoiceQuestion.question}
              </h4>
              <div>{options}</div>
            </Col>
            <Col xs={3} md={3} lg={3}>
              <div
                className={multipleChoiceContainerStyles.click}
                onClick={this.onNonSenseCheck}
              >
                Click here if this question does not make sense
              </div>
            </Col>
          </Row>
        </Card>
        <div style={{ float: "right" }}>{button}</div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({});
const MultipleChoiceContainer = connect(mapStateToProps)(
  ConnectedMultipleChoiceContainer
);
export default MultipleChoiceContainer;
