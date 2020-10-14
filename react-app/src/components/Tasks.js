import Axios from "axios";
import React, { Component } from "react";
import { connect } from "react-redux";
import AddTask from "./AddTask";
import { getTasks } from "../redux/actions";
// import TaskTabs from "./TaskTabs";
import { Tab, Tabs } from "react-bootstrap";
import AssignedTasks from "./AssignedTasks";
import AllTasks from "./AllTasks";
import MyTasks from "./MyTasks";

class Tasks extends Component {
  state = {};

  componentDidMount() {
    Axios.get("http://localhost:8000/api/tasks/todo", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        this.props.getTasks({ tasks: res.data.tasks, case: "TODO" });
      })
      .catch((err) => {
        console.log(err);
      });
    Axios.get("http://localhost:8000/api/tasks/assigned", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        this.props.getTasks({ tasks: res.data.tasks, case: "ASSIGNED" });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  render() {
    return (
      <div style={{ marginTop: "30px" }}>
        <AddTask />
        <Tabs transition={false} defaultActiveKey="myTasks">
          <Tab eventKey="myTasks" title="My Tasks">
            <MyTasks type="myTasks" />
          </Tab>
          <Tab eventKey="assigned" title="Assigned Tasks">
            <AssignedTasks type="assigned" />
          </Tab>
          {this.props.auth.loggedUser.role === "admin" ? (
            <Tab eventKey="all" title="All">
              <AllTasks type="all" />
            </Tab>
          ) : null}
        </Tabs>
      </div>
    );
  }
}

const mapStatetoProps = (state) => {
  const { auth, tasks } = state;
  return { auth, tasks };
};

export default connect(mapStatetoProps, { getTasks })(Tasks);
