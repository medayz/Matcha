import React, { Component } from "react";
import noSnap from "../../images/default/icon.png";
import deleteLogo from "../../images/default/delete.png";
import addLogo from "../../images/default/plus.png";
import axios from "axios";
import defaultProfilePic from "../../images/default/boss.png";
import RegisterInput from "./RegisterInput";
import EditInfos from './editProfileCom/EditInfos';
import EditUsername from './editProfileCom/EditUsername';
import EditEmail from './editProfileCom/EditEmail';
import "./test.css";
import { Redirect } from "react-router";

const logoAdd = {
  width: "25%",
  height: "25%",
  paddingLeft: "2%"
};

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.fileUpload = React.createRef();
  }
  state = {
    visible: false,
    pass: "",
    cPass: "",
    email: "",
    username: "",
    msg2: "",
    msg3: "",
    tokenErr: "",
    errState: {},
  };
  clearErrorState = () => {
    this.setState({ errState: {} });
    this.setState({ msg1: "" });
    this.setState({ msg2: "" });
    this.setState({ msg3: "" });
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
  
  async componentWillMount() { 
    const user = this.props.match.params.username;
    await axios.get(`http://localhost:1337/api/users/get/${user}`).then(res => {
      if (res.data.data.props) {
        const user = res.data.data.props;
        if (user.username) this.setState({ username: user.username });
        if (user.email) this.setState({ email: user.email });
        
        this.setState({ visible: true });
      }
    });
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

 
  render() {
   
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
          {this.state.visible === true &&
          <EditInfos username={this.state.username}/> }
          </div>
        </div>
        <div className="row profile">
          <div className="col-md-3" />
          <br />
          <div className="col-md-9">
          {this.state.visible === true &&
            <EditUsername  username={this.state.username}/>}
          </div>
        </div>
        <div className="row profile">
          <div className="col-md-3" />
          <br />
          <div className="col-md-9">
          {this.state.visible === true &&
            <EditEmail email={this.state.email}/>}
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
