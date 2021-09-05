import React from "react";
import { connect } from "react-redux";
import Auth from "../Auth";
import { Card, Form, Button, Col, InputGroup, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import authStyles from "../auth.module.css";
import { BsPersonFill } from "react-icons/bs";
import { MdEmail, MdLock } from "react-icons/md";
import { FaArrowAltCircleRight } from "react-icons/fa";
import logo from "../../../assets/logo.svg";
import loginImage from "../../../assets/login-image.png";

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
    {/* <Col className={authStyles.columns}>
      <Card className={authStyles.cardLeft}>
        <Card.Img src={logo} style={{width: "50%", marginLeft: "auto", marginRight: "auto"}}/>
        <Card.Subtitle className={authStyles.text}>Welcome! <br/> Register to upload your documents, generate and share your quizzes.</Card.Subtitle>
        <Card.Img src={loginImage} style={{width: "80%", marginLeft: "auto", marginRight: "auto", paddingTop: "10px"}}/>
      </Card>
    </Col>
    <Col className={authStyles.columns}> */}
      <Card className={authStyles.card}>
        <Card.Title className={authStyles.title}>Welcome to </Card.Title>
        <Card.Img src={logo} style={{width: "70%", marginLeft: "auto", marginRight: "auto",  marginBottom: "20px"}}/>
        {/* <Card.Img src={loginImage} style={{width: "20%", marginLeft: "auto", marginRight: "auto", paddingTop: "10px"}}/> */}
        <Card.Subtitle  className={authStyles.labels} style={{fontWeight: "500"}}>Create an account</Card.Subtitle> 
        <Form id="signup-form" className={authStyles.form}>
        
          {/* Enter first name */}
          <Form.Group controlId="fname">
            <Form.Label className={authStyles.labels}>First Name</Form.Label>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>
                  <BsPersonFill />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                onChange={this.handleChange}
              />
            </InputGroup>
            {/* <p className="errormessage"> {fnameerrormsg}</p> */}
          </Form.Group>
          
          
          {/* Enter last name */}
          <Form.Group controlId="lname">
            <Form.Label className={authStyles.labels}>Last Name</Form.Label>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>
                  <BsPersonFill />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                onChange={this.handleChange}
              />
            </InputGroup>
            {/* <p className="errormessage"> {lnameerrormsg}</p> */}
          </Form.Group>

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
        <Card.Text  className={authStyles.labels} style={{textAlign: "center", fontSize: "0.8rem", marginTop: "1rem"}}>Already have an account? <Link className={authStyles.link} to="/login">Log in</Link></Card.Text>
      </Card>
    </>);
    
    return (
     <Auth card = {signupForm} />
    );
  }
}

const SignUp = connect(null)(ConnectedSignup);
export default SignUp;