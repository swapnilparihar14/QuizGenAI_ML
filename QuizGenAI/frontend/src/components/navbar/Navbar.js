import React from "react";
import navbarStyles from "./navbar.module.css";
import { connect } from "react-redux";
import { Navbar, Nav, NavDropdown, Image, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.svg";
import logo2 from "../../assets/logo-light.svg";

import { logout } from "../../actions/auth";

class ConnectedNavBar extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  handleLogout = async (e) => {
    e.preventDefault();

    await this.props.dispatch(logout());
  };

  render() {
    let nav = null;
    let navTabs = null;

    if (this.props.auth.isAuthenticated === true) {
      if(this.props.auth.type === "instructor"){
        navTabs = <> 
          <Link
          to={"/create_quiz"}
          className={navbarStyles.links_dark}
          style={{ display: "block", padding: "10px" }}
          >
          Create Quiz
          </Link>
          <span className={navbarStyles.separator}>|</span>
        </>
      }
      else {
        navTabs = <>
          <Link
          to={"/practice_quiz"}
          className={navbarStyles.links_dark}
          style={{ display: "block", padding: "10px" }}
        >
          Practice Quiz
        </Link>
        <span className={navbarStyles.separator}>|</span>
        <Link
          to={"/take_quiz"}
          className={navbarStyles.links_dark}
          style={{ display: "block", padding: "10px" }}
        >
          Take Quiz
        </Link>
        <span className={navbarStyles.separator}>|</span>
        </>
      }

      nav = (
        <Navbar collapseOnSelect id={navbarStyles.navbar_dark} expand="md">
          <Navbar.Brand>
            <Link to={"/my_quizzes"}>
              <Image
                src={logo2}
                alt="QuizGenAI Logo"
                style={{ paddingTop: "0.5rem", maxWidth: "50%", width: "50%" }}
              />
            </Link>
          </Navbar.Brand>
          <Container style={{ marginRight: "20px", width: "auto" }}>
            <Nav id={navbarStyles.nav}>
              <Link
                to={"/my_quizzes"}
                className={navbarStyles.links_dark}
                style={{ display: "block", padding: "10px" }}
              >
                Home
              </Link>
              <span className={navbarStyles.separator}>|</span>
              {navTabs}
              <NavDropdown
                title={`Hi, ` + this.props.auth.first_name}
                className={navbarStyles.links_dark}
                style={{
                  display: "block",
                  padding: "1px",
                  fontWeight: "bolder",
                }}
              >
                {/* <NavDropdown.Item href="#action3">
                      <Link to="/">
                        Profile
                      </Link>
                    </NavDropdown.Item> */}
                {/* <NavDropdown.Item href="#action3">
                      <Link>
                        My Quizzes
                      </Link>
                    </NavDropdown.Item> */}
                {/* <NavDropdown.Item href="#action3">
                      <Link>
                        Taken Quizzes
                      </Link>
                    </NavDropdown.Item> */}
                {/* <NavDropdown.Divider /> */}
                <Link
                  onClick={this.handleLogout}
                  to="/"
                  className={navbarStyles.logout}
                >
                  Log Out
                </Link>
              </NavDropdown>
            </Nav>
          </Container>
        </Navbar>
      );
    } else {
      nav = (
        <Navbar collapseOnSelect id={navbarStyles.navbar_light} expand="md">
          <Navbar.Brand href="#">
            <Image
              src={logo}
              alt="QuizGenAI Logo"
              style={{ paddingTop: "0.5rem", maxWidth: "50%", width: "50%" }}
            />
          </Navbar.Brand>
          <Container style={{ marginRight: "20px", width: "auto" }}>
            <Navbar.Toggle
              aria-controls="responsive-navbar-nav"
              style={{ borderColor: "var(--blue)", color: "var(--blue)" }}
            />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav id={navbarStyles.nav}>
                <Link
                  to={"/signup"}
                  className={navbarStyles.links_light}
                  style={{ display: "block", padding: "10px" }}
                >
                  Sign Up
                </Link>
                <span className={navbarStyles.separator}>|</span>
                <Link
                  to={"/login"}
                  className={navbarStyles.links_light}
                  style={{ display: "block", padding: "10px" }}
                >
                  Log In
                </Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      );
    }

    return <>{nav}</>;
  }
}

const mapStateToProps = (state) => {
  return { auth: state.auth };
};

const NavigationBar = connect(mapStateToProps)(ConnectedNavBar);
export default NavigationBar;
