import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

class ProtectedRoute extends React.Component {
  state = {};
  render() {
    const Component = this.props.component;
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
