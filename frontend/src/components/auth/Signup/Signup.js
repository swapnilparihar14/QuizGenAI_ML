import React from "react";
import { connect } from "react-redux";
import Auth from "../Auth";
import { Card, Form, Button, Container, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Redirect } from "react-router";
import signupStyles from "../signup.module.css";
import { BsPersonFill } from "react-icons/bs";
import { MdEmail, MdLock } from "react-icons/md";
import { FaArrowAltCircleRight } from "react-icons/fa";
import logo from "../../../assets/logo-light.svg";

import { signup } from "../../../actions/auth";

class ConnectedSignup extends React.Component {
  constructor(){
    super();
    this.state = {
      fname: "",
      lname: "",
      email: "",
      password: "",
      type: ""
    }
  }

  handleChange = e =>{
    this.setState({ [e.target.id]: e.target.value });
  }

  clickSignUp = async e =>{
    e.preventDefault();
  
    const {
      fname, lname, email, password, type
    } = this.state;

    await this.props.dispatch(
      signup({
        fname, lname, email, password, type
      })
    );
  }

  render() {

    // redirect based on successful signup
    let redirectVar = null;

    const signUp = this.props.signup;

    if (signUp.isAuthenticated === true) {
      const id = localStorage.getItem("id");
      const path = `/my_quizzes/${id}`;
      redirectVar = <Redirect to={path} />;
    }

    let errorMessage = "";
    if(signUp.message)
      errorMessage = signUp.message;


    let signupForm = (
    <Container className={signupStyles.container}> 
      {redirectVar}
      <Card className={signupStyles.card}>
        <div className={signupStyles.background_title}>
          <Card.Title className={signupStyles.title}>Welcome to </Card.Title>
          <Card.Img src={logo} style={{width: "80%", marginLeft: "auto", marginRight: "auto",  display: "block", marginBottom: "20px"}}/>
        </div>
          <Card.Subtitle  className={signupStyles.labels} style={{fontWeight: "500", marginBottom: "5px"}}>Create an account</Card.Subtitle> 
        <Form id="signup-form" className={signupStyles.form}>
        
          {/* Enter first name */}
          <Form.Group controlId="fname">
            <Form.Label className={signupStyles.labels}>First Name</Form.Label>
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
            <Form.Label className={signupStyles.labels}>Last Name</Form.Label>
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
            <Form.Label className={signupStyles.labels}>Email</Form.Label>
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
            <Form.Label className={signupStyles.labels}>Password</Form.Label>
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
            <Form.Label className={signupStyles.labels}>Select what best describes you</Form.Label>
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
                <option value="instructor">Instructor</option>
                <option value="student">Student</option>
              </Form.Control>
            </InputGroup>
            {/* <p className="errormessage"> {typeeerrormsg}</p> */}
          </Form.Group>
        </Form>

        <p className={signupStyles.errormessage}>{errorMessage}</p>
        <Button className={signupStyles.authButton} onClick= {this.clickSignUp} >Sign Up</Button>
        <Card.Text className={signupStyles.labels} style={{textAlign: "center", fontSize: "0.8rem", marginTop: "1rem"}}>Already have an account? <Link className={signupStyles.link} to="/login">Log in</Link></Card.Text>
      </Card>
      </Container>
   );
    
    return (
     <Auth card = {signupForm} />
    );
  }
}

const mapStateToProps = state => {
  return { signup: state.auth };
};

const SignUp = connect(mapStateToProps)(ConnectedSignup);
export default SignUp;