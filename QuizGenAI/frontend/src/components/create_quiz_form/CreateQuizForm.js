import React from "react";
import {Link} from "react-router-dom";
import { connect } from "react-redux";
import NavigationBar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { Container, Row, Card, Form } from "react-bootstrap";
// import { BiLoaderCircle } from "react-icons/bi";
import { Redirect } from "react-router";
import createQuizFormStyles from "./create_quiz_form.module.css";
import { FileUploader } from "react-drag-drop-files";
import {VscLoading} from "react-icons/vsc";

import { createQuizForm, resetReviewQuestions } from "../../actions/review_questions";

class ConnectedCreateQuizForm extends React.Component {
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

  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.dispatch(
      resetReviewQuestions()
    );
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
      createQuizForm({
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
    const review_questions = this.props.reviewQuestions;

    if (review_questions.quiz_id){
      redirectQuiz = <Redirect to={"/review_questions"} />;
    } 

    const fileTypes = ["PDF", "DOC", "PPT", "HTML", "DOCX", "PPTX",];

    let { isLoading } = this.state;
    let loading = null;
    loading = (
      <div>
        {isLoading ? (
           <div className={createQuizFormStyles.loadingScreen}>
              <VscLoading className={createQuizFormStyles.loadingIcon}/>
              <h1>Generating Questions...</h1>
              <h2>Hang on, this might take some time.</h2>
              <h2>DO NOT CLOSE OR RELOAD THIS WINDOW</h2>
           </div>
        ) : (
          <div className={createQuizFormStyles.loadingScreen} style={{display: "none"}}></div>
        )}
      </div>
    );

    let passwordField = "";
    if (this.state.privacy === "private") {
      passwordField = (
        <Form.Group controlId="password">
          <Form.Label className={createQuizFormStyles.labels}>Password</Form.Label>
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
        <Form.Label className={createQuizFormStyles.labels}>Duration</Form.Label>
        <Row style={{marginLeft: "1px"}}>
          <Form.Group controlId="hours" style={{marginRight: "20px"}}>
            <Form.Label className={createQuizFormStyles.labels} >Hours</Form.Label>
            <Form.Control
              onChange={this.handleChange}
              name="hours"
              type="number"
            />
          </Form.Group>

          <Form.Group controlId="minutes">
            <Form.Label className={createQuizFormStyles.labels}>Minutes</Form.Label>
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
      <Container fluid className={createQuizFormStyles.page_header}>CREATE QUIZ</Container>
      <Container className={createQuizFormStyles.container}> 
        <Form id="create-quiz-form" className={createQuizFormStyles.form}>
          
          {/* Enter Quiz Title */}
          <Card className={createQuizFormStyles.card_header}>
            <Form.Group controlId="quizname" style={{margin: "0"}}>
              <Form.Control type="text" placeholder="Untitled Quiz" onChange={this.handleChange} style={{border: "none", fontSize: "2.5rem", paddingLeft: "0"}}/>
              {/* <p className="errormessage"> {fnameerrormsg}</p> */}
            </Form.Group>
          </Card>
      
          {/* <Card className={createQuizFormStyles.card}>
            <Form.Group controlId="graded" style={{margin: "0"}}>
              <Form.Label className={createQuizFormStyles.labels}>Graded or Ungraded</Form.Label>
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
          
          <Card className={createQuizFormStyles.card}>
            <Form.Group controlId="timed" style={{margin: "0"}}>
              <Form.Label className={createQuizFormStyles.labels}>Timed or Untimed</Form.Label>
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
          
          <Card className={createQuizFormStyles.card}>
            <Form.Group controlId="privacy" style={{margin: "0"}}>
              <Form.Label className={createQuizFormStyles.labels}>Public or Private</Form.Label>
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
          
          <Card className={createQuizFormStyles.card}>
            <Form.Group controlId="multiplechoicequestions" style={{margin: "0"}}>
              <Form.Label className={createQuizFormStyles.labels}>Multiple Choice Questions</Form.Label>
              <Form.Control type="number" placeholder="Enter number" onChange={this.handleChange} style={{marginBottom: "10px"}}/>
              {/* <p className="errormessage"> {fnameerrormsg}</p> */}
            </Form.Group>
           
            <Form.Group controlId="fillintheblankquestions" style={{margin: "0"}}>
            <Form.Label className={createQuizFormStyles.labels}>Fill-in the Blank Questions</Form.Label>
              <Form.Control type="number" placeholder="Enter number" onChange={this.handleChange} style={{marginBottom: "10px"}}/>
              {/* <p className="errormessage"> {fnameerrormsg}</p> */}
            </Form.Group>
           
            <Form.Group controlId="trueorfalsequestions" style={{margin: "0"}}>
            <Form.Label className={createQuizFormStyles.labels}>True or False Questions</Form.Label>
              <Form.Control type="number" placeholder="Enter number" onChange={this.handleChange} style={{marginBottom: "10px"}}/>
              {/* <p className="errormessage"> {fnameerrormsg}</p> */}
            </Form.Group>
          </Card> 
          
          <Card className={createQuizFormStyles.card}>
            <FileUploader handleChange={this.handleFile} name="file" types={fileTypes} />
            <p>{this.state.file ? `File name: ${this.state.file.name}` : "No file uploaded yet"}</p>
          </Card>  
        </Form>

        <div style={{float: "right"}}>
        <Link to="/review_questions" onClick= {this.clickReview} className={`btn btn-primary ${createQuizFormStyles.links}`}>Review Questions</Link>
          {/* <Button className={createQuizFormStyles.buttons} onClick= {this.clickTakeQuiz} >Take Quiz</Button> */}
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

const CreateQuizForm = connect(mapStateToProps)(ConnectedCreateQuizForm);
export default CreateQuizForm;