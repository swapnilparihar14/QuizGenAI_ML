import React from "react";
import { connect } from "react-redux";
import { Row, Card, Form, Col, Button } from "react-bootstrap";
import TrueOrFalseContainerStyles from "./true_or_false_container.module.css";

import { saveAnswer } from "../../actions/user_answers";

class ConnectedTrueOrFalseContainer extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  saveAnswerOption = async (answer) => {
    await this.props.dispatch(
      saveAnswer(this.props.trueOrFalseQuestion.question_id, answer)
    );
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
          disabled={this.state.answer === null ? true : false}
          style={{
            visibility: `${this.state.answer === null ? "hidden" : "visible"}`,
          }}
        >
          Submit
        </Button>
      );
    } else {
      button = (
        <Button
          className={TrueOrFalseContainerStyles.buttons}
          onClick={(e) => this.props.clickNext(e)}
          disabled={this.state.answer === null ? true : false}
          style={{
            visibility: `${this.state.answer === null ? "hidden" : "visible"}`,
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
            <Col xs={12} md={12} lg={12}>
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
                  onChange={(e) => this.saveAnswerOption(e.currentTarget.value)}
                />
                <Form.Check
                  className={TrueOrFalseContainerStyles.answers}
                  style={{ marginLeft: "20px" }}
                  label="False"
                  value="false"
                  name="group1"
                  type="radio"
                  id="default-radio-2"
                  onChange={(e) => this.saveAnswerOption(e.currentTarget.value)}
                />
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
