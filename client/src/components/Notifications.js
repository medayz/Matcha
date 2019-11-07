import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Badge from '@material-ui/core/Badge';
import axios from 'axios'; 
import { user_state } from "../actions/connected";
import { user_socket } from "../actions/socket";
import { connect } from 'react-redux';

const style_unread = {
    backgroundColor : 'pink',
    marginBottom: '1px',
}

class Notifications extends Component {
    state = {
        anchor: null,
        notifs: this.props.notifs,
        number: this.props.unread
    };

    handleClick = event => {
        //console.log(event.currentTarget);
        this.setState({anchor: event.currentTarget});
        axios.post("/api/notifs/read").then(async res => {
            let notifs = this.state.notifs
            this.setState({number: 0});
            setTimeout(() => {
                notifs.forEach(notif => {
                    notif.read = 1;
                });
                this.setState({notifs: notifs});
            }, 2000);
        }).catch(err => {});
    };

    handleClose = () => {
        this.setState({anchor: null});
    };

    profile = () => {
        console.log('PROOOOOFFIIIIIILEEE');
        this.handleClose();
    };

    componentDidMount () {
        let socket = this.props.userSocket;
        socket.on('notification', res => {
            const newNotif = this.state.notifs.slice();
            newNotif.unshift(res);
            this.setState({notifs: newNotif});
            let unread = this.state.number + 1;
            this.setState({number : unread});
        });
    }

    render() {
        return (
                <div>
                    <Button aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleClick}>
                        <Badge badgeContent={this.state.number} color="secondary">
                            <NotificationsIcon />
                        </Badge>
                    </Button>
                    <Menu
                        id="simple-menu"
                        anchorEl={this.state.anchor}
                        keepMounted
                        open={Boolean(this.state.anchor)}
                        onClose={this.handleClose}
                    >
                        { this.state.notifs.map(
                            (notif, index) => 
                            <div key={index}>
                                {notif.read === 0 && <MenuItem style={style_unread}  onClick={()=>{}}>{notif.text}</MenuItem>}
                                {notif.read === 1 && <MenuItem  onClick={()=>{}}>{notif.text}</MenuItem>}
                            </div> 
                        )}
                    </Menu>
                </div>
            );
    }
}


const mapStateToProps = (state) => {
    return {
      userSocket: state.socket
    }
  }
  

export default  connect(mapStateToProps, {user_socket})(Notifications);