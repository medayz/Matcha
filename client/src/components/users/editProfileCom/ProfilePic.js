import React, { Component } from "react";
import { addPic } from "../../../helpers/addImg";


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
      addPic(formData)
        .then(({ data }) => {
          let img = data.img;
          let imgs = this.state.pp;
          imgs[0] = img;
          this.setState({pics : imgs});
          this.setState({msguploadimage : data.status});
          this.setState({err : true});
        })
        .catch(err => {
          this.setState({err : false});
        });
    }
    else
      this.setState({err : false});

    setTimeout(() => {
      this.setState({err : 'not yet'});
    }, 3000);
  };

  render() {
    return (
      <div>
        <div className="profile-sidebar">
          <div className="profile-userpic">
            <div className="row">
              <img src={`/uploads/${this.state.pp[0].filename}`} className="img-responsive" alt="" />
            </div>
          </div>
          <div className="profile-usertitle">
            <div className="profile-usertitle-name">name weldname</div>
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
      </div>
    );
  }
}
