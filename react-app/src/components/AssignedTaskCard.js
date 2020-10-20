import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { MdEdit, MdDelete } from "react-icons/md";
import axios from "axios";
import { editTask, deleteTask } from "../redux/actions";
import { connect } from "react-redux";
class AssignedTaskCard extends Component {
  state = {
    title: this.props.task.title,
    description: this.props.task.description,
    dueDate: this.props.task.dueDate,
    editable: false,
  };
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  editHandler = () => {
    this.setState({ editable: !this.state.editable });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        `http://localhost:8000/api/tasks/update/task/${this.props.task.id}`,
        {
          title: this.state.title,
          description: this.state.description,
          dueDate: this.state.dueDate,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        this.props.editTask({
          id: this.props.task.id,
          task: {
            title: this.state.title,
            description: this.state.description,
            dueDate: this.state.dueDate,
          },
        });
        this.editHandler();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  deleteHandler = () => {
    axios
      .get(`http://localhost:8000/api/tasks/delete/${this.props.task.id}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(res);
        this.props.deleteTask(this.props.task.id);
      });
  };
  render() {
    const dueDate = this.props.task.dueDate;
    const today = new Date();
    const date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    const time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date + " " + time;
    let subDate = this.props.task.dueDate.slice(0, 16);
    subDate = subDate.replace(/T/i, " ");
    return (
      <div
        style={{
          backgroundColor: "rgb(245,245,245)",
          padding: "10px",
          fontSize: "14px",
          marginTop: "20px",
          borderRadius: "5px",
          boxShadow: "1px 1px 5px 0px rgba(0,0,0,0.55)",
        }}
      >
        <div className="editDelete" onClick={this.deleteHandler} style={{}}>
          <MdDelete color="rgb(164, 40, 44)" size="20px" />
        </div>
        {!this.state.editable && this.props.task.status !== "completed" ? (
          <div
            className="editDelete"
            onClick={this.editHandler}
            style={{
              marginRight: "10px",
            }}
          >
            <MdEdit color="rgb(54, 40, 124)" size="20px" />
          </div>
        ) : null}
        {dateTime > dueDate && this.props.task.status !== "completed" ? (
          <p style={{ color: "rgb(209, 36, 36)", fontSize: "18px" }}>
            {subDate}
          </p>
        ) : (
          <p style={{ color: "rgb(136, 136, 159)", fontSize: "18px" }}>
            {subDate}
          </p>
        )}
        <form className="assignedTaskForm">
          {this.state.editable ? (
            <input
              type="datetime-local"
              name="dueDate"
              value={this.state.dueDate}
              onChange={this.onChange}
              disabled={!this.state.editable}
              required
            />
          ) : null}

          <input
            type="text"
            placeholder="Enter Title"
            name="title"
            value={this.state.title}
            onChange={this.onChange}
            disabled={!this.state.editable}
            required
          />
          <textarea
            type="textbox"
            placeholder="Enter description"
            name="description"
            value={this.state.description}
            onChange={this.onChange}
            disabled={!this.state.editable}
            required
          />
          {this.state.editable ? (
            <React.Fragment>
              <Button size="sm" onClick={this.handleSubmit}>
                Submit
              </Button>{" "}
              <Button
                size="sm"
                variant="outline-danger"
                onClick={this.editHandler}
              >
                Cancel
              </Button>
            </React.Fragment>
          ) : null}
        </form>

        <p style={{ float: "right" }}>
          Status : <i>{this.props.task.status}</i>
        </p>
        <p>Assigned to : {this.props.task.assignee}</p>
      </div>
    );
  }
}

export default connect(null, { editTask, deleteTask })(AssignedTaskCard);
