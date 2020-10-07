import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col } from "react-bootstrap";
import { HiUserCircle } from "react-icons/hi";

class UserComponent extends Component {
  state = {};

  render() {
    return (
      <div>
        <Row>
          <Col>
            <div className="sidenav">
              <HiUserCircle size="5em" color="#24292e" />
              <div className="sidebar-heading">
                {this.props.loggedUser.name}
              </div>
              <hr width="80%" />
            </div>
          </Col>
          <Col xs={9}>
            <div style={{ padding: "20px" }}>
              <h3>Hello {this.props.loggedUser.name}</h3>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStatetoProps = (state) => {
  const { auth } = state;
  return auth;
};

export default connect(mapStatetoProps)(UserComponent);
