import React, { Component } from "react";

class SideNav extends Component {
  state = {};
  render() {
    return (
      <div>
        <div className="sidenav">
          <div className="sidebar-heading">John Doe </div>
          {/* <div className="list-group list-group-flush">
            <p className="list-group-item list-group-item-action bg-light">
              Dashboard
            </p>
            <p className="list-group-item list-group-item-action bg-light">
              Shortcuts
            </p>
            <p className="list-group-item list-group-item-action bg-light">
              Overview
            </p>
          </div> */}
        </div>
      </div>
    );
  }
}

export default SideNav;
