import React, { Component } from "react";
import defaultProfilePic from "../../images/default/boss.png";
import noSnap from "../../images/default/icon.png";
import deleteLogo from "../../images/default/delete.png";
import addLogo from "../../images/default/plus.png";
import axios from "axios";
import RegisterInput from "./RegisterInput";
import Chip from "@material-ui/core/Chip";
import CreatableSelect from "react-select/creatable";
import { addTags } from "../../helpers/addTags";
import { getAllTags } from "../../helpers/getAllTags";
import { getUserTags } from "../../helpers/getUserTags";
import "./test.css";
import TextField from "@material-ui/core/TextField";
import { getter } from "../../helpers/tokenOperation";
import { Redirect } from "react-router";

const logoAdd = {
  width: "25%",
  height: "25%",
  paddingLeft: "2%"
};

const head = {
  "auth-token": getter("token"),
  Accept: "application/json",
  "Content-Type": "application/json"
};

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.fileUpload = React.createRef();
  }
  state = {
    fName: "",
    lName: "",
    gender: "",
    location: "",
    birthDate: "",
    sexualPref: "",
    activeLocation: false,
    bio: "",
    visible: false,
    pass: "",
    cPass: "",
    email: "",
    username: "",
    msg1: "",
    msg2: "",
    msg3: "",
    tokenErr: "",
    errState: {},
    options: [],
    optionsUser: []
  };
  clearErrorState = () => {
    this.setState({ errState: {} });
    this.setState({ msg1: "" });
    this.setState({ msg2: "" });
    this.setState({ msg3: "" });
  };
  editInfo = async e => {
    e.preventDefault();
    this.clearErrorState();
    const usr = {
      fName: this.state.fName,
      lName: this.state.lName,
      gender: this.state.gender,
      location: this.state.location,
      activeLocation: this.state.activeLocation,
      bio: this.state.bio,
      birthDate: this.state.birthDate,
      sexualPref: this.state.sexualPref
    };
    if (usr.activeLocation === "1") usr.activeLocation = true;
    else usr.activeLocation = false;
    this.setState({ activeLocation: usr.activeLocation });
    await axios
      .put(`http://localhost:1337/api/users/edit/infos`, usr, {
        headers: head
      })
      .then(res => {
        this.setState({ msg1: res.data.msg });
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

  editEmail = async e => {
    e.preventDefault();
    this.clearErrorState();
    const usr = {
      email: this.state.email
    };
    console.log(usr);
  };

  uploadProfileImg = async e => {
    let img = e.target.files[0];
    if (img.name.match(/\.(jpg|jpeg|png)$/)) {
      console.log(img);
      const formData = new FormData();
      formData.append("profileImg", img, img.name);
    }
  };
  editUsername = async e => {
    this.clearErrorState();
    e.preventDefault();
    const usr = {
      username: 'cmarouan1',
      newUsername: this.state.username
    };
    await axios
      .put(`http://localhost:1337/api/users/edit/username`, usr, {
        headers: head
      })
      .then(res => {
        this.setState({ msg2: res.data.msg });
      })
      .catch(err => {
        const backend = err.response.data;
        if (backend.status === 400)
          this.setState({ errState: backend.data.err });
        else if (backend.status === 401) {
          this.setState({ tokenErr: backend.msg });
        }
        console.log(this.state.errState);
      });
  };
  uploadsnap = () => {
    this.fileUpload.current.click();
  };
  editPass = async e => {
    e.preventDefault();
    const usr = {
      pass: this.state.pass,
      cPass: this.state.cPass
    };
    console.log(usr);
  };
  onChangeTags = (newValue) => {
    var Tags = {
      value: newValue.value,
      label: newValue.label
    };
    console.log(Tags);
  };
  handleBirthday = e => {
    this.setState({ birthDate: e.currentTarget.value });
  };

  handleActiveNotif = e => {
    this.setState({ activeLocation: e.currentTarget.value });
  };

  handleGender = e => {
    this.setState({ gender: e.currentTarget.value });
  };

  callTags = () => {
    getAllTags().then(({ data }) => {
      this.setState({
        options: data.data.map(tag => {
          return {
            value: tag.props.name,
            label: tag.props.name
          };
        })
      });
    });
  }

  calluserTags = () => {
    getUserTags(this.state.username).then(({ data }) => {
      this.setState({
        optionsUser: data.data.map(tag => {
          return {
            value: tag.props.name,
            label: tag.props.name
          };
        })
      });
    });
  }

  onChangeTags = async (newValue) => {
    if (newValue){
      var Tags = {
        tagName: newValue.value
      };
      var Tag = {
        value: newValue.value,
        label: newValue.value
      };
      var neww =[...this.state.options, Tag];
      this.setState({options: neww}); 
      addTags(this.state.username, Tags, head).then(({ data }) => {
        this.callTags();
        this.calluserTags();
      });
    }
  };
  
  async componentDidMount() { 
    this.callTags();
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
        if (user.bio) this.setState({ bio: user.bio });
        if (user.sexualPref) this.setState({ sexualPref: user.sexualPref });
        if (user.birthDate) this.setState({ birthDate: user.birthDate });
        this.setState({ visible: true });
        this.calluserTags();
      }
    });
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  componentWillUnmount() {
    this.setState({tokenErr : ''});
  }

  render() {
    function handleDelete() {
      alert("You clicked the delete icon.");
    }
    return (
      <div className="container-fluid">
        <div className="row profile">
          <div className="col-md-3">
            <div className="profile-sidebar">
              <div className="profile-userpic">
                <div className="row">
                  <img
                    src={defaultProfilePic}
                    className="img-responsive"
                    alt=""
                  />
                </div>
              </div>
              <div className="profile-usertitle">
                <div className="profile-usertitle-name">
                  {this.state.fName} {this.state.lName}
                </div>
              </div>
              <div className="upload-btn-wrapper">
                <center>
                  <button className="btn222">Upload image</button>
                  <input
                    type="file"
                    name="myfile"
                    onChange={this.uploadProfileImg}
                  />
                </center>
              </div>
            </div>
          </div>
          <br />
          <div className="col-md-9">
            <div className="profile-content">
              <form onSubmit={this.editInfo}>
                <div className="row">
                  <div className="col">
                    {this.state.visible !== "" && (
                      <RegisterInput
                        label="First name"
                        type="text"
                        name="fName"
                        id="fName"
                        value={this.state.fName}
                        placeholder="Enter first name"
                        err={this.state.errState.fName}
                        onChange={this.onChange}
                      />
                    )}
                  </div>
                  <div className="col">
                    {this.state.visible !== "" && (
                      <RegisterInput
                        label="Last name"
                        type="text"
                        name="lName"
                        id="lName"
                        value={this.state.lName}
                        placeholder="Enter last name"
                        err={this.state.errState.lName}
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
                      defaultValue={this.state.gender}
                      onChange={this.handleGender}
                      className="form-control"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="col">
                    {this.state.visible !== "" && (
                      <RegisterInput
                        label="sexualPref"
                        type="text"
                        name="sexualPref"
                        id="sexualPref"
                        value={this.state.sexualPref}
                        placeholder="Enter your sexualPref"
                        err={this.state.errState.sexualPref}
                        onChange={this.onChange}
                      />
                    )}
                  </div>
                </div>
                <br />
                <div className="row">
                  <div className="col">
                    {this.state.visible !== "" && (
                      <RegisterInput
                        label="Location"
                        type="text"
                        name="location"
                        id="location"
                        value={this.state.location}
                        placeholder="Enter your location"
                        err={this.state.errState.location}
                        onChange={this.onChange}
                      />
                    )}
                  </div>
                </div>
                <br />
                <div className="row">
                  <div className="col">
                    <label>
                      <small>Your birthDay</small> {this.state.birthDate}
                    </label>
                    <br />
                    {this.state.visible !== "" && (
                      <TextField
                        id="date"
                        type="date"
                        onChange={this.handleBirthday}
                        defaultValue={this.state.birthDate}
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                    )}
                  </div>
                  <div className="col">
                    <label>Active location</label>
                    <select
                      onChange={this.handleActiveNotif}
                      id="activeNotf"
                      defaultValue={""}
                      className="form-control"
                    >
                      <option value="1">True</option>
                      <option value="0">False</option>
                    </select>
                  </div>
                </div>
                <br />
                <div className="row">
                  <div className="col">
                    <label>Biography</label>
                    {this.state.visible !== "" && (
                      <textarea
                        className="form-control"
                        id="bio"
                        rows="3"
                        name="bio"
                        placeholder="Bio"
                        value={this.state.bio}
                        onChange={this.onChange}
                      />
                    )}
                  </div>
                </div>
                <br />
                <div className="row">
                  <div className="col">
                    <label>Add tags</label>
                    <CreatableSelect
                      isClearable
                      onChange={this.onChangeTags}
                      //onInputChange={this.handleInputChange}
                      options={this.state.options}
                    />
                  </div>
                </div>
                <br />
                <div className="row">
                  <div className="col">
                    <label>My tags</label>
                    <br />
                    {this.state.optionsUser.map(tag => {
                      return (
                        <Chip
                          key={tag.label}
                          label={tag.label}
                          value={tag.value}
                          onDelete={handleDelete}
                          onChange={this.handleChangeTag}
                          className=""
                          color="primary"
                        />
                      );
                    })}
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
                    {this.state.msg1 && (
                      <div className="alert alert-primary" role="alert">
                        {" "}
                        {this.state.msg1}{" "}
                      </div>
                    )}
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
              <form onSubmit={this.editUsername}>
                <div className="row">
                  <div className="col">
                    {this.state.visible !== "" && (
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
                    )}
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
          </div>
        </div>
        <div className="row profile">
          <div className="col-md-3" />
          <br />
          <div className="col-md-9">
            <div className="profile-content">
              <form onSubmit={this.editEmail}>
                <div className="row">
                  <div className="col">
                    {this.state.visible !== "" && (
                      <RegisterInput
                        label="E-mail"
                        type="email"
                        name="email"
                        id="email"
                        value={this.state.email}
                        placeholder="Enter an E-mail"
                        err={this.state.errState.email}
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
              <form onSubmit={this.editPass}>
                <div className="row">
                  <div className="col">
                    <RegisterInput
                      label="Password"
                      type="password"
                      name="pass"
                      id="pass"
                      placeholder="Enter password"
                      value={this.state.pass}
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
        </div>
        <div className="row profile">
          <div className="col-md-3" />
          <br />
          <div className="col-md-9">
            <div className="profile-content">
              <form>
                <div className="row jjj">
                  <div className="card jj">
                    <img src={noSnap} className="card-img-top" alt="..." />
                    <center>
                      <img src={deleteLogo} style={logoAdd} alt="..." />
                      <img
                        src={addLogo}
                        onClick={this.uploadsnap}
                        style={logoAdd}
                        alt="..."
                      />
                    </center>
                  </div>
                  <div className="card jj">
                    <img src={noSnap} className="card-img-top" alt="..." />
                    <center>
                      <img src={deleteLogo} style={logoAdd} alt="..." />
                      <img
                        src={addLogo}
                        onClick={this.uploadsnap}
                        style={logoAdd}
                        alt="..."
                      />
                    </center>
                  </div>
                  <div className="card jj">
                    <img src={noSnap} className="card-img-top" alt="..." />
                    <center>
                      <img src={deleteLogo} style={logoAdd} alt="..." />
                      <img
                        src={addLogo}
                        onClick={this.uploadsnap}
                        style={logoAdd}
                        alt="..."
                      />
                    </center>
                  </div>
                  <div className="card jj">
                    <img src={noSnap} className="card-img-top" alt="..." />
                    <center>
                      <img src={deleteLogo} style={logoAdd} alt="..." />
                      <img
                        src={addLogo}
                        onClick={this.uploadsnap}
                        style={logoAdd}
                        alt="..."
                      />
                    </center>
                  </div>
                </div>
                <br />
                <input
                  type="file"
                  ref={this.fileUpload}
                  id="snapInput"
                  hidden
                />
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
        {this.state.tokenErr && <Redirect to="/login" />}
      </div>
    );
  }
}

export default EditProfile;
