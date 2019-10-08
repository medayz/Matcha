import React, { Component } from "react";
import RegisterInput from "./RegisterInput";
import axios from "axios";
import Alert from "../layout/Alert";
import { connect } from "react-redux";
import { setAlert } from "../../actions/alert";
import { setUser } from "../../actions/user";
import { user_state } from "../../actions/connected";
import { Redirect } from "react-router-dom";
import profile from "./ConfirmAcc";
import publicIp from "public-ip";

const head = {
  Accept: "application/json",
  "Content-Type": "application/json"
};
const ipinfo_token = "fb1bb2d727f4b8";


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

  getlocalisation = async () => {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        const loc = {
          long: position.coords.longitude,
          lat: position.coords.latitude
        }
        console.log(loc);
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED)
        {
          this.state.myip.then(ip => {
            axios
              .get(`http://ipinfo.io/${ip}?token=${ipinfo_token}`)
              .then(
                res => {
                  const [long, lat] = res.data.loc.split(',');
                  const location = {
                    long: Number(long),
                    lat: Number(lat),
                    city: res.data.city,
                    country: res.data.country
                  };
                  axios
                    .post('/api/users/add/location', location, head)
                    .catch(err => console.log(err));
                  // console.log(location);
                }
              )
              .catch(err => {
                // console.log(err.code);
              });
          });
        }
      }
    );  
  }

  onSubmit = async e => {
    e.preventDefault();
    //move this to status 200
    this.props.user_state(true);
    //
    this.getlocalisation()/*.then(res => {
      console.log(res);
      //route to update localisation
    });*/
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
            //this.clear();
            this.props.user_state(true);
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
  { setAlert, setUser , user_state }
)(Login);
