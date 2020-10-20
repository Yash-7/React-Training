import React, { Component } from "react";
import Highcharts from "react-highcharts";
import axios from "axios";

class Dashboard extends Component {
  state = {
    myTaskOptions: {},
    assignedTaskOptions: {},
    allTaskOptions: {},
  };

  componentDidMount() {
    // Pusher.logToConsole = true;

    // const pusher = new Pusher("53ec7dc21ce2dd50eedf", {
    //   cluster: "ap2",
    // });

    // const channel = pusher.subscribe("my-channel");
    // channel.bind("my-event", function (data) {
    //   console.log("pusher", data);
    //   alert(JSON.stringify(data));
    // });
    const options = {
      chart: {
        plotBackgroundColor: "rgb(245,245,245)",
        type: "pie",
      },

      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b>: {point.percentage:.1f} %",
          },
        },
      },
    };
    axios
      .get("http://localhost:8000/api/tasks/data", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        this.setState({
          myTaskOptions: {
            ...options,
            series: [
              {
                name: "Tasks",
                colorByPoint: true,
                data: [
                  {
                    name: "Todo",
                    y: res.data.myTasks.todo,
                  },
                  {
                    name: "In-Progress",
                    y: res.data.myTasks.inProgress,
                  },
                  {
                    name: "Completed",
                    y: res.data.myTasks.completed,
                  },
                  {
                    name: "Overdue",
                    y: res.data.myTasks.overdue,
                  },
                ],
              },
            ],
            title: {
              text: "Data of your tasks",
            },
          },
          assignedTaskOptions: {
            ...options,
            series: [
              {
                name: "Tasks",
                colorByPoint: true,
                data: [
                  {
                    name: "Assigned",
                    y: res.data.assignedTasks.assigned,
                  },
                  {
                    name: "In-Progress",
                    y: res.data.assignedTasks.inProgress,
                  },
                  {
                    name: "Completed",
                    y: res.data.assignedTasks.completed,
                  },
                  {
                    name: "Overdue",
                    y: res.data.assignedTasks.overdue,
                  },
                ],
              },
            ],
            title: {
              text: "Data of the tasks you assigned",
            },
          },
        });
        if (res.data.allTasks) {
          this.setState({
            allTaskOptions: {
              ...options,
              series: [
                {
                  name: "Tasks",
                  colorByPoint: true,
                  data: [
                    {
                      name: "Assigned",
                      y: res.data.allTasks.assigned,
                    },
                    {
                      name: "In-Progress",
                      y: res.data.allTasks.inProgress,
                    },
                    {
                      name: "Completed",
                      y: res.data.allTasks.completed,
                    },
                    {
                      name: "Overdue",
                      y: res.data.allTasks.overdue,
                    },
                  ],
                },
              ],
              title: {
                text: "Data of the tasks you assigned",
              },
            },
          });
        }
      });
  }

  render() {
    return (
      <div style={{ padding: "20px" }}>
        <Highcharts config={this.state.myTaskOptions} />
        <Highcharts config={this.state.assignedTaskOptions} />
        {this.props.user.role === "admin" ? (
          <Highcharts config={this.state.allTaskOptions} />
        ) : null}
      </div>
    );
  }
}

export default Dashboard;
