import { Container, Row } from "react-bootstrap";
import backgroundImage from "../../assets/background.svg"
import authStyles from "./auth.module.css";

const Auth = (props) => {
  return (
    <div     
      className={authStyles.background}
      style={{backgroundImage: `url(${backgroundImage})`}}
    >
    <Container className={authStyles.container}> 
      <Row >
        {props.cards}
      </Row>
    </Container>
    </div>
  );
}

export default Auth;