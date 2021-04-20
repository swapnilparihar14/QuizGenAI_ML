import React from "react";
import { connect } from "react-redux";
import Auth from "../Auth";
import { Card, Form, Button, Col, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import authStyles from "../auth.module.css";
import { MdEmail, MdLock } from "react-icons/md";
import logo from "../../../assets/logo.svg";

class ConnectedLogin extends React.Component {
  constructor(){
    super();
    this.state = {
      email: "",
      password: "",
    }
  }

  handleChange = e =>{
    this.setState({ [e.target.id]: e.target.value });
  }

  clickLogIn = e =>{
    e.preventDefault();
  }

  render() {

    let loginForm = (<>
    <Col className={authStyles.columns}>
      <Card className={authStyles.cardLeft}>
        <Card.Img src={logo} style={{width: "40%", marginLeft: "auto", marginRight: "auto"}}/>
        <Card.Subtitle className={authStyles.text}>Welcome back! <br/> Log in to upload your documents, generate and share your quizzes.</Card.Subtitle>
      </Card>
    </Col>
    <Col className={authStyles.columns}>
      <Card className={authStyles.cardRight}>
        <Card.Text style={{textAlign: "right"}}><Link className={authStyles.link} to="/signup">Sign up</Link> instead?</Card.Text>
        <Card.Title style={{fontWeight: "700"}}>Log In To QuizGenAI</Card.Title> 
        <Form id="login-form" className={authStyles.form}>
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
        </Form>

        <Button className={authStyles.authButton} onClick= {this.clickLogIn} >Log In</Button>
      </Card>
    </Col>
    </>);
    
    return (
     <Auth cards = {loginForm} />
    );
  }
}

const LogIn = connect(null)(ConnectedLogin);
export default LogIn;