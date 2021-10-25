import React from "react";
import { connect } from "react-redux";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import FillInTheBlankContainerStyles from "./fillin_the_blank_container.module.css";

import { saveAnswer, saveNonSenseQuestion } from "../../actions/user_answers";

class ConnectedFillInTheBlankContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      answer: false,
      nonSenseFlag: false,
      option: null,
    };
  }

  saveAnswerOption = async (answer) => {
    await this.props.dispatch(
      saveAnswer(this.props.fillinTheBlankQuestion.question_id, answer - 1)
    );
  };

  onNonSenseCheck = async () => {
    await this.props.dispatch(
      saveNonSenseQuestion(this.props.fillinTheBlankQuestion.question_id)
    );
    if (this.props.last) {
      this.props.clickSubmit();
    } else {
      this.props.clickNext();
    }
  };

  render() {
    let counter = 0;

    let options = this.props.fillinTheBlankQuestion.options.map((answer) => {
      counter++;
      return (
        <Form.Check
          key={counter}
          className={FillInTheBlankContainerStyles.answers}
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
          className={FillInTheBlankContainerStyles.buttons}
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
          className={FillInTheBlankContainerStyles.buttons}
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
          Choose the option to fill in the blank in the following sentence.
        </h2>
        <Card
          onClick={this.clickCreateQuiz}
          className={FillInTheBlankContainerStyles.card}
        >
          <Row xs={12} md={12} lg={12}>
            <Col xs={8} md={8} lg={8}>
              <h4 className={FillInTheBlankContainerStyles.questions}>
                {this.props.fillinTheBlankQuestion.question}
              </h4>
              <div>{options}</div>
            </Col>
            <Col xs={4} md={4} lg={4}>
              <div
                className={FillInTheBlankContainerStyles.click}
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
const FillInTheBlankContainer = connect(mapStateToProps)(
  ConnectedFillInTheBlankContainer
);
export default FillInTheBlankContainer;
