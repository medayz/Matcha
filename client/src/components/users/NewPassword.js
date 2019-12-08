import React, { Component } from "react";
import '../../css/login.css';
import RegisterInput from "./RegisterInput";
import { Redirect } from "react-router-dom";
import axios from "axios";


class NewPassword extends Component {
  state = {
    errState: "",
    pass: "",
    cPass: "",
    username: "",
    token: "",
    changed: false
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  changePass = async e => {
    e.preventDefault();
    const obj = {
        username: this.state.username,
        pass: this.state.pass,
        cPass: this.state.cPass
    }
    axios
    .post(`/api/users/resetpwd/${this.state.username}/${this.state.token}`, obj)
    .then(res => {
        this.setState({changed: true});
    })
    .catch(err => {
        this.setState({errState: "Password or token error"});
    });
  }
  
  componentDidMount () {
    const path = window.location.pathname.split("/");
    this.setState({username : path[2]});
    this.setState({token : path[3]});
  }

  render() {
    return (
      <div className="container">
        <div className="row">
            <div className="col-md-3"/>
            <div className="col-md-6">
                {this.state.errState &&
                    <div className="alert alert-danger" role="alert">
                        {this.state.errState}
                    </div>
                }
                {this.state.changed &&
                   <Redirect to="/login" />
                }
                <form id="Login" onSubmit={this.changePass}>
                    <div className="sign-in-htm">
                    <div className="group">
                        <label htmlFor="user" className="label">Password</label>
                        <RegisterInput
                        label=""
                        type="password"
                        name="pass"
                        id="pass"
                        className="pass"
                        placeholder="Enter password"
                        err={this.state.errState.pass}
                        value={this.state.pass}
                        onChange={this.onChange}
                        />
                    </div>
                    <div className="group">
                        <label htmlFor="pass" className="label">Confirm password</label>
                        <RegisterInput
                        label=""
                        type="password"
                        name="cPass"
                        id="cPass"
                        className="input"
                        placeholder="Confirm password"
                        err={this.state.errState.cPass}
                        value={this.state.cPass}
                        onChange={this.onChange}
                        />
                    </div>
                    <div className="group">
                        {this.state.change === "done" && 
                        <Redirect to='/login' />
                        }
                        <button type="submit" className="btn " style={{color: "white", backgroundColor:'pink'}}>
                            Change
                        </button>
                    </div>
                    <div className="hr"></div>
                    </div>
                </form>
            </div>
            <div className="col-md-3"/>
        </div>
      </div>
    );
  }
}

export default (NewPassword);
