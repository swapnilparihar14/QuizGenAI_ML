import React from "react";
import navbarStyles from "./navbar.module.css";
import { connect } from "react-redux";
import { Navbar, Nav, NavDropdown, Image, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.svg";

class ConnectedNavBar extends React.Component {
  constructor() {
    super();
    this.state = {
      boolLoggedIn: false,
    }
  }

  render(){

    let nav = null;
    if (this.state.boolLoggedIn === true){
      // nav =  <Nav className="ml-auto">
      //         <Link >
      //           <span>Create Quiz</span>
      //         </Link>
      //         <Link >
      //           <span>Take Quiz</span>
      //         </Link>
      //         <Link >
      //           <span>Public Quizzes</span>
      //         </Link>
      //         <NavDropdown title="Hi, Pranav">
      //           <Link>
      //             Profile
      //           </Link>
      //           <Link>
      //             My Quizzes
      //           </Link>
      //           <Link>
      //             Taken Quizzes
      //           </Link>
      //           <NavDropdown.Divider />
      //           <Link onClick={this.handleLogout} to="/">
      //             Log Out
      //           </Link>
      //         </NavDropdown>
      //       </Nav>;
    }
    else {
      nav =  <Nav id={navbarStyles.nav}>
              <Link to={"/signup"}  className={navbarStyles.links}>
              Sign Up
              </Link>
              <span className={navbarStyles.separator}>|</span>
              <Link to={"/login"} className={navbarStyles.links}>
              Log In
              </Link>
            </Nav>;
    }

    return(
      <Navbar id={navbarStyles.navbar} expand="true">
        <Navbar.Brand >
          <Nav.Link href={this.props.logoLink} style={{ padding: "0" }}>
            <Image src={logo} alt="QuizGenAI Logo" style={{ minWidth: "150px" }}/>
          </Nav.Link>
        </Navbar.Brand>
        {nav}   
      </Navbar>
    );
  }
}
const mapStateToProps = (state) => ({});
const NavigationBar = connect(mapStateToProps)(ConnectedNavBar);
export default NavigationBar;

