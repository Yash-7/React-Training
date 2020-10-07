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
      <div
        style={{
          padding: "5px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "rgb(245,245,245)",
          borderBottom: "1px solid rgb(225,225,225)",
          borderLeft: "1px solid rgb(225,225,225)",
          borderRight: "1px solid rgb(225,225,225)",
        }}
      >
        <p style={{ paddingLeft: "10px", paddingTop: "10px" }}>{user.name}</p>
        <p style={{ paddingTop: "10px" }}>{user.email}</p>
        {/* <p style={{ paddingTop: "10px" }}>{user.isVerified}</p> */}
        <Button variant="danger" onClick={this.onDelete.bind(this, user.id)}>
          Delete
        </Button>
      </div>
    );
  }
}

export default connect(null, { deleteUser })(User);
