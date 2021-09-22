import React from "react";
// import { Container, Image, Col, Row } from "react-bootstrap";
// import landpageStyles from "./landpage.module.css";
import NavigationBar from "../navbar/Navbar";
import Footer from "../footer/Footer";
// import container1Image from "../../assets/landpage-container1.png";
// import uploadLogo from "../../assets/upload-logo.png";
// import { Link } from "react-router-dom";
// import { MdFileUpload } from "react-icons/md";
// import {GiClick} from "react-icons/gi";

class Landpage extends React.Component {
  // scrollToTop = () => {
  //   window.scrollTo(0, 0);
  // };

  render() {

    
    return (
      // <div style={{position:"relative"}}>
      //   <NavigationBar logoLink={this.scrollToTop()}/>
      //   <Row id={landpageStyles.row}>
      //     <Col id={landpageStyles.column1}>
      //       <h1>AI Automated Quiz Generator</h1>
      //       <h2 id={landpageStyles.tagline}>Generating  Quizzes<br/> 
      //       Saving Time<br/>  
      //       Empowering educators and students</h2>
      //     </Col>
      //     <Col id={landpageStyles.column2}>
      //       <Image id={landpageStyles.container1_image} src={container1Image}/>
      //     </Col>
      //   </Row>
      //   <Container id={landpageStyles.container2}>
      //     <h1>How It Works</h1>
      //     <hr></hr>
      //     <Container className={landpageStyles.steps}>
      //       <div className={landpageStyles.circles}><MdFileUpload className={landpageStyles.logos}></MdFileUpload></div>
      //       {/* <h3>1. Upload a text file</h3> */}
      //     </Container>
      //     <Container className={landpageStyles.steps}>
      //       <div className={landpageStyles.circles}><img src={uploadLogo} className={landpageStyles.logos}></img></div>
      //     </Container>
      //     <Container className={landpageStyles.steps}>
      //       <div className={landpageStyles.circles}><GiClick className={landpageStyles.logos}></GiClick></div>
      //     </Container>
      //     <Container className={landpageStyles.steps}>
      //       <div className={landpageStyles.circles}><img src=""></img></div>
      //     </Container>
      //   </Container>
      //   <Container id={landpageStyles.container3}>
      //     <Container>
      //       <h1>Company</h1>
      //       <hr></hr>
      //       <div id={landpageStyles.links}>
      //         <Link to="#" >Services</Link>
      //         <br></br>
      //         <Link to="#" >Contact Us</Link>
      //         <br></br>
      //         <Link to="#">About Us</Link>
      //       </div>
      //     </Container>
      //     <p>Copyright &#169; 2021-2022 | <span>QuizGenAI Inc.</span> | Privacy Policy | Terms of use</p>
      //   </Container>
      // </div>
      <>
      <NavigationBar boolLoggedIn={false}></NavigationBar>
      <h1>Landpage</h1>
      <Footer boolLoggedIn={false}></Footer>
      </>
    );
  }
}

export default Landpage;