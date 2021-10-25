import React from "react";
import { connect } from "react-redux";
import { Row, Card, Form, Col, Button } from "react-bootstrap";
import TrueOrFalseContainerStyles from "./true_or_false_container.module.css";

import { saveAnswer, saveNonSenseQuestion } from "../../actions/user_answers";

class ConnectedTrueOrFalseContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      answer: false,
      nonSenseFlag: false,
    };
  }

  saveAnswerOption = async (answer) => {
    console.log(answer);
    await this.props.dispatch(
      saveAnswer(this.props.trueOrFalseQuestion.question_id, answer)
    );
  };

  onNonSenseCheck = async () => {
    await this.props.dispatch(
      saveNonSenseQuestion(this.props.trueOrFalseQuestion.question_id)
    );
    if (this.props.last) {
      this.props.clickSubmit();
    } else {
      this.props.clickNext();
    }
  };

  render() {
    let button = null;

    if (this.props.last) {
      button = (
        <Button
          className={TrueOrFalseContainerStyles.buttons}
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
          className={TrueOrFalseContainerStyles.buttons}
          onClick={(e) => {
            e.preventDefault();
            this.props.clickNext();
          }}
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
          Select True or False as the correct answer.
        </h2>
        <Card
          onClick={this.clickCreateQuiz}
          className={TrueOrFalseContainerStyles.card}
        >
          <Row xs={12} md={12} lg={12}>
            <Col xs={8} md={8} lg={8}>
              <h4 className={TrueOrFalseContainerStyles.questions}>
                {this.props.trueOrFalseQuestion.question}
              </h4>
              <div>
                <Form.Check
                  className={TrueOrFalseContainerStyles.answers}
                  style={{ marginLeft: "20px" }}
                  label="True"
                  value="true"
                  name="group1"
                  type="radio"
                  id="default-radio-1"
                  onChange={(e) => {
                    this.setState({ answer: true });
                    this.saveAnswerOption(e.currentTarget.value);
                  }}
                  disabled={this.state.nonSenseFlag === true ? true : false}
                />
                <Form.Check
                  className={TrueOrFalseContainerStyles.answers}
                  style={{ marginLeft: "20px" }}
                  label="False"
                  value="false"
                  name="group1"
                  type="radio"
                  id="default-radio-2"
                  onChange={(e) => {
                    this.setState({ answer: true });
                    this.saveAnswerOption(e.currentTarget.value);
                  }}
                  disabled={this.state.nonSenseFlag === true ? true : false}
                />
              </div>
            </Col>
            <Col xs={4} md={4} lg={4}>
              <div
                className={TrueOrFalseContainerStyles.click}
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
const TrueOrFalseContainer = connect(mapStateToProps)(
  ConnectedTrueOrFalseContainer
);
export default TrueOrFalseContainer;
