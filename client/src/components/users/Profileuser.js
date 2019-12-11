import React, { Component } from "react";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import axios from "axios";
import { getUserTags } from "../../helpers/getUserTags";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Location from "@material-ui/icons/LocationCity";
import BlockIcon from "@material-ui/icons/Block";
import ReportIcon from "@material-ui/icons/Report";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import SettingsIcon from "@material-ui/icons/Settings";
import AssignmentIcon from "@material-ui/icons/Assignment";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Redirect } from "react-router-dom";
import {
  writeColor,
  iconColor,
  likeColor,
  avatarColor
} from "../../css/styleClasses";
import CakeIcon from "@material-ui/icons/Cake";
import WcIcon from "@material-ui/icons/Wc";
import SearchIcon from "@material-ui/icons/Search";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import { connect } from "react-redux";
import { user_socket } from "../../actions/socket";
import { user_state } from "../../actions/connected";
import io from 'socket.io-client';

const timeStyle = {
  fontSize: '9px',
  fontFamily: 'initial',
  color: '#757575'
}

const ForbiddenCss = {
  textAlign: 'center',
  fontSize: '50px',
  marginTop: '10%'
}

const avatarcss = {
  width: "140px",
  height: "140px",
  maxWidth: "140px",
  maxHeight: "140px"
};

const offline = {
  color: "red",
  height: "20px"
};

const pinkColor = {
  color: "pink"
};

const online = {
  color: "green",
  height: "20px"
};

class Profileuser extends Component {

  _unmout = true;

  state = {
    user: this.props.match.params.username,
    data: {},
    tags: {},
    pp: {},
    pics: {},
    like: true,
    whoami: "",
    redirect: false,
    online: false,
    socket: null,
    connected: undefined,
    toHome: false,
    completed: true,
    Forbidden: false
  };

  toEditProfile = () => {
    this.setState({ redirect: true });
  };

  blockUser = async () => {
    axios
      .post("/api/users/add/block", {

        blocked: this.state.user
      })
      .then(res => this.setState({toHome: true}))
      .catch((err) => console.log('ash hadshi al akh!'));
  };

  reportUser = async () => {
    axios
      .post("/api/users/add/report", {
        reported: this.state.user
      })
      .catch((err) => console.log('ash hadshi al akh!'));
  };

  like = async () => {
    let user = {
      to: this.state.user
    };
    axios
      .post("/api/users/like", user)
      .then(res => {
        let like = res.data.like;
        this.setState({ like: like });
      })
      .catch();
  };

  traitement = () => {
    this._unmout && axios.get('/api/users/whoami')
    .then (async res => {
      this._unmout && this.setState({Forbidden: false});
      this._unmout &&  this.setState({ whoami: res.data.user });
      this._unmout && this.setState({connected : true});
        let socket = this.props.userSocket;
        if (!socket) {
          socket = io(':1337');
          this._unmout && this.props.user_socket(socket);
        }

        try {
          let res = this._unmout && await axios.get(`/api/users/get/${this.state.user}`);
          this._unmout && this.setState({ data: res.data.data });
          res = this._unmout && await getUserTags(this.state.user);
          this._unmout && this.setState({ tags: res.data.data });
          let pics = this._unmout && await axios.get(`/api/pics/get/${this.state.user}`);
          pics = pics.data.data;
          this._unmout && this.setState({ pics: pics });
          this._unmout && this.setState({ pp: pics.filter(img => img.ispp === "true") });
          let user = { to: this.state.user };
          res = this._unmout && await axios.post("/api/users/stateOfLike", user);
          this._unmout && this.setState({ like: res.data.like });
          this._unmout && this.setState({ visible: true });
          if (this.state.user === this.state.whoami)
            this._unmout && this.setState({ online: true });
          else {
            this._unmout && this.setState({ socket: socket });
            this.state.socket.on("isOnline", data => {
              if (data === true) this._unmout && this.setState({ online: true });
              else this._unmout && this.setState({ online: false });
            });
            this._unmout && this.state.socket.emit("isOnline", this.state.user);
            this._unmout && axios.post("/api/users/add/view", { viewed: this.state.user });
          }

        } catch (err) {
          this._unmout &&  this.setState({ Forbidden: true });
        }
    })
    .catch (err => {
    })
  }

  componentDidMount() {
    axios
    .get('/api/users/completed')
    .then (res => {
      this.traitement();
    })
    .catch(err => {
      this._unmout && this.setState({completed: false});
    });
    

  }

  componentDidUpdate () {
    this.unlisten = this.props.history.listen((location, action) => {
      let username = location.pathname.split("/");
      if (this.state.user !== username[2])
      {
        this._unmout && this.setState({user: username[2]});
        this._unmout && this.traitement();
      }
    });
  }

  componentWillUnmount () {
		this._unmout = false;
	}

