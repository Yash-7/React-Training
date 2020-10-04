import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import ProtectedRoute from "./ProtectedRoute";
import Nav from "./components/Nav";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Error404 from "./components/Error404";
import ForgotPwdRedirect from "./components/ForgotPwdRedirect";
import ForgotPassword from "./components/ForgotPassword";
import ChangePassword from "./components/ChangePassword";
import UserComponent from "./components/UserComponent";
import ResetPassword from "./components/ResetPassword";
import VerifyPassword from "./components/VerifyPassword";
import CreatePassword from "./components/CreatePassword";

import Admin from "./components/Admin";

class App extends React.Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Nav />
          <Switch>
            <Route exact path="/" component={Login} />
            <ProtectedRoute path="/user" component={UserComponent} />
            <ProtectedRoute path="/admin" component={Admin} />
            <Route path="/signup" component={SignUp} />
            <Route path="/forgotPassword" component={ForgotPassword} />
            <ProtectedRoute path="/resetPassword" component={ResetPassword} />
            <Route path="/verify/:token" component={VerifyPassword} />
            <Route path="/forgotPwdRe" component={ForgotPwdRedirect} />
            <Route path="/changePassword/:token" component={ChangePassword} />
            <Route path="/createPassword/:token" component={CreatePassword} />
            <Route component={Error404} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
