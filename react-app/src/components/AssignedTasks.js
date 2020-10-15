import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";
import AssignedTaskCard from "./AssignedTaskCard";
import TaskFilter from "./TaskFilter";

class AssignedTasks extends Component {
  render() {
    const tasks = this.props.assigned;
    let todo = [...tasks.filter((task) => task.status === "assigned")];
    let inProgress = [...tasks.filter((task) => task.status === "in-progress")];
    let completed = [...tasks.filter((task) => task.status === "completed")];
    return (
      <div style={{ padding: "20px", backgroundColor: "white" }}>
        <TaskFilter type="assigned" />
        <Container>
          <Row>
            <Col style={{ borderRight: "1px solid grey" }}>
              <p>TODO</p>
              {todo.map((task) => {
                return <AssignedTaskCard key={task.id} task={task} />;
              })}
            </Col>
            <Col style={{ borderRight: "1px solid grey" }}>
              <p>IN-PROGRESS</p>
              {inProgress.map((task) => {
                return <AssignedTaskCard key={task.id} task={task} />;
              })}
            </Col>
            <Col>
              <p>COMPLETED</p>
              {completed.map((task) => {
                return <AssignedTaskCard key={task.id} task={task} />;
              })}
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

const mapStatetoProps = (state) => {
  return state.tasks;
};

export default connect(mapStatetoProps)(AssignedTasks);
