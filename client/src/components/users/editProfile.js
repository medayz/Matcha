import React, { Component } from "react";
import addLogo from "../../images/default/plus.png";
import axios from "axios";
import EditInfos from "./editProfileCom/EditInfos";
import ProfilePic from "./editProfileCom/ProfilePic";
import EditUsername from "./editProfileCom/EditUsername";
import EditPassword from "./editProfileCom/EditPassword";
import EditEmail from "./editProfileCom/EditEmail";
import "./edit.css";
import { Redirect } from "react-router";
import AddIcon from '@material-ui/icons/Add';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

const logoAdd = {
  width: "25%",
  height: "25%",
  paddingLeft: "2%"
};

const deletestyle= {
  fontSize: '30px',
  position: 'absolute',
  color: 'red',
  cursor: 'pointer'
}

const addstyle= {
  fontSize: '50px',
  marginTop: '8%',
  float: 'left'
}

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
    tokenErr: false,
    errState: {},
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

  deleteimg = () => {
    console.log("bahlaoui will be deleted");
  }

  async componentWillMount() {
    // const user = "hamid";

    await axios.get(`/api/users/get`)
      .then(res => {
        if (res.data.data) {
          const user = res.data.data;
          if (user.username) this.setState({ username: user.username });
          if (user.email) this.setState({ email: user.email });
          this.setState({ visible: true });
        }
      })
      .catch(err => {
        this.setState({tokenErr : true});
      });
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <div className="container-fluid">
        {this.state.tokenErr && <Redirect to="/login" />}
        <div className="row profile">
          <div className="col-md-3">
           {this.state.visible &&  <ProfilePic />}
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
            {this.state.visible && <EditPassword /> }
            {this.state.visible &&  <div className="row profile">
          <div className="col-md-3" />
          <br />
          <div className="col-md-9">
            <div className="profile-content">
              <form>
                <div className="row jjj">
                  <div className="card jj">
                    <img src="https://cdn.intra.42.fr/users/large_ybahlaou.jpg" className="card-img-top" alt="..." />
                    <DeleteOutlineIcon style={deletestyle} onClick={this.deleteimg}/>
                  </div>
                  <AddIcon style={addstyle} color="primary" size="large"/>
                </div>
                <br />
                <input
                  type="file"
                  ref={this.fileUpload}
                  id="snapInput"
                  hidden
                />
                
              </form>
            </div>
          </div>
        </div>}
      </div>
    );
  }
}

export default EditProfile;
