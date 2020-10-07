import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import axios from "axios";

class ProtectedRoute extends React.Component {
  state = {
    err: false,
  };
  componentDidMount() {
    if (localStorage.getItem("user") === null) {
      this.setState({ err: true });
    } else {
      const id = JSON.parse(localStorage.getItem("user")).id;
      axios
        .get(`http://localhost:8000/api/users/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .catch((err) => {
          if (err.response.status === 401) {
            localStorage.clear();
            this.setState({ err: true });
          }
        });
    }
  }
  render() {
    const Component = this.props.component;
    if (this.state.err) return <Redirect to="/" />;
    return this.props.isLogged ? (
      <Component />
    ) : (
      <Redirect to={{ pathname: "/" }} />
    );
  }
}

const mapStatetoProps = (state) => {
  return state.auth;
};

export default connect(mapStatetoProps)(ProtectedRoute);
