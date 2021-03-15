import React from "react";
import { connect } from "react-redux";
import Auth from "../Auth";
import { Card, Form, Button, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

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
    <Col>
      <Card>
        {/* <Card.Img> </Card.Img> */}
        <Card.Subtitle>Text</Card.Subtitle>
      </Card>
    </Col>
    <Col>
      <Card>
        <Card.Text><Link>Log in</Link> instead?</Card.Text>
        <Card.Title>Create QuizGenAI Account</Card.Title> 
        <Form id="signup-form">

          {/* Enter first name */}
          <Form.Group controlId="fname">
            <Form.Label className="labels">First Name</Form.Label>
            <Form.Control
              style={{ textTransform: "capitalize" }}
              onChange={this.handleChange}
              placeholder="Enter First Name"
            />
            {/* <p className="errormessage"> {fnameerrormsg}</p> */}
          </Form.Group>

          {/* Enter last name */}
          <Form.Group controlId="lname">
            <Form.Label className="labels">Last Name</Form.Label>
            <Form.Control
              style={{ textTransform: "capitalize" }}
              onChange={this.handleChange}
              placeholder="Enter Last Name"
            />
            {/* <p className="errormessage"> {lnameerrormsg}</p> */}
          </Form.Group>

          {/* Enter email */}
          <Form.Row>
            <Form.Group as={Col} controlId="email">
              <Form.Label className="labels">Email</Form.Label>
              <Form.Control
                onChange={this.handleChange}
                type="email"
                placeholder="Enter email"
              />
              {/* <p className="errormessage"> {emailerrormsg}</p> */}
            </Form.Group>

            {/* Enter Password */}
            <Form.Group as={Col} controlId="password">
              <Form.Label className="labels">Password</Form.Label>
              <Form.Control
                onChange={this.handleChange}
                type="password"
                placeholder="Password"
              />
              {/* <p className="errormessage"> {passerrormsg}</p> */}
            </Form.Group>
          </Form.Row>

          {/* Select type - Educator or student */}
          <Form.Group controlId="type">
            <Form.Label className="labels">What are you?</Form.Label>
            <Form.Control
              as="select"
              onChange={this.handleChange}
              name="type"
            >
              <option hidden>{} </option>
              <option value="educator">Educator</option>
              <option value="student">Student</option>
            </Form.Control>
            {/* <p className="errormessage"> {typeeerrormsg}</p> */}
          </Form.Group>
        </Form>

        <Button onClick= {this.clickSignUp} >Sign Up</Button>
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