import React from "react";
import { Container } from "react-bootstrap";
import alertStyles from "./alert.module.css";

/**
 * Needs this.props.type, this.props.message, and this.props.delete (function to delete alert)
 */
class Alert extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    let alert,
      message = null;

    message = this.props.message;

    if (this.props.type === "success") {
      alert = (
        <Container className={alertStyles.alertSuccess}>
          <p className={alertStyles.paragraph}>
            <span>Success:</span> {message}
          </p>
          <p style={{ float: "right", cursor: "pointer" }}>
            <span onClick={this.props.delete}>X</span>
          </p>
        </Container>
      );
    }

    if (this.props.type === "fail") {
      alert = (
        <Container className={alertStyles.alertFail}>
          <p className={alertStyles.paragraph}>
            <span>Error:</span> {message}
          </p>
          <p style={{ float: "right", cursor: "pointer" }}>
            <span onClick={this.props.delete}>X</span>
          </p>
        </Container>
      );
    }

    return <>{alert}</>;
  }
}

export default Alert;
