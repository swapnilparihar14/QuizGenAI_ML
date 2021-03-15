import { Container, Row } from "react-bootstrap";

const Auth = (props) => {
  return (
    <Container> 
      <Row>
        {props.cards}
      </Row>
    </Container>
  )
}

export default Auth;