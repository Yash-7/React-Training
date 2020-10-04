import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";

class CreatePassword extends Component {
  state = {
    password: "",
    errResp: "",
    done: false,
    created: false,
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
        .post(
          `http://localhost:8000/api/users/createPassword/${this.props.match.params.token}`,
          {
            password: this.state.password,
          }
        )
        .then((res) => {
          console.log(res);
          this.setState({ done: true });
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status === 400) {
            this.setState({
              errResp: "Password already created.",
              created: true,
            });
          }
          if (err.response.status === 401) {
            this.setState({
              errResp: "Token is tampered. Please check your token.",
            });
          }
        });
    }
  };
  render() {
    if (this.state.done) return <Redirect to="/" />;
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
        <h2 style={{ textAlign: "center" }}>Create Password</h2>
        <hr />
        <div className="errResp">
          {this.state.errResp}{" "}
          {this.state.created ? <Link to="/">Login here</Link> : null}
        </div>
        <br />
        <Form
          noValidate
          validated={this.state.validated}
          onSubmit={this.handleSubmit}
        >
          <Form.Group controlId="Password">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
              name="password"
              value={this.state.password}
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

export default CreatePassword;
