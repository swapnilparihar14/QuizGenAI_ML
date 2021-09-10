import React from "react";
import { connect } from "react-redux";
import Auth from "../Auth";
import { Card, Form, Button, Container, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import loginStyles from "../login.module.css";
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

    let loginForm = (
    // <Col className={loginStyles.columns}>
    //   <Card className={loginStyles.cardLeft}>
    //     <Card.Img src={logo} style={{width: "50%", marginLeft: "auto", marginRight: "auto"}}/>
    //     <Card.Subtitle className={loginStyles.text}>Welcome back! <br/> Log in to upload your documents, generate and share your quizzes.</Card.Subtitle>
    //     <Card.Img src={loginImage} style={{width: "80%", marginLeft: "auto", marginRight: "auto", paddingTop: "5px"}}/>
    //   </Card>
    // </Col>
    // <Col className={loginStyles.columns}>
    <Container className={loginStyles.container}> 
      <Card className={loginStyles.card}>
        <Card.Title className={loginStyles.title}>Welcome to </Card.Title> 
        <Card.Img src={logo} style={{width: "80%", marginLeft: "auto", marginRight: "auto",  marginBottom: "20px"}}/>
        <Card.Subtitle  className={loginStyles.labels} style={{fontWeight: "500", marginBottom: "5px"}}>Log in to your account</Card.Subtitle> 
        <Form id="login-form" className={loginStyles.form}>
          
          {/* Enter email */}
          <Form.Group controlId="email">
            <Form.Label className={loginStyles.labels}>Email</Form.Label>
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
            <Form.Label className={loginStyles.labels}>Password</Form.Label>
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
        </Form>

        <Button className={loginStyles.authButton} onClick= {this.clickLogIn} >Log In</Button>
        <Card.Text className={loginStyles.labels} style={{textAlign: "center", fontSize: "0.8rem", marginTop: "1rem"}}>Don&apos;t have an account? <Link className={loginStyles.link} to="/signup">Sign up</Link></Card.Text>
      </Card>
      </Container>
    );
    
    return (
     <Auth card = {loginForm} />
    );
  }
}

const LogIn = connect(null)(ConnectedLogin);
export default LogIn;