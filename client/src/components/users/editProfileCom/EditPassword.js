import React, { Component } from "react";
import RegisterInput from "../RegisterInput";
import axios from "axios";
import { getter, deletter } from "../../../helpers/tokenOperation";
import { Redirect } from "react-router";

export default class EditUsername extends Component {
  state = {
    pass: "",
    cPass: "",
    errState: {},
    isValid: false
  };
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  editPass = async e => {
    e.preventDefault();
    const pwd = {
      pass: this.state.pass,
      newPass: this.state.newPass,
      cPass: this.state.cPass
    };
    await axios
      .put(`http://localhost:1337/api/users/edit/password`, pwd, {
        headers: {
          "auth-token": getter("token"),
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      })
      .then(res => {
        deletter("token");
        this.setState({ isValid: true });
      })
      .catch(err => {
        const backend = err.response.data;
        if (backend.status === 400)
          this.setState({ errState: backend.data.err });
        else if (backend.status === 401) {
          this.setState({ tokenErr: backend.msg });
        }
      });
  };

  render() {
    return (
      <div className="row profile">
        <div className="col-md-3" />
        <br />
        <div className="col-md-9">
          <div className="profile-content">
            <form onSubmit={this.editPass}>
              <div className="row">
                <div className="col">
                  <RegisterInput
                    label="old password"
                    type="password"
                    name="pass"
                    id="pass"
                    placeholder="current password"
                    value={this.state.pass}
                    err={this.state.errState.pass}
                    onChange={this.onChange}
                  />
                </div>
                <div className="col">
                  <RegisterInput
                    label="new password"
                    type="password"
                    name="newPass"
                    id="newPass"
                    placeholder="Enter new password"
                    value={this.state.newPass}
                    err={this.state.errState.newPass}
                    onChange={this.onChange}
                  />
                </div>
                <div className="col">
                  <RegisterInput
                    label="Confirm password"
                    type="password"
                    name="cPass"
                    id="cPass"
                    placeholder="Confirm password"
                    value={this.state.cPass}
                    err={this.state.errState.cPass}
                    onChange={this.onChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        {this.state.isValid && <Redirect />}
      </div>
    );
  }
}