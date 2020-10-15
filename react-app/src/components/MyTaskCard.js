import React, { Component } from "react";
import { connect } from "react-redux";
import { Form } from "react-bootstrap";
import Axios from "axios";
import { updateStatus } from "../redux/actions";

class MyTaskCard extends Component {
  state = {
    value: this.props.task.status,
  };

  handleStatus = (e) => {
    if (e.target.value !== this.state.value) {
      this.setState({ value: e.target.value });
      Axios.post(
        `http://localhost:8000/api/tasks/update/status/${this.props.task.id}`,
        {
          status: e.target.value,
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
          this.props.updateStatus({
            id: this.props.task.id,
            status: this.state.value,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
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
    const subDate = this.props.task.dueDate.slice(0, 16);
    return (
      <div
        style={{
          backgroundColor: "rgb(245,245,245)",
          // backgroundColor: "white",
          padding: "10px",
          fontSize: "14px",
          marginTop: "20px",
          borderRadius: "5px",
          boxShadow: "1px 1px 5px 0px rgba(0,0,0,0.55)",
        }}
      >
        {dateTime > dueDate && this.props.task.status !== "completed" ? (
          <p style={{ color: "rgb(209, 36, 36)", fontSize: "18px" }}>
            {subDate} [OVERDUE]
          </p>
        ) : (
          <p style={{ color: "rgb(136, 136, 159)", fontSize: "18px" }}>
            {subDate}
          </p>
        )}
        <b>{this.props.task.title}</b>
        <p>{this.props.task.description}</p>
        <Form.Control
          as="select"
          value={this.state.value}
          onChange={this.handleStatus}
          custom
        >
          <option value="assigned">Assigned</option>
          <option value="in-progress">In-Progress</option>
          <option value="completed">Completed</option>
        </Form.Control>
        <br />
        <br />
        <i>Assigned by : {this.props.task.user_id}</i>
      </div>
    );
  }
}

export default connect(null, { updateStatus })(MyTaskCard);
