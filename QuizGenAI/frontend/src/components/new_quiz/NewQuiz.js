import React from "react";
import {Link} from "react-router-dom";
import { connect } from "react-redux";
import NavigationBar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { Container, Row, Card, Button, Form } from "react-bootstrap";
import newQuizStyles from "./new_quiz.module.css";
import { FileUploader } from "react-drag-drop-files";


class ConnectedNewQuiz extends React.Component {
  constructor(){
    super();
    this.state = {
      timed: "",
      hours: "",
      minutes: "",
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

  clickTakeNewQuiz = ()=> {
    
  }

  render() {
    const fileTypes = ["PDF", "DOC", "PPT", "HTML", "DOCX", "PPTX",];

    let durationFields = "";
    if (this.state.timed === "yes") {
      durationFields = (<>
        <Form.Label className={newQuizStyles.labels}>Duration</Form.Label>
        <Row style={{marginLeft: "1px"}}>
          <Form.Group controlId="duration_hr" style={{marginRight: "20px"}}>
            <Form.Label className={newQuizStyles.labels} >Hours</Form.Label>
            <Form.Control
              onChange={this.handleChange}
              name="duration_hr"
              type="number"
            />
          </Form.Group>

          <Form.Group controlId="duration_min">
            <Form.Label className={newQuizStyles.labels}>Minutes</Form.Label>
            <Form.Control
              onChange={this.handleChange}
              name="duration_min"
              type="number"
            />
          </Form.Group>
        </Row>
        </>
      );
    }
    
    return (<>
      <NavigationBar boolLoggedIn={true}></NavigationBar>
      <Container fluid className={newQuizStyles.page_header}>TAKE NEW QUIZ</Container>
      <Container className={newQuizStyles.container}> 
        <Form id="take-new-quiz-form" className={newQuizStyles.form}>
          
          <Card className={newQuizStyles.card_header}>
            <Form.Group controlId="timed" style={{margin: "0"}}>
              <Form.Label className={newQuizStyles.labels}>Timed or Untimed</Form.Label>
              <Form.Control
                as="select"
                onChange={this.handleChange}
                name="timed"
                style={{marginBottom: "10px"}}
              >
                <option hidden>{"Select"} </option>
                <option value="yes">Timed</option>
                <option value="no">Untimed</option>
              </Form.Control>
            </Form.Group>

            {durationFields}
          </Card>
          
          <Card className={newQuizStyles.card}>
            <Form.Group controlId="multiplechoicequestions" style={{margin: "0"}}>
              <Form.Label className={newQuizStyles.labels}>Multiple Choice Questions</Form.Label>
              <Form.Control type="number" placeholder="Enter number" onChange={this.handleChange} style={{marginBottom: "10px"}}/>
              {/* <p className="errormessage"> {fnameerrormsg}</p> */}
            </Form.Group>
           
            <Form.Group controlId="fillintheblankquestions" style={{margin: "0"}}>
            <Form.Label className={newQuizStyles.labels}>Fill-in the Blank Questions</Form.Label>
              <Form.Control type="number" placeholder="Enter number" onChange={this.handleChange} style={{marginBottom: "10px"}}/>
              {/* <p className="errormessage"> {fnameerrormsg}</p> */}
            </Form.Group>
           
            <Form.Group controlId="trueorfalsequestions" style={{margin: "0"}}>
            <Form.Label className={newQuizStyles.labels}>True or False Questions</Form.Label>
              <Form.Control type="number" placeholder="Enter number" onChange={this.handleChange} style={{marginBottom: "10px"}}/>
              {/* <p className="errormessage"> {fnameerrormsg}</p> */}
            </Form.Group>
          </Card> 
          
          <Card className={newQuizStyles.card}>
            <FileUploader handleChange={this.handleFile} name="file" types={fileTypes} />
            <p>{this.state.file ? `File name: ${this.state.file.name}` : "No file uploaded yet"}</p>
          </Card>  
        </Form>

        <div style={{float: "right"}}>
        <Link to="/take_quiz_questions" onClick= {this.clickReview} className={`btn btn-primary ${newQuizStyles.links}`}>Take Quiz</Link>
        </div>
      </Container>
      <Footer boolLoggedIn={true}></Footer>
      </>
    );
  }
}

const mapStateToProps = (state) => ({});
const NewQuiz = connect(mapStateToProps)(ConnectedNewQuiz);
export default NewQuiz;