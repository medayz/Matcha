import React, { Component } from "react";
import Fjla from "../../backIndex.jpg";
import axios from "axios";
import RegisterInput from "./RegisterInput";
import classnames from "classnames";
import Chip from "@material-ui/core/Chip";
import Select from "react-select";
import { getAllTags } from "../../helpers/getAllTags";

class editProfile extends Component {
  state = {
    fName: "",
    lName: "",
    gender: "",
    location: "",
    activeLocation: false,
    tags: {
      tag: ""
    },
    visible: false,
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
    await axios.get(`http://localhost:1337/api/users/get/${user}`).then(res => {
      if (res.data.data.props) {
        const user = res.data.data.props;
        if (user.fName) this.setState({ fName: user.fName });
        if (user.lName) this.setState({ lName: user.lName });
        if (user.username) this.setState({ username: user.username });
        if (user.email) this.setState({ email: user.email });
        if (user.gender) this.setState({ gender: user.gender });
        if (user.location) this.setState({ location: user.location });
        this.setState({ visible: true });
      }
    });
  }
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = async e => {};
  render() {
    function handleDelete() {
      alert("You clicked the delete icon.");
    }
    const options = [{ value: "", label: "" }];
    getAllTags().then(res => {
      options[0].value = res.data.data[0].props.owner;
      options[0].label = res.data.data[0].props.title;
    });
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
                    {this.state.visible !== "" && (
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
                    {this.state.visible !== "" && (
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
                    <select
                      id="gender"
                      defaultValue={"Male"}
                      className="form-control"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="col">
                    <label>Adress</label>
                    {this.state.visible !== "" && (
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
                    <select
                      id="activeNotf"
                      defaultValue={"No"}
                      className="form-control"
                    >
                      <option value="No">Yes</option>
                      <option value="Yes">No</option>
                    </select>
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
                    <label>Add tags</label>
                    <Select options={options} />
                  </div>
                </div>
                <br />
                <div className="row">
                  <div className="col">
                    <label>My tags</label>
                    <br />
                    <Chip
                      label="-42"
                      onDelete={handleDelete}
                      className=""
                      color="primary"
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
                    {this.state.visible !== "" && (
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
                    {this.state.visible !== "" && (
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
                    <label>E-mail</label>
                    {this.state.visible !== "" && (
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
