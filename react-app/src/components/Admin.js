import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";
import { connect } from "react-redux";
import { HiUserCircle } from "react-icons/hi";
import { getUsers } from "../redux/actions";
import axios from "axios";
import AddUser from "./AddUser";
import User from "./User";

class Admin extends Component {
  state = {
    home: true,
    users: false,
  };

  handleHome = () => {
    this.setState({
      home: true,
      users: false,
    });
  };

  handleUsers = () => {
    this.setState({
      home: false,
      users: true,
    });
  };

  componentDidMount() {
    axios
      .get("http://localhost:8000/api/admin/users", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        this.props.getUsers(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  render() {
    return (
      <div>
        <Row>
          <Col>
            <div className="sidenav">
              <HiUserCircle size="5em" color="#24292e" />
              <div className="sidebar-heading">
                {this.props.auth.loggedUser.name}
              </div>
              <hr width="60%" />
              <div className="list-group">
                <div
                  className={
                    this.state.home ? "list-item selected" : "list-item"
                  }
                  onClick={this.state.home ? null : this.handleHome}
                >
                  Home
                </div>
                <div
                  className={
                    this.state.users ? "list-item selected" : "list-item"
                  }
                  onClick={this.state.users ? null : this.handleUsers}
                >
                  Users
                </div>
              </div>
            </div>
          </Col>
          <Col xs={9}>
            {this.state.home ? (
              <Home user={this.props.auth.loggedUser} />
            ) : null}{" "}
            {this.state.users ? <Users users={this.props.users} /> : null}
          </Col>
        </Row>
      </div>
    );
  }
}

function Home(props) {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Hello {props.user.name}</h2>
    </div>
  );
}

function Users(props) {
  return (
    <div
      className="container"
      style={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "10px",
        marginTop: "30px",
      }}
    >
      <AddUser />
      <hr />
      <h4>Users:</h4>
      <br />
      {props.users.users.map((user) => {
        return <User key={user.id} user={user} />;
      })}
    </div>
  );
}

const mapStatetoProps = (state) => {
  const { users, auth } = state;
  return { users, auth };
};

export default connect(mapStatetoProps, { getUsers })(Admin);
