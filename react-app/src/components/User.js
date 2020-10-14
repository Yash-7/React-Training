import Axios from "axios";
import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import { deleteUser } from "../redux/actions";

class User extends Component {
  state = {};
  onDelete = (id) => {
    Axios.get(`http://localhost:8000/api/admin/users/delete/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        this.props.deleteUser(id);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  render() {
    const { user } = this.props;
    return (
      <tr>
        <td>{user.name}</td>
        <td>{user.email}</td>
        <td>
          <Button variant="danger" onClick={this.onDelete.bind(this, user.id)}>
            Delete
          </Button>
        </td>
      </tr>
    );
  }
}

export default connect(null, { deleteUser })(User);
