import React, { Component } from "react";
import { Link } from "react-router-dom";

class ForgotPwdRedirect extends Component {
  render() {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        An email has been sent to change your password. After changing your
        password, <Link to="/">Login</Link> here
      </div>
    );
  }
}

export default ForgotPwdRedirect;
