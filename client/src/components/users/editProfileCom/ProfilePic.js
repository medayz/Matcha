import React, { Component } from "react";
import defaultProfilePic from "../../../images/default/boss.png";
import { getter } from "../../../helpers/tokenOperation";
import { addPic } from "../../../helpers/addImg";

const head = {
    "auth-token": getter("token"),
    Accept: "application/json",
    "Content-Type": "application/json"
  };

export default class ProfilePic extends Component {
    constructor(props) {
        super(props);
        this.fileUpload = React.createRef();
      }
      uploadProfileImg = async e => {
        let img = e.target.files[0];
        if (img.name.match(/\.(jpg|jpeg|png)$/)) {
          var formData = new FormData();
          formData.append("profileImg", img);
          addPic(formData, head)
          .then(({ data }) => {
            console.log(data);
          })
          .catch(err => {
            console.log(err);
          });
        }
      };
  render() {
    return (
      <div>
        <div className="profile-sidebar">
          <div className="profile-userpic">
            <div className="row">
              <img src={defaultProfilePic} className="img-responsive" alt="" />
            </div>
          </div>
          <div className="profile-usertitle">
            <div className="profile-usertitle-name">
                    name weldname
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
    );
  }
}
