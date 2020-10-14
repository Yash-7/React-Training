import React, { Component } from "react";
import { Row, Col, Table } from "react-bootstrap";
import { connect } from "react-redux";
import { HiUserCircle } from "react-icons/hi";
import { getUsers, getTasks } from "../redux/actions";
import axios from "axios";
import AddUser from "./AddUser";
import User from "./User";
import Filter from "./Filter";
import Tasks from "./Tasks";
class Admin extends Component {
  state = {
    home: true,
    users: false,
    tasks: false,
  };

  handleHome = () => {
    localStorage.setItem("tab", "home");
    this.setState({
      home: true,
      users: false,
      tasks: false,
    });
  };

  handleUsers = () => {
    localStorage.setItem("tab", "users");
    this.setState({
      home: false,
      users: true,
      tasks: false,
    });
    axios
      .get("http://localhost:8000/api/admin/users", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        this.props.getUsers(res.data.users);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleTasks = () => {
    localStorage.setItem("tab", "tasks");
    this.setState({
      home: false,
      users: false,
      tasks: true,
    });
    axios
      .get("http://localhost:8000/api/tasks/all", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(res);
        this.props.getTasks({ tasks: res.data.tasks, case: "ALL" });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  componentDidMount() {
    console.log("mount");
    const tab = localStorage.getItem("tab");
    if (tab === "home") this.handleHome();
    if (tab === "users") this.handleUsers();
    if (tab === "tasks") this.handleTasks();
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
                  User Management
                </div>
                <div
                  className={
                    this.state.tasks ? "list-item selected" : "list-item"
                  }
                  onClick={this.state.tasks ? null : this.handleTasks}
                >
                  Task Management
                </div>
              </div>
            </div>
          </Col>
          <Col xs={9}>
            {this.state.home ? (
              <Home user={this.props.auth.loggedUser} />
            ) : null}
            {this.state.users ? <Users users={this.props.users} /> : null}
            {this.state.tasks ? <Tasks /> : null}
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
      style={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "10px",
        marginTop: "30px",
      }}
    >
      <AddUser />
      <hr />
      <Filter />
      <br />
      <Table bordered style={{ textAlign: "center" }}>
        <thead
          style={{
            background: "#24292e",
            color: "white",
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
          }}
        >
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Delete</th>
          </tr>
        </thead>
        <thead>
          {props.users.users.map((user) => {
            return <User key={user.id} user={user} />;
          })}
        </thead>
      </Table>
    </div>
  );
}

const mapStatetoProps = (state) => {
  const { users, auth, tasks } = state;
  return { users, auth, tasks };
};

export default connect(mapStatetoProps, { getUsers, getTasks })(Admin);
