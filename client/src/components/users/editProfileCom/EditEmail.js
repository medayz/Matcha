import React, { Component } from "react";
import RegisterInput from "../RegisterInput";
import axios from "axios";

export default class EditUsername extends Component {
  state = {
    email: "",
    errState: {},
    msg3: "",
    visible: false
  };
  onChange = async e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  editEmail = async e => {
    e.preventDefault();
    this.clearErrorState();
    const usr = {
      newEmail: this.state.email
    };
    
    await axios
    .put(`/api/users/edit/email`, usr)
    .then(res => {
      this.setState({ msg3: res.data.msg });
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
    this.setState({ msg3: "" });
  };
  UNSAFE_componentWillMount() {
    this.setState({ email: this.props.email });
    this.setState({ visible: true });
  }
  render() {
    return (
      <div>
         <div className="profile-content">
              <form onSubmit={this.editEmail}>
                <div className="row">
                  <div className="col">
                    {this.state.visible && (
                      <RegisterInput
                        label="E-mail"
                        type="email"
                        name="email"
                        id="email"
                        value={this.state.email}
                        placeholder="Enter an E-mail"
                        err={this.state.errState.newEmail}
                        onChange={this.onChange}
                      />
                    )}
                  </div>
                </div>
                <br />
                <div className="row">
                  <div className="col">
                    <button type="submit" className="btn btn-primary">
                      Save
                    </button>
                  </div>
                  <div className="col">
                    {this.state.msg3 && (
                      <div className="alert alert-primary" role="alert">
                        {" "}
                        {this.state.msg3}{" "}
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>
      </div>
    );
  }
}
