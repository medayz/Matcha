import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { user_socket } from "../../actions/socket";

const cssList = {
    backgroundColor: 'white',
    color: 'pink',
    paddingRight: '5%'
}

const scroll = {
    width: '100%',
    height: '900px',
    overflowY: 'scroll',
}  

const timeStyle = {
    fontSize: '9px',
    fontFamily: 'initial'
}

const titleStyle = {
    fontSize: '-webkit-xxx-large',
    padding: '26px'
}

class Infos extends Component {
  
    state = {
        notifs: null,
        pics: null,
        show: false,
        redirect: false
    }

    UNSAFE_componentWillMount () {
        axios.get("/api/notifs/get").then(async res => {
            this.setState({notifs: res.data.data});
            this.setState({show : true});
        })
        .catch(err => {
            this.props.user_socket(false);
            this.setState({redirect : true});
        });
    }
  render() {
    return (
        <div className="conatiner">
            {this.state.redirect && <Redirect to='/login' />}
            <div className="row">
                <div className="col-md-2"></div>
                <div className="col-md-8">
                    <div style={titleStyle}>
                        History
                    </div>
                    <Divider variant="inset" component="li" style={{backgoundColor: 'pink'}}/>
                    <br />
                    <div style={scroll}>
                        {this.state.show &&
                            <List style={cssList}>
                                {this.state.notifs.map((notif,index) => 
                                    <div key={index}>
                                        <ListItem alignItems="flex-start">
                                            <ListItemAvatar>
                                            <Avatar alt="Remy Sharp">{notif.text.split(" ")[0].slice(0,2)}</Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                            primary={notif.text}
                                            secondary={
                                                <React.Fragment>
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        color="textPrimary"
                                                    >
                                                    </Typography>
                                                    <span style={timeStyle}>
                                                        {`${notif.date.month}-${notif.date.day}-${notif.date.year} ${notif.time.hour}:${notif.time.minute}`}
                                                    </span>
                                                </React.Fragment>
                                            }
                                            />
                                        </ListItem>
                                        <Divider variant="inset" component="li" />

                                    </div>
                                )}
                            </List>
                        }
                    </div>
                </div>
                <div className="col-md-2"></div>'
            </div>
        </div>
    );
  } 
}

const mapStateToProps = (state) => {
    return {
      userSocket: state.socket
    }
  }
  

export default  connect(mapStateToProps, {user_socket})(Infos);