  render() {
    
    return (
      <div className="container-fluid">
        <div>
        {!this.state.completed && <Redirect to='/profile/edit'/>}
        {this.state.toHome && <Redirect to='/'/>}
        {this.state.redirect && <Redirect to={`/profile/edit`} />}
        {this.state.Forbidden && <div style={ForbiddenCss}>
            Forbidden 403          
        </div>}
        {this.state.visible && (
          <div className="row profile">
            <div className="col-md-1" />
            <br />
            <div className="col-md-10">

              <div className="profile-content">
                <div className="row">
                  <div className="col-md-4" style={{wordWrap: 'break-word'}}>
                    <center>
                      {this.state.pp.length > 0 && 
                        <Avatar
                          style={avatarcss}
                          alt="Remy Sharp"
                          src={`http://localhost:1337/userPics/${this.state.pp[0].filename}`}
                        />
                      }
                      {this.state.pp.length === 0 && 
                        <Avatar
                          style={avatarcss}
                          alt="Remy Sharp"
                          src='data:image/png;base64,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'
                        />
                      }
                      <br />
                      <Chip
                        label={`${this.state.user}`}
                        variant="outlined"
                        style={avatarColor}
                      />
                      <br />
                      <br />
                      <div style={{ fontWeight: "600"}}>
                        {this.state.data.bio}
                      </div>
                      <br />
                      <br />
                      {this.state.data.dateLastCnx && !this.state.online && (
                            <span style={timeStyle}>
                              <span style={{fontSize: '14px',color: 'pink'}}>Last time connexion</span> {` ${this.state.data.dateLastCnx.month}-${this.state.data.dateLastCnx.day}-${this.state.data.dateLastCnx.year} ${this.state.data.timeLastCnx.hour}:${this.state.data.timeLastCnx.minute}`}
                              <br />
                            </span>
                      )}
                      <br/>
                      {this.state.user !== this.state.whoami && (
                        <div className="row">
                          <div className="col-md-4">
                            {!this.state.like && (
                              <FavoriteBorderIcon
                                onClick={this.like}
                                style={likeColor}
                              />
                            )}
                            {this.state.like && (
                              <FavoriteIcon
                                onClick={this.like}
                                style={likeColor}
                              />
                            )}
                          </div>
                          <div className="col-md-4">
                            <BlockIcon style={iconColor} onClick={this.blockUser} />
                          </div>
                          <div className="col-md-4">
                            <ReportIcon style={iconColor} onClick={this.reportUser} />
                          </div>
                        </div>
                      )}
                      <br />
                      {this.state.data.match.length > 0 && (
                            <span style={timeStyle}>
                              <span style={{fontSize: '14px',color: 'pink'}}>{this.state.data.match}</span>
                              <br />
                            </span>
                      )}
                      <br />
                      {this.state.user === this.state.whoami && (
                        <div className="row">
                          <div className="col-md-4"></div>
                          <div className="col-md-4">
                            <SettingsIcon
                              onClick={this.toEditProfile}
                              style={likeColor}
                            />
                          </div>
                          <div className="col-md-4"></div>
                        </div>
                      )}
                    </center>
                  </div>
                  <div className="col-md-1" />
                  <div className="col-md-7">
                    <br />
                    <center>
                      <h2 style={writeColor}>
                        {this.state.online && (
                          <RadioButtonCheckedIcon style={online} />
                        )}
                        {!this.state.online && (
                          <RadioButtonUncheckedIcon style={offline} />
                        )}
                        {this.state.data.fName}&nbsp;{this.state.data.lName}
                        
                      </h2>
                    </center>
                    <List>
                      <Divider variant="inset" component="li" />
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>
                            <WcIcon style={pinkColor} />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Gender"
                          secondary={`${this.state.data.gender} `}
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>
                            <Location style={pinkColor} />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Location"
                          secondary={this.state.data.place}
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>
                            <CakeIcon style={pinkColor} />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Birth Date"
                          secondary={`${this.state.data.birthDate} `}
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>
                            <SearchIcon style={pinkColor} />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Looking for"
                          secondary={`${this.state.data.sexualPref} `}
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>
                            <AssignmentIcon style={pinkColor} />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Tags"
                          secondary={this.state.tags.map((tag, index) => {
                            return (
                              <span className="mr-1 mb-1" key={tag.id}>
                                {tag.props.name}{" "}
                                {index !== 0 && index % 4 === 0 && <br />}
                              </span>
                            );
                          })}
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>
                            <AssignmentIcon style={pinkColor} />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="Fame Rating"
                          secondary={this.state.data.fameRating}
                        />
                      </ListItem>
                    </List>
                  </div>
                  <br />
                </div>
              </div>
            </div>
            <div className="col-md-1" />
          </div>
        )}
        {this.state.visible && (
          <div className="row profile">
            <div className="col-md-1" />
            <br />
            <div className="col-md-10 profile-content">
              <center>
                {this.state.pics.length > 0 && <Carousel width="50%">
                  {this.state.pics.map((p, index) => (
                    <div key={index}>
                      <img src={`http://localhost:1337/userPics/${p.filename}`} alt="" />
                      <p className="legend">Legend 1</p>
                    </div>
                  ))}
                </Carousel>}
              </center>
            </div>
            <div className="col-md-1" />
          </div>
        )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userSocket: state.socket
  };
};

export default connect(
  mapStateToProps,
  { user_socket,user_state }
)(Profileuser);
