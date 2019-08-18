import React, { Component } from "react";
import noSnap from "../../images/default/icon.png";
import deleteLogo from "../../images/default/delete.png";
import addLogo from "../../images/default/plus.png";
import axios from "axios";
import EditInfos from "./editProfileCom/EditInfos";
import ProfilePic from "./editProfileCom/ProfilePic";
import EditUsername from "./editProfileCom/EditUsername";
import EditPassword from "./editProfileCom/EditPassword";
import EditEmail from "./editProfileCom/EditEmail";
import "./test.css";
import { Redirect } from "react-router";
// import jwt from "jsonwebtoken";
// import { getter } from "../../helpers/tokenOperation";

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
    errState: {}
  };
  clearErrorState = () => {
    this.setState({ errState: {} });
    this.setState({ msg1: "" });
    this.setState({ msg2: "" });
    this.setState({ msg3: "" });
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
  onChangeTags = newValue => {
    var Tags = {
      value: newValue.value,
      label: newValue.label
    };
    console.log(Tags);
  };

  async componentWillMount() {
    // const user = jwt.decode(getter('token')).username;
    const user = "hamid";
    await axios.get(`http://localhost:1337/api/users/get/${user}`).then(res => {
      if (res.data.data.props) {
        const user = res.data.data.props;
        if (user.username) this.setState({ username: user.username });
        if (user.email) this.setState({ email: user.email });
        this.setState({ visible: true });
      }
    });
    //console.log(this.state);
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <div className="container-fluid">
        <div className="row profile">
          <div className="col-md-3">
            <ProfilePic />
          </div>
          <br />
          <div className="col-md-9">
            {this.state.visible && <EditInfos username={this.state.username} />}
          </div>
        </div>
        <div className="row profile">
          <div className="col-md-3" />
          <br />
          <div className="col-md-9">
            {this.state.visible && (
              <EditUsername username={this.state.username} />
            )}
          </div>
        </div>
        <div className="row profile">
          <div className="col-md-3" />
          <br />
          <div className="col-md-9">
            {this.state.visible && <EditEmail email={this.state.email} />}
          </div>
        </div>
        <EditPassword />
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
