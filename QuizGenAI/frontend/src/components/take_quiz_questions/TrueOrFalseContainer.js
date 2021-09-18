import React from "react";
import { connect } from "react-redux";
import { Row, Col, Card, Button, Form } from "react-bootstrap";
import TrueOrFalseContainerStyles from "./true_or_false_container.module.css";


class ConnectedTrueOrFalseContainer extends React.Component {
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
    return (<>
      <h2 style={{fontSize: "1rem", marginBottom: "10px"}}>Select True or False as the correct answer.</h2>
      <Card onClick= {this.clickCreateQuiz} className={TrueOrFalseContainerStyles.card}>
        <Row  xs={12} md={12} lg={12}>
          <Col  xs={8} md={8} lg={8}>
              <h4 className={TrueOrFalseContainerStyles.questions}>{this.props.trueOrFalseQuestion.question}</h4>
              {['radio'].map((type) => (
              <div key={`default-${type}`} >
                <Form.Check className={TrueOrFalseContainerStyles.answers} style={{marginLeft: "20px"}}
                  label="True"
                  name="group1"
                  type={type}
                  id={`default-${type}-1`}
                />
                <Form.Check className={TrueOrFalseContainerStyles.answers} style={{marginLeft: "20px"}}
                  label="False"
                  name="group1"
                  type={type}
                  id={`default-${type}-2`}
                />
              </div>
            ))}
          </Col>
          <Col  xs={4} md={4} lg={4}>
            <h4 className={TrueOrFalseContainerStyles.questions}>Does this question make sense?</h4>

            {['radio'].map((type) => (
              <div key={`inline-${type}`} >
                <Form.Check className={TrueOrFalseContainerStyles.answers} style={{marginRight: "50px"}}
                  inline
                  label="Yes"
                  name="group1"
                  type={type}
                  id={`inline-${type}-1`}
                />
                <Form.Check className={TrueOrFalseContainerStyles.answers}
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
      </> 
    );
  }
}

const mapStateToProps = (state) => ({});
const TrueOrFalseContainer = connect(mapStateToProps)(ConnectedTrueOrFalseContainer);
export default TrueOrFalseContainer;