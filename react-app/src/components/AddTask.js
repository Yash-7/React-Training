import React, { Component } from "react";
import { Form, Modal, Button, Col } from "react-bootstrap";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";
import { connect } from "react-redux";
import { addTask } from "../redux/actions";
import { BsPlus } from "react-icons/bs";

class AddTask extends Component {
  state = {
    modalShow: false,
    validated: false,
    loading: false,
    title: "",
    description: "",
    dueDate: "",
    assignee: "",
  };

  handleModal = () => {
    this.setState({ modalShow: !this.state.modalShow });
  };
  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }
    this.setState({
      validated: true,
    });
    if (form.checkValidity() === true) {
      this.setState({ loading: true }, () => {
        axios
          .post(
            "http://localhost:8000/api/tasks/create",
            {
              title: this.state.title,
              description: this.state.description,
              assignee: this.state.assignee,
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
            this.setState({ loading: false });
            this.props.addTask({ task: res.data.task, case: "ASSIGNED" });
            if (this.props.loggedUser.role === "admin")
              this.props.addTask({ task: res.data.task, case: "ALL" });
            this.setState({
              errResp: "",
              modalShow: false,
              title: "",
              description: "",
              dueDate: "",
              assignee: "",
              validated: false,
            });
          })
          .catch((err) => {
            this.setState({ loading: false });
            if (err.response.status === 401) {
              this.setState({
                errResp: "Not authorised",
              });
            }
          });
      });
    }
  };
  render() {
    return (
      <React.Fragment>
        <Button
          style={{
            float: "right",
            marginRight: "15px",
            letterSpacing: "2px",
            backgroundColor: "#24292e",
            border: "none",
            boxShadow: "none",
          }}
          size="sm"
          onClick={this.handleModal}
        >
          <BsPlus size="20px" />
          CREATE
        </Button>
        <Modal
          show={this.state.modalShow}
          onHide={this.handleModal}
          backdrop="static"
          keyboard={false}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          animation={false}
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Create a Task
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: "30px" }}>
            <div className="errResp">{this.state.errResp}</div>
            <Form
              noValidate
              validated={this.state.validated}
              onSubmit={this.handleSubmit}
            >
              <Form.Group controlId="Title">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Title"
                  name="title"
                  value={this.state.title}
                  onChange={this.onChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please enter a title.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="Description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="textbox"
                  placeholder="Enter description"
                  name="description"
                  value={this.state.description}
                  onChange={this.onChange}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please enter the description of the task.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Row>
                <Form.Group as={Col} controlId="Assignee">
                  <Form.Label>Assignee</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter assignee"
                    name="assignee"
                    value={this.state.assignee}
                    onChange={this.onChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter an assignee for the task.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} controlId="Due Date">
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="dueDate"
                    value={this.state.dueDate}
                    onChange={this.onChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a due date for the task.
                  </Form.Control.Feedback>
                </Form.Group>
              </Form.Row>
              {this.state.loading ? (
                <LoadingSpinner />
              ) : (
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              )}
            </Form>
          </Modal.Body>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapStatetoProps = (state) => {
  const { auth } = state;
  return auth;
};

export default connect(mapStatetoProps, { addTask })(AddTask);
