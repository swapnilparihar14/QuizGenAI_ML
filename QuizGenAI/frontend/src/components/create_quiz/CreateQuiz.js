import React from "react";
import {Link} from "react-router-dom";
import { connect } from "react-redux";
import NavigationBar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { Container, Row, Card, Form } from "react-bootstrap";
// import { BiLoaderCircle } from "react-icons/bi";
import { Redirect } from "react-router";
import createQuizStyles from "./create_quiz.module.css";
import { FileUploader } from "react-drag-drop-files";
import {VscLoading} from "react-icons/vsc";

import { createQuiz } from "../../actions/create_quiz";

class ConnectedCreateQuiz extends React.Component {
  constructor(){
    super();
    this.state = {
      isLoading: false,
      quizname: "",
      // graded: "",
      timed: "",
      hours: 0,
      minutes: 0,
      privacy: "",
      password: "",
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
      quizname, timed, hours, minutes, privacy, password, multiplechoicequestions, fillintheblankquestions, trueorfalsequestions, file
    } = this.state;

    let id = localStorage.getItem("id");

    await this.props.dispatch(
      createQuiz({
        quizname, timed, hours, minutes, privacy, password, multiplechoicequestions, fillintheblankquestions, trueorfalsequestions, id 
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
    const quiz = this.props.quiz;

    if (quiz.quiz_id){
      redirectQuiz = <Redirect to={"/review_questions"} />;
    } 

    const fileTypes = ["PDF", "DOC", "PPT", "HTML", "DOCX", "PPTX",];

    let { isLoading } = this.state;
    let loading = null;
    loading = (
      <div>
        {isLoading ? (
           <div className={createQuizStyles.loadingScreen}>
             <VscLoading className={createQuizStyles.loadingIcon}/>
             <h1>Loading...</h1>
           </div>
        ) : (
          <div className={createQuizStyles.loadingScreen} style={{display: "none"}}></div>
        )}
      </div>
    );

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

    let durationFields = "";
    if (this.state.timed === "yes") {
      durationFields = (<>
        <Form.Label className={createQuizStyles.labels}>Duration</Form.Label>
        <Row style={{marginLeft: "1px"}}>
          <Form.Group controlId="hours" style={{marginRight: "20px"}}>
            <Form.Label className={createQuizStyles.labels} >Hours</Form.Label>
            <Form.Control
              onChange={this.handleChange}
              name="hours"
              type="number"
            />
          </Form.Group>

          <Form.Group controlId="minutes">
            <Form.Label className={createQuizStyles.labels}>Minutes</Form.Label>
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
      
          {/* <Card className={createQuizStyles.card}>
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
          </Card>  */}
          
          <Card className={createQuizStyles.card}>
            <Form.Group controlId="timed" style={{margin: "0"}}>
              <Form.Label className={createQuizStyles.labels}>Timed or Untimed</Form.Label>
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
                <option value="public">Public</option>
                <option value="private">Private</option>
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
        <Link to="/review_questions" onClick= {this.clickReview} className={`btn btn-primary ${createQuizStyles.links}`}>Review Questions</Link>
          {/* <Button className={createQuizStyles.buttons} onClick= {this.clickTakeQuiz} >Take Quiz</Button> */}
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
    quiz: state.createQuiz
  };
};

const CreateQuiz = connect(mapStateToProps)(ConnectedCreateQuiz);
export default CreateQuiz;