import React, { Component } from "react";
import { addPic } from "../../../helpers/addImg";
import axios from 'axios';
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
    pp : this.props.pp,
    completed: true
  }

  uploadProfileImg = async e => {
     let img = e.target.files[0];
     if (img.name.match(/\.(jpg|jpeg|png)$/)) {
      var formData = new FormData();
      formData.append("profileImg", img);
      formData.append("isProfilePic", true);
      await addPic(formData)
        .then(({ data }) => {
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

  componentDidUpdate () {
    if (!this.state.pp && this.props.pp) {
        if (!this.state.pp)
          this.setState({pp: this.props.pp});
    } else if (this.props.pp && this.state.pp){
        if (this.props.pp.filename !== this.state.pp.filename)
          this.setState({pp: this.props.pp});
    } else if (this.state.pp && !this.props.pp) {
        if (this.state.pp)
          this.setState({pp: undefined});
    }
  }

  componentDidMount () {
    axios
    .get('/api/users/completed')
    .then (res => {})
    .catch(err => {
      this.setState({completed: false});
    });
  }

  render() {
    return (
      <div>
        <div className="profile-sidebar">
          <div className="profile-userpic">
            <div className="row">
            {this.state.pp && 
              <img src={`http://localhost:1337/userPics/${this.state.pp.filename}`} style={avatarcss} className="img-responsive" alt="" />
            }
            {!this.state.pp && 
              <img src='data:image/png;base64,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' style={avatarcss} className="img-responsive" alt="" />
            }
            </div>
          </div>
          <div className="profile-usertitle">
            <div className="profile-usertitle-name">hey{this.props.username}</div>
          </div>
        </div>
        {this.state.err === true && <Alertmsgsuccess />}
        {this.state.err === false && <Alertmsgerror />}
        <br />
        {!this.state.completed && <div>
            <div className="alert alert-primary" role="alert" style={alertCss}>
                <span>Complete your profile:</span>
                <br />
                <br />
                <li>
                  <ul>At least one picture</ul>
                  <ul>At least one tag</ul>
                </li>
            </div>
        </div>}
      </div>
    );
  }
}
