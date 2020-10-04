import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../redux/actions";

class Nav extends Component {
  render() {
    return (
      <nav className="nav">
        <h4 style={{ padding: "20px" }}>Vmock Application</h4>
        {this.props.isLogged ? (
          <ul>
            <Link to="/resetPassword">
              <li>Reset Password</li>
            </Link>
            <li onClick={this.props.logout}>Logout</li>
          </ul>
        ) : null}
      </nav>
    );
  }
}

const mapStatetoProps = (state) => {
  const { auth } = state;
  return auth;
};

export default connect(mapStatetoProps, { logout })(Nav);
