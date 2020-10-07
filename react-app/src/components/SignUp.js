import React, { Component } from "react";
import { Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import axios from "axios";
import { Link, Redirect } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

class SignUp extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    validated: false,
    errResp: "",
    succResp: "",
    redirect: "",
    loading: false,
  };
  componentDidMount() {
    if (localStorage.getItem("token")) {
      if (JSON.parse(localStorage.getItem("user")).role === "admin") {
        this.setState({
          redirect: "/admin",
        });
      } else {
        this.setState({
          redirect: "/user",
        });
      }
    }
  }
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
      this.setState({ loading: true }, () => {
        axios
          .post("http://localhost:8000/api/register", {
            name: this.state.username,
            email: this.state.email,
            password: this.state.password,
          })
          .then((res) => {
            this.setState({ loading: false });
            console.log(res);
            this.setState({
              errResp: "",
              succResp:
                "Your account has been created. Verify your email and login",
            });
          })
          .catch((err) => {
            this.setState({ loading: false });
            if (err.response.status === 422) {
              this.setState({
                errResp: "User already exists. Go to Login",
              });
            }
          });
      });
    }
  };
  render() {
    if (this.state.redirect) return <Redirect to={this.state.redirect} />;
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
        <h2 style={{ textAlign: "center" }}>Sign Up</h2>
        <hr />
        <div className="errResp">{this.state.errResp}</div>
        <div className="succResp">{this.state.succResp}</div>
        <br />
        <Form
          noValidate
          validated={this.state.validated}
          onSubmit={this.handleSubmit}
        >
          <Form.Group controlId="Username">
            <Form.Label>User Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              name="username"
              value={this.state.username}
              onChange={this.onChange}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please choose a username.
            </Form.Control.Feedback>
          </Form.Group>
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

          <Form.Group controlId="Password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
              placeholder="Password"
              name="password"
              value={this.state.password}
              onChange={this.onChange}
              required
            />
            <Form.Control.Feedback type="invalid">
              Please enter a password with atleast 1 capital letter, 1 small
              letter and 1 number.
            </Form.Control.Feedback>
          </Form.Group>
          {this.state.loading ? (
            <LoadingSpinner />
          ) : (
            <Button variant="primary" type="submit">
              Submit
            </Button>
          )}
        </Form>
        <br />
        <div>
          Already have an account? <Link to="/">Login here</Link>
        </div>
      </div>
    );
  }
}

export default SignUp;
