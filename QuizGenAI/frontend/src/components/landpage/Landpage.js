import React from "react";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import { Container, Image, Col, Row } from "react-bootstrap";
import landpageStyles from "./landpage.module.css";
import NavigationBar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import container1Image from "../../assets/landpage-container1.png";
import uploadLogo from "../../assets/upload-logo.png";
import quizLogo from "../../assets/quiz.png";
import { MdFileUpload } from "react-icons/md";
import {GiClick} from "react-icons/gi";

class ConnectedLandpage extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    // redirect based on authentication
    let redirectVar = null;

    const auth = this.props.auth;

    if (auth.isAuthenticated === true) {
      const path = "/my_quizzes";
      redirectVar = <Redirect to={path} />;
    }
    
    return (
      <>
      {redirectVar}
      <div style={{top: "0", zIndex: "100", position: "fixed", width: "100%"}}>
        <NavigationBar></NavigationBar>
      </div>
      <div id={landpageStyles.flex}>
        <div className={landpageStyles.flexChild}>
          <Row xs={12} md={12} lg={12} id={landpageStyles.row}>
            <Col xs={6} md={6} lg={6} id={landpageStyles.column1}>
              <h1>AI Automated Quiz Generator</h1>
              <h2 className={landpageStyles.tagline}>Saving Time<br/></h2>
              <h2 className={landpageStyles.tagline}>&nbsp;Generating Quizzes<br/></h2>  
              <h2 className={landpageStyles.tagline}>&nbsp;&nbsp;Empowering instructors and students</h2>
            </Col>
            <Col xs={6} md={6} lg={6} id={landpageStyles.column2}>
              <Image id={landpageStyles.container1_image} src={container1Image}/>
            </Col>
          </Row>
        </div>
        <div className={landpageStyles.flexChild} id={landpageStyles.container2}>
          <h1>How It Works</h1>
          <hr></hr>
          <div id={landpageStyles.stepsContainer}>
            <Container className={landpageStyles.steps}>
              <div className={landpageStyles.circles}><MdFileUpload className={landpageStyles.logos}></MdFileUpload></div>
              <h4>1. Upload a text file</h4> 
            </Container>
            <Container className={landpageStyles.steps}>
              <div className={landpageStyles.circles}><img src={uploadLogo} className={landpageStyles.logos} alt="upload logo"></img></div>
              <h4>2. Wait for quiz creation</h4> 
            </Container>
            <Container className={landpageStyles.steps}>
              <div className={landpageStyles.circles}><GiClick className={landpageStyles.logos}></GiClick></div>
              <h4>3. Select questions</h4> 
            </Container>
            <Container className={landpageStyles.steps}>
              <div className={landpageStyles.circles}><img src={quizLogo} className={landpageStyles.logos} alt="quiz logo"></img></div>
              <h4>4. Quiz is ready</h4>
            </Container>
          </div>
        </div>
      </div>
      <Footer></Footer>
      </>
    );
  }
}

const mapStateToProps = state => {
  return { 
    auth: state.auth,
  };
};

const Landpage = connect(mapStateToProps)(ConnectedLandpage);
export default Landpage;