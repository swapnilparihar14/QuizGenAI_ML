import React from "react";
import { connect } from "react-redux";
import { Row, Col, Card, Button, Form } from "react-bootstrap";
import FillInTheBlankContainerStyles from "./fillin_the_blank_container.module.css";


class ConnectedFillInTheBlankContainer extends React.Component {
  constructor(){
    super();
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
      <Card onClick= {this.clickCreateQuiz} className={FillInTheBlankContainerStyles.card}>
        <Row  xs={12} md={12} lg={12}>
          <Col  xs={8} md={8} lg={8}>
              <h4 className={FillInTheBlankContainerStyles.questions}>{this.props.fillinTheBlankQuestion.question}</h4>
              <h6 className={FillInTheBlankContainerStyles.answers}>Answer: {this.props.fillinTheBlankQuestion.correctAnswer}</h6>
          </Col>
          <Col  xs={4} md={4} lg={4}>
            <h4 className={FillInTheBlankContainerStyles.questions}>Does this question make sense?</h4>

            {['radio'].map((type) => (
              <div key={`inline-${type}`} >
                <Form.Check className={FillInTheBlankContainerStyles.answers} style={{marginRight: "50px"}}
                  inline
                  label="Yes"
                  name="group1"
                  type={type}
                  id={`inline-${type}-1`}
                />
                <Form.Check className={FillInTheBlankContainerStyles.answers}
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
const FillInTheBlankContainer = connect(mapStateToProps)(ConnectedFillInTheBlankContainer);
export default FillInTheBlankContainer;