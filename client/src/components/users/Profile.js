import React, { Component } from "react";
import Avatar from "@material-ui/core/Avatar";
import Fjla from "../../backIndex.jpg";
import defaultProfilePic from "../../images/default/boss.png";
import Account from "@material-ui/icons/AccountCircle";
import Location from "@material-ui/icons/LocationCity";
import Gender from "@material-ui/icons/SupervisedUserCircle";
import Help from "@material-ui/icons/Help";
import axios from "axios";
import Thumb from "@material-ui/icons/ThumbsUpDown";
import Info from "@material-ui/icons/Info";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
// import jwt from "jsonwebtoken";
// import { getter } from "../../helpers/tokenOperation";

const sizeImg = {
  margin: 10,
  width: 200,
  height: 200
};
const paddingImg = {};

class Profile extends Component {
  state = {
    user: {}
  };

  async componentWillMount() {
    // const user = jwt.decode(getter('token')).username;
    const user = "hamid";
    await axios.get(`http://localhost:1337/api/users/get/${user}`).then(res => {
      if (res.data.data.props) {
        const user = res.data.data.props;
        this.setState({ user: user });
        this.setState({ visible: true });
      }
    });
  }
  render() {
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col-md-2" />
            <div className="col-md-3">
              <center>
                <Avatar
                  alt="Remy Sharp"
                  src={defaultProfilePic}
                  style={sizeImg}
                />
              </center>
            </div>
            <div className="col-md-2" />
            <div className="col-md-5">
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <Account />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={this.state.user.username}
                    secondary={`${this.state.user.fName} ${
                      this.state.user.lName
                    }`}
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <Location />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Location"
                    secondary={this.state.user.location}
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <Gender />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Gender"
                    secondary={this.state.user.gender}
                  />
                </ListItem>
              </List>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-3" />
          <div className="col-md-7">
            <List>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <Thumb />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Fame rating"
                  secondary={this.state.user.fameRating}
                />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <Help />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Biography"
                  secondary={this.state.user.bio}
                />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <Info />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="tags" secondary={this.state.user.tags} />
              </ListItem>
            </List>
          </div>
          <div className="col-md-2" />
        </div>
        <div className="row">
          <div className="col-md-4" />
          <div className="col-md-5">
            <center>
              <div className="alert alert-primary" role="alert">
                Snap
              </div>
            </center>
          </div>
          <div className="col-md-3" />
        </div>
        <div className="row">
          <div className="col-md-3" />
          <div className="col-md-7">
            <div
              id="carouselExampleControls"
              className="carousel slide"
              data-ride="carousel"
              style={paddingImg}
            >
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <img src={Fjla} className="d-block w-100" alt="..." />
                </div>
                <div className="carousel-item">
                  <img src={Fjla} className="d-block w-100" alt="..." />
                </div>
                <div className="carousel-item">
                  <img src={Fjla} className="d-block w-100" alt="..." />
                </div>
              </div>
              <a
                className="carousel-control-prev"
                href="#carouselExampleControls"
                role="button"
                data-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                />
                <span className="sr-only">Previous</span>
              </a>
              <a
                className="carousel-control-next"
                href="#carouselExampleControls"
                role="button"
                data-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                />
                <span className="sr-only">Next</span>
              </a>
            </div>
          </div>
          <div className="col-md-2" />
        </div>
      </div>
    );
  }
}

export default Profile;
