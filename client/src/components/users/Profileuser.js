import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import axios from 'axios';
import { getUserTags } from "../../helpers/getUserTags";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Location from "@material-ui/icons/LocationCity";
import BlockIcon from '@material-ui/icons/Block';
import ReportIcon from '@material-ui/icons/Report';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import SettingsIcon from '@material-ui/icons/Settings';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Redirect } from "react-router-dom";
import { writeColor, iconColor, likeColor, avatarColor } from "../../css/styleClasses";
import CakeIcon from '@material-ui/icons/Cake';

const avatarcss = {
    width: '140px',
    height: '140px',
    maxWidth: '140px',
    maxHeight: '140px',
}

class Profileuser extends Component {

  state = {
    user: this.props.match.params.username,
    data: {},
    tags: {},
    pp: {},
    pics: {},
    like: true,
    whoami: "",
    redirect: false
  }

  toEditProfile = () => {
      this.setState({redirect : true});
  }

  like = async () => {
    let user = {
        to: this.state.user
    };
    console.log("outside");
    await axios
    .post('/api/users/like', user)
    .then(res => {
        console.log("inside");
        let like = res.data.like;
        this.setState({like : like});
    })
    .catch();
  }

  async componentDidMount() {
	try {
        let res = await axios.get(`/api/users/get/${this.state.user}`)
                    .catch(er => {
                    this.setState({redirect: true});    
        });
        console.log(res.data.data);
        
		this.setState({data: res.data.data});
		res = await getUserTags(this.state.user);
		this.setState({tags: res.data.data});
		let pics = await axios.get(`/api/pics/get/${this.state.user}`);
		pics = pics.data.data;
		this.setState({pics : pics.filter(img =>  img.ispp === "false")});
		this.setState({pp : pics.filter(img => img.ispp === "true")});
		let user = { to: this.state.user };
		res = await axios.post('/api/users/stateOfLike', user)
		this.setState({like : res.data.like});
        this.setState({ visible: true });
        await axios.get('/api/users/whoami')
        .then(res => {
            this.setState({
                whoami : res.data.user
            })
        })
	} catch(err) {
		console.log(err.message);
    }
    if (this.state.user === this.state.whoami && (this.state.data.birthDate === "" || this.state.data.gender === "" ||
        this.state.data.userCountry === undefined || this.state.data.userCountry === undefined))
                this.setState({redirect: true});
    console.log(this.state.pics)
  }

  render() {
    return (
        <div className="container-fluid">
            {this.state.redirect && <Redirect to={`/profile/edit`} />}
            {
                this.state.visible &&
                    <div className="row profile">
                        <div className="col-md-1" />
                        <br />
                        <div className="col-md-10">
                            <div className="profile-content">
                                <div className="row">
                                    <div className="col-md-4">
                                        <center>
                                            <Avatar style={avatarcss} alt="Remy Sharp" src={ `/userPics/${this.state.pp[0].filename}` } />
                                            <br />
                                            <Chip
                                                label={`${this.state.user}`}
                                                variant="outlined"
                                                style={avatarColor}
                                            />
                                            <br/><br/>
                                            <span style={{fontWeight: "600"}}>{this.state.data.bio}</span>
                                            <br /><br />
                                            {this.state.user !== this.state.whoami &&
                                            <div className="row">
                                                <div className="col-md-4">
                                                {!this.state.like
                                                    && <FavoriteBorderIcon onClick={this.like} style={likeColor}/>}
                                                {this.state.like
                                                    && <FavoriteIcon onClick={this.like} style={likeColor}/>
                                                }
                                                </div>
                                                <div className="col-md-4">
                                                    <BlockIcon style={iconColor}/>
                                                </div>
                                                <div className="col-md-4">
                                                    <ReportIcon style={iconColor}/>
                                                </div>
                                                
                                            </div>}
                                            {this.state.user === this.state.whoami && 
                                                <div className="row">
                                                    <div className="col-md-4">
                                                    </div>
                                                    <div className="col-md-4">
                                                        <SettingsIcon onClick={this.toEditProfile} style={likeColor}/>
                                                    </div>
                                                    <div className="col-md-4">
                                                    </div>
                                                </div>
                                            }
                                        </center>
                                    </div>
                                    <div className="col-md-1" />
                                    <div className="col-md-7">
                                        <br />
                                        <center>
                                            <h2 style={writeColor}>
                                                {this.state.data.fName}&nbsp;{this.state.data.lName}
                                            </h2>
                                        </center>
                                        <List>
                                            <Divider variant="inset" component="li" />
                                            <ListItem>
                                            <ListItemAvatar>
                                                <Avatar>
                                                <CakeIcon />
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
                                                <Location />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary="Location"
                                                secondary={`${this.state.data.userCountry}, ${this.state.data.userRegion}`}
                                            />
                                            </ListItem>
                                            <Divider variant="inset" component="li" />
                                            <ListItem>
                                            <ListItemAvatar>
                                                <Avatar>
                                                <CakeIcon />
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
                                                <AssignmentIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary="Tags"
                                                secondary={this.state.tags.map((tag, index )=> {
                                                    return (
                                                        <span className="mr-1 mb-1"  key={tag.id}>#{tag.props.name} {(index !== 0 && index % 4 === 0 && <br />)}</span>
                                                    );
                                                })}
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
            }
            {
                this.state.visible &&
                    <div className="row profile">
                        <div className="col-md-1" />
                        <br />
                        <div className="col-md-10 profile-content" >
                            <center>
                                <Carousel width="500px">
                                    {this.state.pics.map((p,index) => 
                                        <div key={index}>
                                            <img src={`/userPics/${p.filename}`} alt=""/>
                                            <p className="legend">Legend 1</p>
                                        </div>
                                    )}
                                </Carousel>
                                </center>
                        </div>
                        <div className="col-md-1" />
                    </div>
            }
        </div>
    );
  } 
}

export default (Profileuser);
