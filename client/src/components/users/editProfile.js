import React, { Component } from "react";
import Fjla from "../../backIndex.jpg";
import axios from "axios";
import RegisterInput from "./RegisterInput";
import classnames from "classnames";
class editProfile extends Component {
  state = {
    fName: "",
    lName: "",
    gender: "",
    location: "",
    activeLocation: false,
    tags: {
      tag: ''
    },
    pass: "",
    cPass: "",
    email: "",
    username: "",
    pics: {
      type: 0,
      link: ""
    },
    errState: {}
  };
  async componentDidMount() {
    const user = this.props.match.params.username;
    await axios
      .get(`http://localhost:1337/api/users/get/${user}`)
      .then(res => {
        if (res.data.data.length > 0){
          const user = res.data.data[0].props;
          if (user.fName) this.setState({ fName: user.fName });
          if (user.lName) this.setState({ lName: user.lName });
          if (user.username) this.setState({ username: user.username });
          if (user.email) this.setState({ email: user.email });
          if (user.gender) this.setState({ gender: user.gender });
          if (user.location) this.setState({ location: user.location });
        }
      });
  }
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = async e => {};
  render() {
    return (
      <div className="container-fluid">
        <div className="row profile">
          <div className="col-md-3">
            <div className="profile-sidebar">
              <div className="profile-userpic">
                <div className="row">
                  <img src={Fjla} className="img-responsive" alt="" />
                </div>
              </div>
              <div className="profile-usertitle">
                <div className="profile-usertitle-name">Marcus Doe</div>
                <div className="profile-usertitle-job">Developer</div>
              </div>
              <div className="profile-userbuttons">
                <button type="button" className="btn btn-success btn-sm">
                  Upload
                </button>
                <button type="button" className="btn btn-danger btn-sm">
                  Delete
                </button>
              </div>
            </div>
          </div>
          <br />
          <div className="col-md-9">
            <div className="profile-content">
              <form>
                <div className="row">
                  <div className="col">
                    <label>First name</label>
                    {this.state.fName !== "" && (
                      <input
                        type="text"
                        name="fName"
                        id="fName"
                        placeholder="Enter first name"
                        className={classnames("form-control", {
                          "is-invalid": false
                        })}
                        err={this.state.errState.fName}
                        value={this.state.fName}
                        onChange={this.onChange}
                      />
                    )}
                  </div>
                  <div className="col">
                    <label>Last name</label>
                    {this.state.lName !== "" && (
                      <input
                        type="text"
                        name="lName"
                        id="lName"
                        placeholder="Enter last name"
                        className={classnames("form-control", {
                          "is-invalid": false
                        })}
                        err={this.state.errState.lName}
                        value={this.state.lName}
                        onChange={this.onChange}
                      />
                    )}
                  </div>
                </div>
                <br />
                <div className="row">
                  <div className="col">
                    <label>Gender</label>
                    <select id="gender" className="form-control" />
                  </div>
                  <div className="col">
                    <label>Adress</label>
                    {this.state.lName !== "" && (
                      <input
                        type="text"
                        name="adress"
                        id="adress"
                        placeholder="Enter adress"
                        className={classnames("form-control", {
                          "is-invalid": false
                        })}
                        err={this.state.errState.location}
                        value={this.state.location}
                        onChange={this.onChange}
                      />
                    )}
                  </div>
                </div>
                <br />
                <div className="row">
                  <div className="col">
                    <label>Active notification</label>
                    <select id="activeN" className="form-control" />
                  </div>
                </div>
                <br />
                <div className="row">
                  <div className="col">
                    <label>Biography</label>
                    <textarea
                      className="form-control"
                      id="bio"
                      rows="3"
                      placeholder="Bio"
                    />
                  </div>
                </div>
                <br />
                <div className="row">
                  <div className="col">
                    <label>Tags</label>
                    <textarea
                      className="form-control"
                      id="tags"
                      rows="1"
                      placeholder="Tags"
                    />
                  </div>
                </div>
                <br />
                <div className="row">
                  <div className="col">
                    <button type="button" className="btn btn-primary">
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="row profile">
          <div className="col-md-3" />
          <br />
          <div className="col-md-9">
            <div className="profile-content">
              <form>
                <div className="row">
                  <div className="col">
                  <label>Username</label>
                    {this.state.username !== "" && (
                      <input
                        type="text"
                        name="username"
                        id="username"
                        placeholder="Enter username"
                        className={classnames("form-control", {
                          "is-invalid": false
                        })}
                        err={this.state.errState.username}
                        value={this.state.username}
                        onChange={this.onChange}
                      />
                    )}
                  </div>
                  <div className="col">
                  <label>E-mail</label>
                    {this.state.email !== "" && (
                      <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter email"
                        className={classnames("form-control", {
                          "is-invalid": false
                        })}
                        err={this.state.errState.email}
                        value={this.state.email}
                        onChange={this.onChange}
                      />
                    )}
                  </div>
                </div>
                <br />
                <div className="row">
                  <div className="col">
                    <RegisterInput
                      label="Password"
                      type="password"
                      name="pass"
                      id="pass"
                      placeholder="Enter password"
                      err={this.state.errState.password}
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
                      err={this.state.errState.cPass}
                      onChange={this.onChange}
                    />
                  </div>
                </div>
                <br />
                <div className="row">
                  <div className="col">
                    <button type="button" className="btn btn-primary">
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="row profile">
          <div className="col-md-3" />
          <br />
          <div className="col-md-9">
            <div className="profile-content">
              <form>
                <div className="row jjj">
                  <div className="card jj">
                    <img src={Fjla} className="card-img-top" alt="..." />
                  </div>
                  <div className="card jj">
                    <img src={Fjla} className="card-img-top" alt="..." />
                  </div>
                  <div className="card jj">
                    <img src={Fjla} className="card-img-top" alt="..." />
                  </div>
                  <div className="card jj">
                    <img src={Fjla} className="card-img-top" alt="..." />
                  </div>
                </div>
                <br />
                <div className="row">
                  <div className="col">
                    <button type="button" className="btn btn-primary">
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default editProfile;
