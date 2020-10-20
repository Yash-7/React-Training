import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col, Toast } from "react-bootstrap";
import { HiUserCircle } from "react-icons/hi";
import Tasks from "./Tasks";
import Dashboard from "./Dashboard";
import Pusher from "pusher-js";

class UserComponent extends Component {
  state = {
    home: true,
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
      tasks: false,
    });
  };

  handleTasks = () => {
    localStorage.setItem("tab", "tasks");
    this.setState({
      home: false,
      tasks: true,
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
            {this.state.tasks ? <Tasks tasks={this.props.tasks} /> : null}
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStatetoProps = (state) => {
  const { auth, tasks } = state;
  return { auth, tasks };
};

export default connect(mapStatetoProps)(UserComponent);
