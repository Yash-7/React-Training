import React, { Component } from "react";
import { Form, Col, Button } from "react-bootstrap";
import axios from "axios";
import { connect } from "react-redux";
import { createUser } from "../redux/actions";

class AddUser extends Component {
  state = {
    username: "",
    email: "",
    validated: false,
    errResp: "",
    succResp: "",
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
        .post(
          "http://localhost:8000/api/admin/users/create",
          {
            name: this.state.username,
            email: this.state.email,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          this.setState({
            errResp: "",
            succResp: "User created",
          });
          this.props.createUser(res.data.user);
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status === 422) {
            this.setState({
              errResp: "User already exists",
            });
          }
          if (err.response.status === 401) {
            this.setState({
              errResp:
                "You are not authorized to create user. Login and try again",
            });
          }
        });
    }
  };

  render() {
    return (
      <div className="add-user">
        <h4>Create User</h4>
        <div className="errResp">{this.state.errResp}</div>
        <div className="succResp">{this.state.succResp}</div>
        <br />
        <Form
          noValidate
          validated={this.state.validated}
          onSubmit={this.handleSubmit}
        >
          <Form.Row>
            <Form.Group as={Col} controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                name="username"
                type="username"
                placeholder="Username"
                value={this.state.username}
                onChange={this.onChange}
                required
              />
            </Form.Group>
            <Form.Group as={Col} controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                type="email"
                placeholder="Enter email"
                value={this.state.email}
                onChange={this.onChange}
                required
              />
            </Form.Group>
          </Form.Row>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}

export default connect(null, { createUser })(AddUser);
