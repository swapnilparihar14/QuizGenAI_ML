import React from "react";
import { connect } from "react-redux";
import { Row, Card, Form, Col } from "react-bootstrap";
import multipleChoiceContainerStyles from "./multiple_choice_container.module.css";


class ConnectedMultipleChoiceContainer extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      answer: null
    }
  }

  setRadioValue = val =>{
    this.setState({ answer: val });
  }

  render() {
    console.log("prev", this.state.answer);
    let counter = 0;
 
    let options = this.props.multipleChoiceQuestion.options.map((answer) => {
      counter++;
      return(<Form.Check key={counter} className={multipleChoiceContainerStyles.answers} style={{marginLeft: "20px"}}
        label={answer}
        value={counter}
        name="group1"
        type="radio"
        id="default-radio-1"
        onChange={e => this.setRadioValue(e.currentTarget.value)}
      />)
    });

    return (<>
      <h2 style={{fontSize: "1rem", marginBottom: "10px"}}>Choose the correct answer to the following question.</h2>
      <Card onClick= {this.clickCreateQuiz} className={multipleChoiceContainerStyles.card}>
        <Row  xs={12} md={12} lg={12}>
          <Col xs={12} md={12} lg={12}>
            <h4 className={multipleChoiceContainerStyles.questions}>{this.props.multipleChoiceQuestion.question}</h4>
            <div>
              {options}
            </div>
          </Col>
        </Row>
      </Card> 
      </>
    );
  }
}

const mapStateToProps = (state) => ({});
const MultipleChoiceContainer = connect(mapStateToProps)(ConnectedMultipleChoiceContainer);
export default MultipleChoiceContainer;