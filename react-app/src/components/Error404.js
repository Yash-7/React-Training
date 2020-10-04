import React, { Component } from "react";
import { Link } from "react-router-dom";

class Error404 extends Component {
  render() {
    return (
      <div style={{ textAlign: "center" }}>
        <h1 style={{ padding: "20px" }}>404 Error.</h1>
        <p>
          Please head back to <Link to="/">Login page</Link>
        </p>
      </div>
    );
  }
}

export default Error404;
