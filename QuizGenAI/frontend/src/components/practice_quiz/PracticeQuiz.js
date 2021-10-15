import React from "react";
import {Link} from "react-router-dom";
import { connect } from "react-redux";
import NavigationBar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { Container, Row, Card, Form } from "react-bootstrap";
import { Redirect } from "react-router";
import practiceQuizStyles from "./practice_quiz.module.css";
import { FileUploader } from "react-drag-drop-files";
import {VscLoading} from "react-icons/vsc";

import { getReviewQuestions } from "../../actions/review_questions";

class ConnectedPracticeQuiz extends React.Component {
  constructor(){
    super();
    this.state = {
      isLoading: false,
      quizname: "",
      timed: "",
      hours: 0,
      minutes: 0,
      multiplechoicequestions: 0,
      fillintheblankquestions: 0,
      trueorfalsequestions: 0,
      file: null,
    }
  }

  componentWillUnmount(){
    this.setState({
      isLoading: false
    });
  }

  handleChange = e =>{
    this.setState({ [e.target.id]: e.target.value });
  }

  handleFile = (file) => {
    this.setState({ file });
  };

  clickReview = async e =>{
    e.preventDefault();

    this.setState({
      isLoading: true
    });
   
    const {
      quizname, timed, hours, minutes, multiplechoicequestions, fillintheblankquestions, trueorfalsequestions, file
    } = this.state;

    let id = localStorage.getItem("id");

    await this.props.dispatch(
      getReviewQuestions({
        quizname, timed, hours, minutes, multiplechoicequestions, fillintheblankquestions, trueorfalsequestions, id 
      }, file)
    );
  }


  render() {
    // redirect based on authentication
    let redirectVar = null;

    const auth = this.props.auth;

    if (auth.isAuthenticated === false) {
      const path = "/";
      redirectVar = <Redirect to={path} />;
    }

    // redirect to review questions once the quiz is created
    let redirectQuiz = null;
    const review_questions = this.props.reviewQuestions;

    if (review_questions.quiz_id){
      redirectQuiz = <Redirect to={"/review_questions"} />;
    } 

    // Send file types in the following form because of how the library react-drag-drop-files works
    // txt = "plain"
    // pdf = "pdf"
    // pptx = "vnd.openxmlformats-officedocument.presentationml.presentation"
    // html = "html"
    // doc = "msword"
    // docx = "vnd.openxmlformats-officedocument.wordprocessingml.document"

    const fileTypes = ["PDF", "PLAIN", "HTML", "vnd.openxmlformats-officedocument.presentationml.presentation"];
    const fileTypesToDisplay = ["PDF", "TXT", "HTML", "PPT"];

    let { isLoading } = this.state;
    let loading = null;
    loading = (
      <div>
        {isLoading ? (
           <div className={practiceQuizStyles.loadingScreen}>
              <VscLoading className={practiceQuizStyles.loadingIcon}/>
              <h1>Generating Questions ...</h1>
              <h2>Hang on, this might take some time.</h2>
              <h2>DO NOT CLOSE OR RELOAD THIS WINDOW</h2>
           </div>
        ) : (
          <div className={practiceQuizStyles.loadingScreen} style={{display: "none"}}></div>
        )}
      </div>
    );

    let durationFields = "";
    if (this.state.timed === "yes") {
      durationFields = (<>
        <Form.Label className={practiceQuizStyles.labels}>Duration</Form.Label>
        <Row style={{marginLeft: "1px"}}>
          <Form.Group controlId="hours" style={{marginRight: "20px"}}>
            <Form.Label className={practiceQuizStyles.labels} >Hours</Form.Label>
            <Form.Control
              onChange={this.handleChange}
              name="hours"
              type="number"
            />
          </Form.Group>

          <Form.Group controlId="minutes">
            <Form.Label className={practiceQuizStyles.labels}>Minutes</Form.Label>
            <Form.Control
              onChange={this.handleChange}
              name="minutes"
              type="number"
            />
          </Form.Group>
        </Row>
        </>
      );
    }
    
    return (<>
      {redirectVar}
      {redirectQuiz}
      {loading}
      <NavigationBar></NavigationBar>
      <Container fluid className={practiceQuizStyles.page_header}>PRACTICE QUIZ</Container>
      <Container className={practiceQuizStyles.container}> 
        <Form id="create-quiz-form" className={practiceQuizStyles.form}>
          
          {/* Enter Quiz Title */}
          <Card className={practiceQuizStyles.card_header}>
            <Form.Group controlId="quizname" style={{margin: "0"}}>
              <Form.Control type="text" placeholder="Untitled Quiz" onChange={this.handleChange} style={{border: "none", fontSize: "2.5rem", paddingLeft: "0"}}/>
              {/* <p className="errormessage"> {fnameerrormsg}</p> */}
            </Form.Group>
          </Card>
          
          <Card className={practiceQuizStyles.card}>
            <Form.Group controlId="timed" style={{margin: "0"}}>
              <Form.Label className={practiceQuizStyles.labels}>Timed or Untimed</Form.Label>
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
          
          <Card className={practiceQuizStyles.card}>
            <h2 className={practiceQuizStyles.instructions}>Enter the number of questions to be generated</h2>
            <Form.Group controlId="multiplechoicequestions" style={{margin: "0"}}>
              <Form.Label className={practiceQuizStyles.labels}>Multiple Choice Questions</Form.Label>
              <Form.Control type="number" placeholder="Enter number" onChange={this.handleChange} style={{marginBottom: "10px"}}/>
              {/* <p className="errormessage"> {fnameerrormsg}</p> */}
            </Form.Group>
           
            <Form.Group controlId="fillintheblankquestions" style={{margin: "0"}}>
            <Form.Label className={practiceQuizStyles.labels}>Fill-in the Blank Questions</Form.Label>
              <Form.Control type="number" placeholder="Enter number" onChange={this.handleChange} style={{marginBottom: "10px"}}/>
              {/* <p className="errormessage"> {fnameerrormsg}</p> */}
            </Form.Group>
           
            <Form.Group controlId="trueorfalsequestions" style={{margin: "0"}}>
            <Form.Label className={practiceQuizStyles.labels}>True or False Questions</Form.Label>
              <Form.Control type="number" placeholder="Enter number" onChange={this.handleChange} style={{marginBottom: "10px"}}/>
              {/* <p className="errormessage"> {fnameerrormsg}</p> */}
            </Form.Group>
          </Card> 
          
          <Card className={practiceQuizStyles.card}>
            <h2 className={practiceQuizStyles.instructions}>Upload File</h2>
            <p className={practiceQuizStyles.fileTypes}>Accepted file types: {fileTypesToDisplay.join(", ")}</p>
            <FileUploader handleChange={this.handleFile} name="file" types={fileTypes} />
            <p>{this.state.file ? `File name: ${this.state.file.name}` : "No file uploaded"}</p>
          </Card>  
        </Form>

        <div style={{float: "right"}}>
        <Link to="/review_questions" onClick= {this.clickReview} className={`btn btn-primary ${practiceQuizStyles.links}`}>Take Practice Quiz</Link>
        </div>
      </Container>
      <Footer></Footer>
      </>
    );
  }
}

const mapStateToProps = state => {
  return { 
    auth: state.auth,
    reviewQuestions: state.reviewQuestions
  };
};

const PracticeQuiz = connect(mapStateToProps)(ConnectedPracticeQuiz);
export default PracticeQuiz;