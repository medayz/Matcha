import React, { Component } from "react";
import { addPic } from "../../../helpers/addImg";

const avatarcss = {
  width: '140px',
  height: '140px',
  maxWidth: '140px',
  maxHeight: '140px',
}

const alertCss = {
  backgroundColor: 'pink',
  borderColor: 'pink',
  color: 'white',
  fontSize: '15px'
}

class Alertmsgerror extends Component{

  render () {
    return (
      <div className="alert alert-warning alert-dismissible fade show" role="alert">
        Error image
      </div>
    )
  }
}

class Alertmsgsuccess extends Component{

  render () {
    return (
      <div className="alert alert-success alert-dismissible fade show" role="alert">
        Image uploaded
      </div>
    )
  }
}

export default class ProfilePic extends Component {
  constructor(props) {
    super(props);
    this.fileUpload = React.createRef();
  }

  state = {
    msguploadimage: '',
    err: 'not yet',
    pp : this.props.pp
  }

  uploadProfileImg = async e => {
     let img = e.target.files[0];
     if (img.name.match(/\.(jpg|jpeg|png)$/)) {
      var formData = new FormData();
      formData.append("profileImg", img);
      formData.append("isProfilePic", true);
      await addPic(formData)
        .then(({ data }) => {
          /*axios.post("/api/users/delete/picture")
          .then(res => {})
          .catch(err => {});*/
          let imgs = this.state.pp;
          imgs.filename = data.img.filename;
          this.setState({msguploadimage : data.status});
          this.setState({pp : imgs});
          this.setState({err : true});
        })
        .catch(err => {
          this.setState({err : false});
        });
    }
    else
      this.setState({err : false});
  };


  render() {
    return (
      <div>
        <div className="profile-sidebar">
          <div className="profile-userpic">
            <div className="row">
              <img src={`http://localhost:1337/userPics/${this.state.pp.filename}`} style={avatarcss} className="img-responsive" alt="" />
            </div>
          </div>
          <div className="profile-usertitle">
            <div className="profile-usertitle-name">{this.props.username}</div>
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
        {this.state.err === true && <Alertmsgsuccess />}
        {this.state.err === false && <Alertmsgerror />}
        <br />
        <div>
            <div className="alert alert-primary" role="alert" style={alertCss}>
                <span>Complete your profile:</span>
                <br />
                <br />
                <li>
                  <ul>At least one picture</ul>
                  <ul>Birth date</ul>
                  <ul>Gender</ul>
                </li>
            </div>
        </div>
      </div>
    );
  }
}
