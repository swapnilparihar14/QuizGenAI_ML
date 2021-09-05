import React from "react";
import { connect } from "react-redux";
import NavigationBar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { Container, Card, Button, Form } from "react-bootstrap";
import createQuizStyles from "./create_quiz.module.css";
import { FileUploader } from "react-drag-drop-files";


class ConnectedCreateQuiz extends React.Component {
  constructor(){
    super();
    this.state = {
      quizname: "",
      graded: "",
      timed: "",
      privacy: "",
      password: "",
      multiplechoicequestions: "",
      fillintheblankquestions: "",
      trueorfalsequestions: "",
      file: null,
    }
  }

  handleChange = e =>{
    this.setState({ [e.target.id]: e.target.value });
  }

  handleFile = (file) => {
    this.setState({ file: file });
  };

  clickReview = e =>{
    e.preventDefault();
  }

  clickTakeQuiz = e =>{
    e.preventDefault();
  }

  render() {
    const fileTypes = ["PDF", "DOC", "PPT", "HTML", "DOCX", "PPTX",];

    let passwordField = "";
    if (this.state.privacy === "private") {
      passwordField = (
        <Form.Group controlId="password">
          <Form.Label className={createQuizStyles.labels}>Password</Form.Label>
          <Form.Control
            onChange={this.handleChange}
            name="password"
            type="text"
          />
        </Form.Group>
      );
    }
    
    return (<>
      <NavigationBar></NavigationBar>
      <Container fluid className={createQuizStyles.page_header}>CREATE QUIZ</Container>
      <Container className={createQuizStyles.container}> 
        <Form id="create-quiz-form" className={createQuizStyles.form}>
          
          {/* Enter Quiz Title */}
          <Card className={createQuizStyles.card_header}>
            <Form.Group controlId="quizname" style={{margin: "0"}}>
              <Form.Control type="text" placeholder="Untitled Quiz" onChange={this.handleChange} style={{border: "none", fontSize: "2.5rem", paddingLeft: "0"}}/>
              {/* <p className="errormessage"> {fnameerrormsg}</p> */}
            </Form.Group>
          </Card>
      
          <Card className={createQuizStyles.card}>
            <Form.Group controlId="graded" style={{margin: "0"}}>
              <Form.Label className={createQuizStyles.labels}>Graded or Ungraded</Form.Label>
              <Form.Control
                as="select"
                onChange={this.handleChange}
                name="graded"
              >
                <option hidden>{"Select"} </option>
                <option value="graded">Graded</option>
                <option value="ungraded">Ungraded</option>
              </Form.Control>
            </Form.Group>
          </Card> 
          
          <Card className={createQuizStyles.card}>
            <Form.Group controlId="timed" style={{margin: "0"}}>
              <Form.Label className={createQuizStyles.labels}>Timed or Untimed</Form.Label>
              <Form.Control
                as="select"
                onChange={this.handleChange}
                name="timed"
              >
                <option hidden>{"Select"} </option>
                <option value="timed">Timed</option>
                <option value="untimed">Untimed</option>
              </Form.Control>
            </Form.Group>
          </Card>
          
          <Card className={createQuizStyles.card}>
            <Form.Group controlId="privacy" style={{margin: "0"}}>
              <Form.Label className={createQuizStyles.labels}>Public or Private</Form.Label>
              <Form.Control
                as="select"
                onChange={this.handleChange}
                name="privacy"
                style={{marginBottom: "10px"}}
              >
                <option hidden>{"Select"} </option>
                <option value="public">public</option>
                <option value="private">private</option>
              </Form.Control>
            </Form.Group>

            {passwordField}
          </Card> 
          
          <Card className={createQuizStyles.card}>
            <Form.Group controlId="multiplechoicequestions" style={{margin: "0"}}>
              <Form.Label className={createQuizStyles.labels}>Multiple Choice Questions</Form.Label>
              <Form.Control type="number" placeholder="Enter number" onChange={this.handleChange} style={{marginBottom: "10px"}}/>
              {/* <p className="errormessage"> {fnameerrormsg}</p> */}
            </Form.Group>
           
            <Form.Group controlId="fillintheblankquestions" style={{margin: "0"}}>
            <Form.Label className={createQuizStyles.labels}>Fill-in the Blank Questions</Form.Label>
              <Form.Control type="number" placeholder="Enter number" onChange={this.handleChange} style={{marginBottom: "10px"}}/>
              {/* <p className="errormessage"> {fnameerrormsg}</p> */}
            </Form.Group>
           
            <Form.Group controlId="trueorfalsequestions" style={{margin: "0"}}>
            <Form.Label className={createQuizStyles.labels}>True or False Questions</Form.Label>
              <Form.Control type="number" placeholder="Enter number" onChange={this.handleChange} style={{marginBottom: "10px"}}/>
              {/* <p className="errormessage"> {fnameerrormsg}</p> */}
            </Form.Group>
          </Card> 
          
          <Card className={createQuizStyles.card}>
            <FileUploader handleChange={this.handleFile} name="file" types={fileTypes} />
            <p>{this.state.file ? `File name: ${this.state.file.name}` : "No file uploaded yet"}</p>
          </Card>  
        </Form>

        <div style={{float: "right"}}>
          <Button className={createQuizStyles.buttons} onClick= {this.clickReview} style={{marginRight: "50px"}}>Review Questions</Button>
          <Button className={createQuizStyles.buttons} onClick= {this.clickTakeQuiz} >Take Quiz</Button>
        </div>
      </Container>
      <Footer></Footer>
      </>
    );
  }
}

const mapStateToProps = (state) => ({});
const CreateQuiz = connect(mapStateToProps)(ConnectedCreateQuiz);
export default CreateQuiz;