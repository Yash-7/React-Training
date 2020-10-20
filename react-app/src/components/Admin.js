import React, { Component } from "react";
import { Row, Col, Table, Toast } from "react-bootstrap";
import { connect } from "react-redux";
import { HiUserCircle } from "react-icons/hi";
import { getUsers, getTasks } from "../redux/actions";
import axios from "axios";
import AddUser from "./AddUser";
import User from "./User";
import Filter from "./Filter";
import Tasks from "./Tasks";
import Dashboard from "./Dashboard";
import Pusher from "pusher-js";

class Admin extends Component {
  state = {
    home: true,
    users: false,
    tasks: false,
    toast: false,
    toastBody: "",
  };
  toggleToast = () => {
    this.setState({ toast: !this.state.toast });
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
    Pusher.logToConsole = true;

    const pusher = new Pusher("53ec7dc21ce2dd50eedf", {
      cluster: "ap2",
    });

    const myChannel = pusher.subscribe("my-channel");
    myChannel.bind("statusUpdate", (data) => {
      if (data.id === JSON.parse(localStorage.getItem("user")).id) {
        this.setState({ toast: true, toastBody: data.message });
      }
    });

    const channel = pusher.subscribe("channel");
    channel.bind("createTask", (data) => {
      if (parseInt(data.id) === JSON.parse(localStorage.getItem("user")).id) {
        this.setState({ toast: true, toastBody: data.message });
      }
    });

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
                  Dashboard
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
            <Toast
              onClose={this.toggleToast}
              show={this.state.toast}
              delay={6000}
              // animated={fals
              autohide
              style={{
                position: "fixed",
                top: "20px",
                right: "30px",
                zIndex: 100,
              }}
            >
              <Toast.Header>
                <img
                  src="holder.js/20x20?text=%20"
                  className="rounded mr-2"
                  alt=""
                />
                <strong className="mr-auto">Notification</strong>
                <small>a while ago</small>
              </Toast.Header>
              <Toast.Body>{this.state.toastBody}</Toast.Body>
            </Toast>
            {this.state.home ? (
              <Dashboard user={this.props.auth.loggedUser} />
            ) : null}
            {this.state.users ? <Users users={this.props.users} /> : null}
            {this.state.tasks ? <Tasks /> : null}
          </Col>
        </Row>
      </div>
    );
  }
}

function Users(props) {
  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "10px",
        marginTop: "20px",
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
