import React from "react";
import { connect } from "react-redux";
import { Row, Col, Card, Button, Form } from "react-bootstrap";
import multipleChoiceContainerStyles from "./multiple_choice_container.module.css";
import { RiCheckboxCircleLine } from "react-icons/ri";


class ConnectedMultipleChoiceContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      selected: false,
      makeSense: null,
    }
  }

  handleChange = e =>{
    this.setState({ [e.target.id]: e.target.value });
  }

  render() {
    return (
      <Card onClick= {this.clickCreateQuiz} className={multipleChoiceContainerStyles.card}>
        <Row  xs={12} md={12} lg={12}>
          <Col  xs={8} md={8} lg={8}>
              <h4 className={multipleChoiceContainerStyles.questions}>{this.props.multipleChoiceQuestion.question}</h4>
              {['radio'].map((type) => (
              <div key={`default-${type}`} >
                {this.props.multipleChoiceQuestion.answers.map((answer) =>
                  <Form.Check className={multipleChoiceContainerStyles.answers} style={{marginLeft: "20px"}}
                    label={answer}
                    name="group1"
                    type={type}
                    id={`default-${type}-1`}
                />
                )}
              </div>
            ))}
          </Col>
          <Col  xs={4} md={4} lg={4}>
            <h4 className={multipleChoiceContainerStyles.questions}>Does this question make sense?</h4>

            {['radio'].map((type) => (
              <div key={`inline-${type}`} >
                <Form.Check className={multipleChoiceContainerStyles.answers} style={{marginRight: "50px"}}
                  inline
                  label="Yes"
                  name="group1"
                  type={type}
                  id={`inline-${type}-1`}
                />
                <Form.Check className={multipleChoiceContainerStyles.answers}
                  inline
                  label="No"
                  name="group1"
                  type={type}
                  id={`inline-${type}-2`}
                />
              </div>
            ))}
          </Col>
          </Row>
      </Card> 
    );
  }
}

const mapStateToProps = (state) => ({});
const MultipleChoiceContainer = connect(mapStateToProps)(ConnectedMultipleChoiceContainer);
export default MultipleChoiceContainer;