import React from "react";
import { connect } from "react-redux";
import { Row, Col, Card, Form } from "react-bootstrap";
import FillInTheBlankContainerStyles from "./fillin_the_blank_container.module.css";


class ConnectedFillInTheBlankContainer extends React.Component {
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
    let counter = 0;
 
    let options = this.props.fillinTheBlankQuestion.options.map((answer) => {
      counter++;
      return(<Form.Check key={counter} className={FillInTheBlankContainerStyles.answers} style={{marginLeft: "20px"}}
        label={answer}
        value={counter}
        name="group1"
        type="radio"
        id="default-radio-1"
        onChange={e => this.setRadioValue(e.currentTarget.value)}
      />)
    });

    return (<>
      <h2 style={{fontSize: "1rem", marginBottom: "10px"}}>Fill in the blank in the following sentence.</h2>
      <Card onClick= {this.clickCreateQuiz} className={FillInTheBlankContainerStyles.card}>
        <Row  xs={12} md={12} lg={12}>
          <Col xs={12} md={12} lg={12}>
            <h4 className={FillInTheBlankContainerStyles.questions}>{this.props.fillinTheBlankQuestion.question}</h4>
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
const FillInTheBlankContainer = connect(mapStateToProps)(ConnectedFillInTheBlankContainer);
export default FillInTheBlankContainer;