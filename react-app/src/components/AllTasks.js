import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";
import AllTaskCard from "./AllTasksCard";
import TaskFilter from "./TaskFilter";

class AllTasks extends Component {
  render() {
    const tasks = this.props.all;
    let todo = [...tasks.filter((task) => task.status === "assigned")];
    let inProgress = [...tasks.filter((task) => task.status === "in-progress")];
    let completed = [...tasks.filter((task) => task.status === "completed")];
    return (
      <div style={{ padding: "20px", backgroundColor: "white" }}>
        <TaskFilter type="all" />
        <Container>
          <Row>
            <Col style={{ borderRight: "1px solid grey" }}>
              <p>TODO</p>
              {todo.map((task) => {
                return <AllTaskCard key={task.id} task={task} />;
              })}
            </Col>
            <Col style={{ borderRight: "1px solid grey" }}>
              <p>IN-PROGRESS</p>
              {inProgress.map((task) => {
                return <AllTaskCard key={task.id} task={task} />;
              })}
            </Col>
            <Col>
              <p>COMPLETED</p>
              {completed.map((task) => {
                return <AllTaskCard key={task.id} task={task} />;
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

export default connect(mapStatetoProps)(AllTasks);
