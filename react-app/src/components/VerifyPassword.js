import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";

class VerifyPassword extends Component {
  state = {
    errResp: "",
    done: false,
  };
  componentDidMount() {
    axios
      .get(`http://localhost:8000/api/verify/${this.props.match.params.token}`)
      .then((res) => {
        this.setState({
          done: true,
        });
      })
      .catch((err) => {
        if (err.response.status === 401) {
          this.setState({
            errResp:
              "Token is tampered. Please try again with the correct token.",
          });
        }
      });
  }
  render() {
    if (this.state.done) return <Redirect to="/" />;
    return (
      <div style={{ textAlign: "center", padding: "30px" }}>
        {this.state.errResp}
      </div>
    );
  }
}

export default VerifyPassword;
