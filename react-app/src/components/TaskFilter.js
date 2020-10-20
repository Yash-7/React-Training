import React, { Component } from "react";
import { getTasks } from "../redux/actions";
import { Form, Row, Col } from "react-bootstrap";
import axios from "axios";
import { connect } from "react-redux";

class TaskFilter extends Component {
  state = {
    keyword: "",
    assignee: "",
    assignor: "",
    startTime: "",
    endTime: "",
  };
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  componentDidUpdate() {
    let data = {
      keyword: this.state.keyword === "" ? undefined : this.state.keyword,
      assignee: this.state.assignee === "" ? undefined : this.state.assignee,
      assignor: this.state.assignor === "" ? undefined : this.state.assignor,
      startTime: this.state.startTime === "" ? undefined : this.state.startTime,
      endTime: this.state.endTime === "" ? undefined : this.state.endTime,
    };
    axios
      .post(
        `http://localhost:8000/api/tasks/filter/${this.props.type}/${this.props.loggedUser.id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        if (this.props.type === "all")
          this.props.getTasks({ tasks: res.data, case: "ALL" });
        if (this.props.type === "assigned")
          this.props.getTasks({ tasks: res.data, case: "ASSIGNED" });
        if (this.props.type === "todo")
          this.props.getTasks({ tasks: res.data, case: "TODO" });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  render() {
    return (
      <div>
        <Form>
          <Row>
            <Col xs={3}>
              <Form.Group>
                <Form.Control
                  name="keyword"
                  type="text"
                  placeholder="Enter keyword"
                  value={this.state.keyword}
                  onChange={this.onChange}
                  autoComplete="off"
                />
              </Form.Group>
            </Col>
            <Col className="customCol" xs={3}>
              <Row>
                <Col className="customCol">
                  <Form.Group>
                    <Form.Control
                      name="assignor"
                      type="text"
                      placeholder="Assignor"
                      value={this.state.assignor}
                      onChange={this.onChange}
                      autoComplete="off"
                    />
                  </Form.Group>
                </Col>
                <Col className="customCol2">
                  <Form.Group>
                    <Form.Control
                      name="assignee"
                      type="text"
                      placeholder="Assignee"
                      value={this.state.assignee}
                      onChange={this.onChange}
                      autoComplete="off"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Col>

            <Col className="customCol" xs={3}>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Start:
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="datetime-local"
                    name="startTime"
                    value={this.state.startTime}
                    onChange={this.onChange}
                    required
                  />
                </Col>
              </Form.Group>
            </Col>
            <Col className="customCol" xs={3}>
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  End:
                </Form.Label>
                <Col className="customCol2" sm={10}>
                  <Form.Control
                    type="datetime-local"
                    name="endTime"
                    value={this.state.endTime}
                    onChange={this.onChange}
                    required
                  />
                </Col>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

const mapStatetoProps = (state) => {
  return state.auth;
};

export default connect(mapStatetoProps, { getTasks })(TaskFilter);
