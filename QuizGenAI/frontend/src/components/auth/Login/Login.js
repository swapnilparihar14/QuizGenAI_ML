import React from "react";
import { connect } from "react-redux";
import Auth from "../Auth";
import { Card, Form, Button, Container, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import loginStyles from "../login.module.css";
import { Redirect } from "react-router";
import { MdEmail, MdLock } from "react-icons/md";
import logo from "../../../assets/logo.svg";

import { login, deleteErrorMessage } from "../../../actions/auth";

class ConnectedLogin extends React.Component {
  constructor(){
    super();
    this.state = {
      email: "",
      password: "",
      error: ""
    }
  }
  
  deleteError = e =>{
    this.props.dispatch(deleteErrorMessage());
  }

  handleChange = e =>{
    this.setState({ [e.target.id]: e.target.value });
  }

  handleValidation = () => {
    let {email, password} = this.state;
    let valid = true;

    let reg = /^\S+@\S+\.\S+$/;

    if (email === "" || password === "") {
      valid = false;
      this.setState({error: "Fields can't be empty"});
    }
    
    if (email !== "" && !reg.test(email)){
      valid= false;
      this.setState({error: "Email is not valid"});  
    }

    return valid;
  }

  clickLogIn = async e =>{
    e.preventDefault();

    this.setState({error: ""});  
    this.deleteError();

    if(this.handleValidation()) {
      const {
        email, password
      } = this.state;

      await this.props.dispatch(
        login({
          email, password
        })
      );
    } 
  }

  render() {

    // redirect based on successful signup
    let redirectVar = null;

    const logIn = this.props.login;

    if (logIn.isAuthenticated === true) {
      const path = "/my_quizzes";
      redirectVar = <Redirect to={path} />;
    }

    let errorMessage = (<p className={loginStyles.errormessage} style={{visibility: "hidden"}}>{"error message"}</p>);

    if(this.state.error !== "") {
        errorMessage =  (<p className={loginStyles.errormessage} style={{visibility: "visible"}}>{this.state.error}</p>); 
    }
    else if(logIn.login_error) {
      if (logIn.login_error.status < 500)
        errorMessage =  (<p className={loginStyles.errormessage} style={{visibility: "visible"}}>{logIn.login_error.data.message}</p>);
      else
      errorMessage =  (<p className={loginStyles.errormessage} style={{visibility: "visible"}}>{"Server Error. Can't login."}</p>);
    }

    let loginForm = (
    <Container className={loginStyles.container}> 
      {redirectVar}
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

        {errorMessage}
        <Button className={loginStyles.authButton} onClick= {this.clickLogIn} >Log In</Button>
        <Card.Text className={loginStyles.labels} style={{textAlign: "center", fontSize: "0.8rem", marginTop: "1rem"}}>Don&apos;t have an account? <Link className={loginStyles.link} to="/signup" onClick={this.deleteError}>Sign up</Link></Card.Text>
      </Card>
      </Container>
    );
    
    return (
     <Auth card = {loginForm} />
    );
  }
}

const mapStateToProps = state => {
  return { login: state.auth };
};

const LogIn = connect(mapStateToProps)(ConnectedLogin);
export default LogIn;