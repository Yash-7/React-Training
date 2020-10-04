import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";

class ResetPassword extends Component {
  state = {
    email: "",
    oldPassword: "",
    newPassword: "",
    errResp: "",
    succResp: "",
    validated: false,
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

    if (form.checkValidity() === true) {
      axios
        .post("http://localhost:8000/api/users/resetPassword", {
          email: this.state.email,
          New_Password: this.state.newPassword,
          Old_Password: this.state.oldPassword,
        })
        .then((res) => {
          console.log(res.data);
          this.setState({
            errResp: "",
            succResp: "Password has been reset. ",
          });
        })
        .catch((err) => {
          this.setState({
            validated: false,
          });
          if (err.response.status === 401) {
            this.setState({
              errResp: "Please enter a valid username and password",
            });
          }
          if (err.response.status === 403) {
            this.setState({
              errResp: "New Password can't be same as the old password.",
            });
          }
        });
    }
  };
  render() {
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
        <h2 style={{ textAlign: "center" }}>Reset Password</h2>
        <hr />
        <div className="errResp">{this.state.errResp}</div>
        <div className="succResp">
          {this.state.succResp}
          {this.state.succResp !== "" ? (
            <Link to="/">Go to Login</Link>
          ) : (
            <div></div>
          )}
        </div>
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
          <Form.Group controlId="oldPassword">
            <Form.Label>Old Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Old Password"
              name="oldPassword"
              value={this.state.oldPassword}
              onChange={this.onChange}
              required
            />
            <Form.Control.Feedback type="invalid">
              Password is required.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="newPassword">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="New Password"
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
              name="newPassword"
              value={this.state.newPassword}
              onChange={this.onChange}
              required
            />
            <Form.Control.Feedback type="invalid">
              Password is required.
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

export default ResetPassword;
