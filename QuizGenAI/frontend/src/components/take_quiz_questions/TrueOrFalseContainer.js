import React from "react";
import { connect } from "react-redux";
import { Row, Card, Form, Col } from "react-bootstrap";
import TrueOrFalseContainerStyles from "./true_or_false_container.module.css";


class ConnectedTrueOrFalseContainer extends React.Component {
  constructor(){
    super();
    this.state = {
      answer: null
    }
  }

  setRadioValue = val =>{
    this.setState({ answer: val });
  }

  render() {
    console.log("prev", this.state.answer);
    return (<>
      <h2 style={{fontSize: "1rem", marginBottom: "10px"}}>Select True or False as the correct answer.</h2>
      <Card onClick= {this.clickCreateQuiz} className={TrueOrFalseContainerStyles.card}>
        <Row  xs={12} md={12} lg={12}>
          <Col xs={12} md={12} lg={12}>
            <h4 className={TrueOrFalseContainerStyles.questions}>{this.props.trueOrFalseQuestion.question}</h4>
            <div>
              <Form.Check className={TrueOrFalseContainerStyles.answers} style={{marginLeft: "20px"}}
                label="True"
                value="true"
                name="group1"
                type="radio"
                id="default-radio-1"
                onChange={e => this.setRadioValue(e.currentTarget.value)}
              />
              <Form.Check className={TrueOrFalseContainerStyles.answers} style={{marginLeft: "20px"}}
                label="False"
                value="false"
                name="group1"
                type="radio"
                id="default-radio-2"
                onChange={e => this.setRadioValue(e.currentTarget.value)}
              />
            </div>
          </Col>
        </Row>
      </Card>
      </> 
    );
  }
}

const mapStateToProps = (state) => ({});
const TrueOrFalseContainer = connect(mapStateToProps)(ConnectedTrueOrFalseContainer);
export default TrueOrFalseContainer;