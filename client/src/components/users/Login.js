import React, { Component } from "react";
import RegisterInput from "./RegisterInput";
import axios from "axios";
import Alert from "../layout/Alert";
import { connect } from "react-redux";
import { setAlert } from "../../actions/alert";
import { setUser } from "../../actions/user";
import { user_socket } from "../../actions/socket";
import { user_state } from "../../actions/connected";
import { Redirect } from "react-router-dom";
import profile from "./ConfirmAcc";
import publicIp from "public-ip";
import io from 'socket.io-client';
import '../../css/login.css';

const head = {
  Accept: "application/json",
  "Content-Type": "application/json"
};
const ipinfo_token = "fb1bb2d727f4b8";


class Login extends Component {
  state = {
    username: "",
    pass: "",
    forgetUsername: "",
    emailSend: "",
    errState: {},
    login: "",
    longitude: -1,
    latitude: -1,
    apikey: "7fe00b97-6bab-4efc-b916-f95e25a32256",
    myip: publicIp.v4(),
    show: undefined,
    userConnection: false
  };

  _unmount = true;

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
        axios
          .post('/api/users/add/location', loc, head)
          .catch(err => {});
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED)
        {
          this.state.myip.then(ip => {
            axios
              .get(`http://ipinfo.io/${ip}?token=${ipinfo_token}`)
              .then(
                res => {
                  const [lat, long] = res.data.loc.split(',');
                  const location = {
                    long: Number(long),
                    lat: Number(lat),
                    city: res.data.city,
                    country: res.data.country
                  };
                  axios
                    .post('/api/users/add/location', location, head)
                    .catch(err => {});
                }
              )
              .catch(err => {
                
              });
          });
        }
      }
    );  
  }
  onForgotPass = async e => {
    e.preventDefault();
    const obj = {
      username: this.state.forgetUsername
    }
    await axios
      .post('/api/users/forgotpwd', obj)
      .then(res => {
        this.setState({forgetUsername: ""});
        this.setState({emailSend: "email Send"});
      })
      .catch(err => {
        
      });
  }
  onSubmit = async e => {
    e.preventDefault();
    
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
          .then(async res => {
            await this.getlocalisation();
            this.props.setUser(this.state.username);
            const backend = res.data;
            if (res.status === 200) {
              this.setState({
                pass: "",
                errState: {}
              });
              let socket = io(':1337', {query: `owner=${this.state.username}`});
              this.props.user_socket(socket);
              this.setState({ login: "done" });
              this.props.user_state(true);
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
            if (err.response) {
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
            }
          });
      } else return;
    
  };
  
  componentDidMount () {
      axios.get('/api/users/whoami')
      .then(res => {
        this._unmount && this.setState({
          userConnection : true
        });
      })
      .catch(err => {
      });
  }

  componentWillUnmount () {
    this._unmount = false;
  }
 

  render() {

    return (
        <div className="container">
          {this.state.userConnection === true && <Redirect to='/home'/>}
          {this.state.errState.active && (
                <div className="alert alert-primary" role="alert">
                  {" "}
                  {this.state.errState.active}{" "}
                </div>
              )}
              <Alert />
          {this.state.emailSend &&
            <div className="alert alert-success" role="alert">
              {this.state.emailSend}
            </div>
          }
          {<div className="login-wrap">
              <div className="login-html">
                <input id="tab-1" type="radio" name="tab" className="sign-in" defaultChecked="true" /><label htmlFor="tab-1" className="tab">Sign In</label>
                <input id="tab-2" type="radio" name="tab" className="for-pwd" /><label htmlFor="tab-2" className="tab">Forgot Password</label>
                <div className="login-form">
                  <form id="Login" onSubmit={this.onSubmit}>
                    <div className="sign-in-htm">
                      <div className="group">
                        <label htmlFor="user" className="label">Username or Email</label>
                        <RegisterInput
                          label=""
                          type="text"
                          name="username"
                          id="username"
                          className="input"
                          placeholder="Enter username"
                          err={this.state.errState.username}
                          value={this.state.username}
                          onChange={this.onChange}
                        />
                      </div>
                      <div className="group">
                        <label htmlFor="pass" className="label">Password</label>
                        <RegisterInput
                          label=""
                          type="password"
                          name="pass"
                          id="pass"
                          className="input"
                          placeholder="Enter password"
                          err={this.state.errState.pass}
                          value={this.state.pass}
                          onChange={this.onChange}
                        />
                      </div>
                      <div className="group">
                        {this.state.login === "done" && (
                          <Redirect to={`/profile/edit`} Component={profile} />
                        )}
                        <button type="submit" className="button">
                          Login
                        </button>
                      </div>
                      <div className="hr"></div>
                    </div>
                  </form>
                  <div className="for-pwd-htm">
                    <div className="group">
                      <form id="Forget" onSubmit={this.onForgotPass}>
                          <label htmlFor="user" className="label">Username</label>
                          <RegisterInput
                            label=""
                            type="text"
                            name="forgetUsername"
                            id="forgetUsername"
                            className="forgetUsername"
                            placeholder="Enter username"
                            err=""
                            value={this.state.forgetUsername}
                            onChange={this.onChange}
                          />
                          <div className="group">
                            <input type="submit" className="button" value="Reset Password" />
                          </div>
                      </form>
                    </div>
                    <div className="hr"></div>
                  </div>
                </div>
              </div>
          </div>}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userState: state.connected,
    userSocket: state.socket,
  }
}

export default connect(
  mapStateToProps,
  {setAlert, setUser, user_state, user_socket}
)(Login);
