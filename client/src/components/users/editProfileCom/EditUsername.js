import React, { Component } from "react";
import RegisterInput from "../RegisterInput";
import axios from "axios";
import { getter, deletter } from "../../../helpers/tokenOperation";
import { Redirect } from 'react-router';

export default class EditUsername extends Component {
  state = {
    username: "",
    errState: {},
    visible: false
  };
  onChange = async e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  editUsername = async e => {
    e.preventDefault();
    const usr = {
      newUsername: this.state.username
    };
    
    await axios
    .put(`http://localhost:1337/api/users/edit/username`, usr, {
      headers: { "auth-token": await getter("token"),
      Accept: "application/json",
      "Content-Type": "application/json"}
    })
    .then(res => {
      this.setState({ msg2: res.data.msg });
      deletter('token');
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
  clearErrorState = () => {
    this.setState({ errState: {} });
    this.setState({ msg2: "" });
    this.setState({ visible: false });
  };
  componentWillMount() {
    this.setState({ username: this.props.username });
  }
  render() {
    return (
      <div>
          <div className="profile-content">
              <form onSubmit={this.editUsername}>
                <div className="row">
                  <div className="col">
                      <RegisterInput
                        label="Username"
                        type="text"
                        name="username"
                        id="username"
                        value={this.state.username}
                        placeholder="Enter an username"
                        err={this.state.errState.newUsername}
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
                  <div className="col">
                    {this.state.msg2 && (
                      <div className="alert alert-primary" role="alert">
                        {" "}
                        {this.state.msg2}{" "}
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>
            {this.state.msg2 && <Redirect to={`/login`}/>}
      </div>
    );
  }
}
