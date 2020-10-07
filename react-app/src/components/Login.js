import React, { Component } from "react";
import { Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import axios from "axios";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { login } from "../redux/actions";
import LoadingSpinner from "./LoadingSpinner";

class Login extends Component {
  state = {
    email: "",
    password: "",
    validated: false,
    errorResp: "",
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
          .post("http://localhost:8000/api/login", {
            email: this.state.email,
            password: this.state.password,
          })
          .then((res) => {
            this.setState({ loading: false });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            this.props.login(res.data.user);
            this.setState({
              errorResp: "",
            });
            if (res.data.user.role === "admin") {
              this.setState({
                redirect: "/admin",
              });
            } else {
              this.setState({
                redirect: "/user",
              });
            }
          })
          .catch((err) => {
            this.setState({ loading: false });
            this.setState({
              validated: false,
            });
            if (err.response.status === 401) {
              this.setState({
                errorResp: "Please enter a valid username and password",
              });
            }
            if (err.response.status === 403) {
              this.setState({
                errorResp:
                  "Please verify the verification email sent to your email-id",
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
        <h2 style={{ textAlign: "center" }}>Login</h2>
        <hr />
        <div className="errResp">{this.state.errorResp}</div>
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
          <Form.Group controlId="Password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              value={this.state.password}
              onChange={this.onChange}
              required
            />
            <Form.Control.Feedback type="invalid">
              Password is required.
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
        <div style={{ fontSize: "small" }}>
          <Link to="/forgotPassword">Forgot Password?</Link>
        </div>
        <br />

        <div>
          Don't have an account? <Link to="/signup">Sign Up</Link> here
        </div>
      </div>
    );
  }
}

// const mapDispatchtoProps = (dispatch) => {
//   return { login: () => dispatch(login()) };
// };

export default connect(null, { login })(Login);
// export default connect(null, mapDispatchtoProps)(Login);
