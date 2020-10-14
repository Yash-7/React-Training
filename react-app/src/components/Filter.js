import React, { Component } from "react";
import { connect } from "react-redux";
import { getUsers } from "../redux/actions";
import { Form, Col } from "react-bootstrap";
import axios from "axios";

class Filter extends Component {
  state = {
    username: "",
    email: "",
    radio: "",
    data: {},
  };
  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  componentDidUpdate() {
    let data = {
      email: this.state.email === "" ? undefined : this.state.email,
      name: this.state.username === "" ? undefined : this.state.username,
      radio: this.state.radio === "" ? undefined : this.state.radio,
    };
    axios
      .post("http://localhost:8000/api/admin/users/filter", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        this.props.getUsers(res.data);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 401) {
          if (
            this.state.errResp !==
            "You are not authorized to create user. Login and try again"
          ) {
            this.setState({
              errResp:
                "You are not authorized to create user. Login and try again",
            });
          }
        }
      });
  }
  // handleSubmit = (e) => {
  //   e.preventDefault();
  //   const form = e.currentTarget;
  //   if (form.checkValidity() === false) {
  //     e.preventDefault();
  //     e.stopPropagation();
  //   }
  //   this.setState({
  //     validated: true,
  //   });
  //   if (form.checkValidity() === true) {
  //   }
  // };
  render() {
    return (
      <div
        style={{
          borderRadius: "10px",
          backgroundColor: "rgb(235,235,235)",
          fontSize: "medium",
          padding: "20px",
        }}
      >
        <h5>Find users</h5>
        <div className="errResp">{this.state.errResp}</div>
        <Form>
          <Form.Row>
            <Form.Group as={Col} controlId="username">
              <Form.Control
                name="username"
                type="username"
                placeholder="Enter Username"
                value={this.state.username}
                onChange={this.onChange}
                autoComplete="off"
              />
            </Form.Group>
            <Form.Group as={Col} controlId="email">
              <Form.Control
                name="email"
                type="email"
                placeholder="Enter email"
                value={this.state.email}
                onChange={this.onChange}
                autoComplete="off"
              />
            </Form.Group>
          </Form.Row>
          <div className="mb-3">
            <Form.Check
              inline
              name="radio"
              label="All users"
              type="radio"
              onChange={this.onChange}
              value="all"
            />
            <Form.Check
              name="radio"
              inline
              label="Verified users"
              type="radio"
              onChange={this.onChange}
              value="verified"
            />
            <Form.Check
              name="radio"
              inline
              label="Non-verified users"
              type="radio"
              onChange={this.onChange}
              value="nonVerified"
            />
          </div>
        </Form>
      </div>
    );
  }
}

export default connect(null, { getUsers })(Filter);
