import React from "react";
import { Container, Image, Col, Row } from "react-bootstrap";
import landpageStyles from "./landpage.module.css";
import NavigationBar from "../navbar/Navbar"
import container1Image from "../../assets/landpage-container1.png";
import { Link } from "react-router-dom";

class Landpage extends React.Component {
  scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  render() {

    
    return (
      <div style={{position:"relative"}}>
        <NavigationBar logoLink={this.scrollToTop()}/>
        <Container id={landpageStyles.container1}>
          <Row id={landpageStyles.row}>
            <Col id={landpageStyles.column1}>
              <h1>AI Automated Quiz Generator</h1>
              <h2>Generating  Quizzes<br/> 
              Saving Time<br/>  
              Empowering educators and students</h2>
            </Col>
            <Col id={landpageStyles.column2}>
              <Image id={landpageStyles.container1_image} src={container1Image}/>
            </Col>
          </Row>
        </Container>
        <Container id={landpageStyles.container2}>
          <h1>How It Works</h1>
          <hr></hr>
        </Container>
        <Container id={landpageStyles.container3}>
          <Container>
            <h1>Company</h1>
            <hr></hr>
            <div id={landpageStyles.links}>
              <Link to="#" >Services</Link>
              <br></br>
              <Link to="#" >Contact Us</Link>
              <br></br>
              <Link to="#">About Us</Link>
            </div>
          </Container>
          <p>Copyright &#169; 2021-2022 | <span>QuizGenAI Inc.</span> | Privacy Policy | Terms of use</p>
        </Container>
      </div>
    );
  }
}

export default Landpage;