import axios from "axios";
import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";
import { Redirect } from "react-router-dom";

class ForgotPassword extends Component {
  state = {
    email: "",
    done: false,
    validated: false,
    errResp: "",
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }
    this.setState({
      validated: true,
    });
    if (form.checkValidity()) {
      axios
        .post("http://localhost:8000/api/checkEmail", {
          email: this.state.email,
        })
        .then((res) => {
          console.log(res);
          this.setState({ done: true });
        })
        .catch((err) => {
          if (err.response.status === 404) {
            this.setState({
              errResp: "User does not exist",
            });
          }
        });
    }
  };

  render() {
    if (this.state.done) return <Redirect to="/forgotPwdRe" />;
    return (
      <div
        className="container"
        style={{
          maxWidth: "50vw",
          backgroundColor: "white",
          borderRadius: "10px",
          boxShadow: "0px 0px 10px -2px rgba(0,0,0,0.55)",
          padding: "30px",
          marginTop: "10vh",
        }}
      >
        <h3>Find your account</h3>
        <hr />
        <div className="errResp">{this.state.errResp}</div>
        <br />
        <Form
          noValidate
          validated={this.state.validated}
          onSubmit={this.handleSubmit}
        >
          <Form.Group controlId="Email">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              value={this.state.email}
              onChange={this.onChange}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please provide a correct email.
            </Form.Control.Feedback>
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}

export default ForgotPassword;
