import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import DoneIcon from '@material-ui/icons/Done';
import axios from 'axios';
import { getUserTags } from "../../helpers/getUserTags";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Location from "@material-ui/icons/LocationCity";
//import Gender from "@material-ui/icons/SupervisedUserCircle";
import BlockIcon from '@material-ui/icons/Block';
import ReportIcon from '@material-ui/icons/Report';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

const avatarcss = {
    width: '140px',
    height: '140px',
    maxWidth: '140px',
    maxHeight: '140px',
}

const cssName = {
    fontStyle: 'initial',
    fontFamily: "-webkit-body",
    color: '#007bff'
}

class Profileuser extends Component {

  state = {
    user: this.props.match.params.username,
    data: {},
    tags: {},
    pp: {},
    pics: {},
    like: true,
  }

  like = async () => {
    let user = {
        to: this.state.user
    };
    await axios
    .post('/api/users/like', user)
    .then(res => {
        let like = res.data.like;
        this.setState({like : like});
    })
    .catch();
  }

  async componentDidMount() {
	try {
        let res = await axios.get(`/api/users/get/${this.state.user}`);
		this.setState({data: res.data.data});
		res = await getUserTags(this.state.user);
		this.setState({tags: res.data.data});
		let pics = await axios.get(`/api/pics/get/${this.state.user}`);
		pics = pics.data.data;
		this.setState({pics : pics.filter(img => !img.ispp)});
		this.setState({pp : pics.filter(img => img.ispp)});
		let user = { to: this.state.user };
		res = await axios.post('/api/users/stateOfLike', user)
		this.setState({like : res.data.like});
		this.setState({ visible: true });
	} catch(err) {
		console.log(err.message);
	}
  }

  render() {
    return (
        <div className="container-fluid">
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
                                                label={`${this.state.data.fName} ${this.state.data.lName}`}
                                                color="primary"
                                                deleteIcon={<DoneIcon />}
                                                variant="outlined"
                                                style={{marginTop : '2%', color : "#007bff", borderColor: "#007bff"}}
                                            />
                                            <br /><br />
                                            <div className="row">
                                                <div className="col-md-4">
                                                {!this.state.like
                                                    && <FavoriteBorderIcon onClick={this.like} style={{color : "#007bff", cursor : 'pointer'}}/>}
                                                {this.state.like
                                                    && <FavoriteIcon onClick={this.like} style={{color : "#007bff", cursor : 'pointer'}}/>
                                                }
                                                </div>
                                                <div className="col-md-4">
                                                    <BlockIcon style={{color : "#dc3545", cursor : 'pointer'}}/>
                                                </div>
                                                <div className="col-md-4">
                                                    <ReportIcon style={{color : "#dc3545", cursor : 'pointer'}}/>
                                                </div>
                                                
                                            </div>
                                        </center>
                                    </div>
                                    <div className="col-md-1" />
                                    <div className="col-md-7">
                                        <br />
                                        <center>
                                            <h2 style={cssName}>
                                                {this.state.data.fName}&nbsp;{this.state.data.lName}
                                            </h2>
                                        </center>
                                        <List>
                                            <Divider variant="inset" component="li" />
                                            <ListItem>
                                            <ListItemAvatar>
                                                <Avatar>
                                                <Location />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary="Location"
                                                secondary={`${this.state.data.city} `}
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
                                            <img src={`/userPics/${p.filename}`}/>
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
