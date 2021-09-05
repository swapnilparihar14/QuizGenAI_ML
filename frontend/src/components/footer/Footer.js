import React from "react";
import footerStyles from "./footer.module.css";
import { connect } from "react-redux";
import { Container } from "react-bootstrap";

class ConnectedFooter extends React.Component {
  constructor() {
    super();
    this.state = {
      boolLoggedIn: true,
    }
  }

  render(){

    let footer = null;
    if (this.state.boolLoggedIn === true){
      footer = <Container fluid style={{backgroundColor: "var(--dark-blue)", position: "fixed", bottom: "0"}}>
                <p style={{display: "block"}} style={{marginTop: "1rem", marginBottom: "1rem"}}>
                  <span className={footerStyles.text_dark} >Copyright &copy; 2021-2022</span>
                  <span className={footerStyles.text_dark}>|</span>
                  <span className={footerStyles.text_dark} style={{fontWeight: "bold"}}>QuizGenAI Inc.</span>
                </p>
               </Container>
    }
    else {
      footer = <Container fluid style={{backgroundColor: "var(--white)", borderTop: "1px solid var(--light-gray)", position: "fixed", bottom: "0"}}>
      <p style={{display: "block"}} style={{marginTop: "1rem", marginBottom: "1rem"}}>
        <span className={footerStyles.text_light} >Copyright &copy; 2021-2022</span>
        <span className={footerStyles.text_light}>|</span>
        <span className={footerStyles.text_light} style={{fontWeight: "bold"}}>QuizGenAI Inc.</span>
      </p>
     </Container>
    }

    return(
    <>
      {footer}
    </>
    );
  }
}
const mapStateToProps = (state) => ({});
const Footer = connect(mapStateToProps)(ConnectedFooter);
export default Footer;

