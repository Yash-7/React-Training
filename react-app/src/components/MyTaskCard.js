import React, { Component } from "react";
import { connect } from "react-redux";
import { Form } from "react-bootstrap";

class MyTaskCard extends Component {
  state = {
    value: this.props.task.status,
  };

  handleStatus = (e) => {
    this.setState({ value: e.target.value });
  };
  render() {
    const dueDate = this.props.task.dueDate.slice(0, 16);
    const time = new Date().toLocaleTimeString();
    const date = new Date().toLocaleDateString();
    return (
      <div
        style={{
          backgroundColor: "rgb(245,245,245)",
          padding: "10px",
          fontSize: "14px",
          marginTop: "10px",
          borderRadius: "5px",
        }}
      >
        <p>{dueDate}</p>
        <p>{this.props.task.title}</p>
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
      </div>
    );
  }
}

export default connect()(MyTaskCard);
