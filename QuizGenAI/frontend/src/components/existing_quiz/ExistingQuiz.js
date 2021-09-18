import React from "react";
import {Link} from "react-router-dom";
import { connect } from "react-redux";
import NavigationBar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { Container, Row, Card, Button, Form } from "react-bootstrap";
import existingQuizStyles from "./existing_quiz.module.css";


class ConnectedExistingQuiz extends React.Component {
  constructor(){
    super();
    this.state = {
      privacy: "",
      name: "",
      password: ""
    }
  }

  handleChange = e =>{
    this.setState({ [e.target.id]: e.target.value });
  }


  clickTakeExistingQuiz = ()=> {
    
  }

  render() {
    let infoFields = "";
    if (this.state.privacy === "private") {
      infoFields = (<>
        {/* Enter Quiz name */}
        <Form.Group controlId="quiz_name">
            <Form.Label className={existingQuizStyles.labels}>Quiz Name</Form.Label>
              <Form.Control
                onChange={this.handleChange}
              />
          </Form.Group>
          
          {/* Enter Password */}
          <Form.Group controlId="quiz_password">
            <Form.Label className={existingQuizStyles.labels}>Password</Form.Label>
              <Form.Control
                onChange={this.handleChange}
              />
          </Form.Group>
        </>
      );
    }
    else if (this.state.privacy === "public"){
      infoFields = (<>
        {/* Enter Quiz name */}
        <Form.Group controlId="quiz_name">
            <Form.Label className={existingQuizStyles.labels}>Quiz Name</Form.Label>
              <Form.Control
                onChange={this.handleChange}
              />
          </Form.Group>
        </>
      );
    }
    
    return (<>
      <NavigationBar boolLoggedIn={true}></NavigationBar>
      <Container fluid className={existingQuizStyles.page_header}>TAKE EXISTING QUIZ</Container>
      <Container className={existingQuizStyles.container}> 
        <Form id="take-existing-quiz-form" className={existingQuizStyles.form}>
          
          <Card className={existingQuizStyles.card_header}>
            <Form.Group controlId="privacy" style={{margin: "0"}}>
              <Form.Label className={existingQuizStyles.labels}>Public or Private</Form.Label>
              <Form.Control
                as="select"
                onChange={this.handleChange}
                name="timed"
                style={{marginBottom: "10px"}}
              >
                <option hidden>{"Select"} </option>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </Form.Control>
            </Form.Group>

            {infoFields}
          </Card>
        </Form>

        <div style={{float: "right"}}>
        <Link to="/take_quiz_questions" onClick= {this.clickTakeExistingQuiz} className={`btn btn-primary ${existingQuizStyles.links}`}>Take Quiz</Link>
        </div>
      </Container>
      <Footer boolLoggedIn={true}></Footer>
      </>
    );
  }
}

const mapStateToProps = (state) => ({});
const ExistingQuiz = connect(mapStateToProps)(ConnectedExistingQuiz);
export default ExistingQuiz;