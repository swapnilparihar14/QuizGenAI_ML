import React from "react";
import {Link} from "react-router-dom";
import { connect } from "react-redux";
import NavigationBar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import takeQuizStyles from "./take_quiz.module.css";
import { FileUploader } from "react-drag-drop-files";


class TakeQuiz extends React.Component {
  constructor(){
    super();
    this.state = {
  
    }
  }

  render() {
       
    return (<>
      <NavigationBar boolLoggedIn={true}></NavigationBar>
      <Container fluid className={takeQuizStyles.page_header}>TAKE QUIZ</Container>
      <Row className={takeQuizStyles.row}>
        <Col xs={6} md={6} lg={6}>
        <Link to="/new_quiz" onClick= {this.clickReview} className={takeQuizStyles.links}>New Quiz</Link>
        </Col>
        <Col xs={6} md={6} lg={6}>
        <Link to="/" onClick= {this.clickReview} className={takeQuizStyles.links}>Existing Quiz</Link>
        </Col>
      </Row>
      <Footer boolLoggedIn={true}></Footer>
      </>
    );
  }
}

export default TakeQuiz;