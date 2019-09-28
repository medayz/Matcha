import React, { Component } from "react";
import RegisterInput from "./RegisterInput";
import axios from "axios";
import Alert from "../layout/Alert";
import { connect } from "react-redux";
import { setAlert } from "../../actions/alert";
import { setUser } from "../../actions/user";
import { Redirect } from "react-router-dom";
import profile from "./ConfirmAcc";

const head = {
  Accept: "application/json",
  "Content-Type": "application/json"
};

class Login extends Component {
  state = {
    username: "",
    pass: "",
    errState: {},
    login: "",
    longitude: -1,
    latitude: -1,
    apikey: "7fe00b97-6bab-4efc-b916-f95e25a32256",
    myip: publicIp.v4()
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  clear = () => {
    document.getElementById("username").value = "";
    document.getElementById("pass").value = "";
  };

  getlocalisation =  () => {
    let promise = new Promise(async (resolve, reject) => {
      let loc = [];
      navigator.geolocation.getCurrentPosition(function(position) {
            console.log("active");
            loc.push(position.coords.longitude);
            loc.push(position.coords.latitude);
            resolve(loc);
      },
      async (error) => {
        if (error.code === error.PERMISSION_DENIED)
        {
          console.log("not active");
          let ip;
          await this.state.myip.then(res => {
            ip = res;
          });
          await axios.get("http://ip-api.com/json/" + ip)
          .then(res => {
            loc.push(res.data.lon);
            loc.push(res.data.lat);
            resolve(loc);
          })
        }
      });  
    })
    return promise;
  }

  onSubmit = async e => {
    e.preventDefault();
    await this.getlocalisation().then(res => {
      console.log(res);
      //route to update localisation
    });
    const err = {
      username: "",
      pass: "",
      active: ""
    };
    this.setState({ errState: err });
    if (this.state.username.length === 0) err.username = "Username is required";
    if (this.state.pass.length === 0) err.pass = "password is required";
    if (err.username === "" && err.pass === "") {
      const user = this.state;
      await axios
        .post(`/api/users/auth`, user, head)
        .then(res => {
          this.props.setUser(this.state.username);
          const backend = res.data;
          if (res.status === 200) {
            this.setState({
              pass: "",
              errState: {}
            });
            this.clear();
            this.setState({ login: "done" });
          } else {
            if (backend.data.err.username !== "")
              err.email = backend.data.err.username;
            if (backend.data.err.pass !== "")
              err.username = backend.data.err.pass;
            if (backend.data.err.active !== "")
              err.active = backend.data.err.active;
            this.setState({ errState: backend.data.err });
            return;
          }
        })
        .catch(err => {
          const back_err = err.response.data;
          if (err.response.status === 400) {
            if (back_err.data.err.username !== "")
              err.username = back_err.data.err.username;
            if (back_err.data.err.pass !== "")
              err.pass = back_err.data.err.pass;
            if (back_err.data.err.active !== "")
              err.active = back_err.data.err.active;
            this.setState({ errState: err });
            return;
          }
        });
    } else return;
  };

  render() {
    return (
      <div className="container">
        {this.state.errState.active && (
          <div className="alert alert-primary" role="alert">
            {" "}
            {this.state.errState.active}{" "}
          </div>
        )}
        <Alert />
        <form id="Login" onSubmit={this.onSubmit}>
          <RegisterInput
            label="Username"
            type="text"
            name="username"
            id="username"
            placeholder="Enter username"
            err={this.state.errState.username}
            value={this.state.username}
            onChange={this.onChange}
          />
          <RegisterInput
            label="Password"
            type="password"
            name="pass"
            id="pass"
            placeholder="Enter password"
            err={this.state.errState.pass}
            value={this.state.pass}
            onChange={this.onChange}
          />
          {this.state.login === "done" && (
            <Redirect to={`/profile/edit`} Component={profile} />
          )}
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
      </div>
    );
  }
}

export default connect(
  null,
  { setAlert, setUser }
)(Login);
