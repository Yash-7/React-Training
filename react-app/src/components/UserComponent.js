import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col } from "react-bootstrap";
import { HiUserCircle } from "react-icons/hi";
import Tasks from "./Tasks";

class UserComponent extends Component {
  state = {
    home: true,
    tasks: false,
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
                  Home
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
            {this.state.tasks ? <Tasks tasks={this.props.tasks} /> : null}
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

const mapStatetoProps = (state) => {
  const { auth, tasks } = state;
  return { auth, tasks };
};

export default connect(mapStatetoProps)(UserComponent);
