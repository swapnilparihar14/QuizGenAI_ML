import React from "react";
import { connect } from "react-redux";
import Auth from "../Auth";
import { Card, Form, Button, Col, InputGroup, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import authStyles from "../auth.module.css";
import { BsPersonFill } from "react-icons/bs"
import { MdEmail, MdLock } from "react-icons/md"
import { FaArrowAltCircleRight } from "react-icons/fa"

class ConnectedSignup extends React.Component {
  constructor(){
    super();
    this.state = {
      fname: "",
      lname: "",
      email: "",
      password: "",
      type: "",
    }
  }

  handleChange = e =>{
    this.setState({ [e.target.id]: e.target.value });
  }

  clickSignUp = e =>{
    e.preventDefault();
  }

  render() {

    let signupForm = (<>
    <Col className={authStyles.columns}>
      <Card className={authStyles.cardLeft}>
        {/* <Card.Img> </Card.Img> */}
        <Card.Subtitle className={authStyles.text}>Welcome to awesomeness! <br/> Register to upload your documents, generate and share your quizzes.</Card.Subtitle>
      </Card>
    </Col>
    <Col className={authStyles.columns}>
      <Card className={authStyles.cardRight}>
        <Card.Text style={{textAlign: "right"}}><Link className={authStyles.link} to="/login">Log in</Link> instead?</Card.Text>
        <Card.Title style={{fontWeight: "700"}}>Create QuizGenAI Account</Card.Title> 
        <Form id="signup-form" className={authStyles.form}>
          <Row>
            {/* Enter first name */}
            <Form.Group as={Col} controlId="fname">
              <Form.Label className={authStyles.labels}>First Name</Form.Label>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>
                    <BsPersonFill />
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  className={authStyles.fields}
                  onChange={this.handleChange}
                />
              </InputGroup>
              {/* <p className="errormessage"> {fnameerrormsg}</p> */}
            </Form.Group>
          
          
            {/* Enter last name */}
            <Form.Group  as={Col} controlId="lname">
              <Form.Label className={authStyles.labels}>Last Name</Form.Label>
              {/* <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>
                    <BsPersonFill />
                  </InputGroup.Text>
                </InputGroup.Prepend> */}
                <Form.Control
                  className={authStyles.fields}
                  onChange={this.handleChange}
                />
              {/* </InputGroup> */}
              {/* <p className="errormessage"> {lnameerrormsg}</p> */}
            </Form.Group>
          </Row>

          {/* Enter email */}
          <Form.Group controlId="email">
            <Form.Label className={authStyles.labels}>Email</Form.Label>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>
                  <MdEmail />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                className={authStyles.fields}
                onChange={this.handleChange}
                type="email"
              />
            </InputGroup>
            {/* <p className="errormessage"> {emailerrormsg}</p> */}
          </Form.Group>

          {/* Enter Password */}
          <Form.Group controlId="password">
            <Form.Label className={authStyles.labels}>Password</Form.Label>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>
                  <MdLock />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                className={authStyles.fields}
                onChange={this.handleChange}
                type="password"
              />
            </InputGroup>
            {/* <p className="errormessage"> {passerrormsg}</p> */}
          </Form.Group>

          {/* Select type - Educator or student */}
          <Form.Group controlId="type">
            <Form.Label className={authStyles.labels}>Select what best describes you</Form.Label>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>
                  <FaArrowAltCircleRight />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                className={authStyles.fields}
                as="select"
                onChange={this.handleChange}
                name="type"
              >
                <option hidden>{"Select"} </option>
                <option value="educator">Professor</option>
                <option value="student">Student</option>
              </Form.Control>
            </InputGroup>
            {/* <p className="errormessage"> {typeeerrormsg}</p> */}
          </Form.Group>
        </Form>

        <Button className={authStyles.authButton} onClick= {this.clickSignUp} >Sign Up</Button>
      </Card>
    </Col>
    </>);
    
    return (
     <Auth cards = {signupForm} />
    );
  }
}

const SignUp = connect(null)(ConnectedSignup);
export default SignUp;