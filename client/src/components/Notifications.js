import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Badge from '@material-ui/core/Badge';
import axios from 'axios'; 
import { user_socket } from "../actions/socket";
import { connect } from 'react-redux';

const style_unread = {
    backgroundColor : 'pink',
    marginBottom: '1px',
}

class Notifications extends Component {
    state = {
        anchor: null,
        notifs: [],
        number: 0
    };

    countUnReadNotifs = (notifs) => {
        let number = 0;
        let promise = new Promise((resolve, reject) => {
            notifs.forEach(notif => {
                if (notif.read === 0)
                    number++;
            });
            resolve(number);
        })
        return (promise);
    }

    handleClick = event => {
        //console.log(event.currentTarget);
        this.setState({anchor: event.currentTarget});
    };

    handleClose = () => {
        this.setState({anchor: null});
        axios.post("/api/notifs/read").then(async res => {
            this.setState({number: 0});
            this.setState({notifs:
                this.state.notifs.map(notif => {
                    notif.read = 1;
                    return notif;
                })
            });
        }).catch(err => {});
    };

    profile = () => {
        console.log('PROOOOOFFIIIIIILEEE');
        this.handleClose();
    };

    async UNSAFE_componentWillMount () {
        const socket = this.props.userSocket;
        console.log('notif socket:', this.props.userSocket);
        const notifs = await axios.get("/api/notifs/get");
        this.setState({ notifs: notifs.data.data });
        const nb_unread_notifs = await this.countUnReadNotifs(this.state.notifs);
        this.setState({number : nb_unread_notifs});
        console.log(socket)
        socket.on('notification', async res => {
            const newNotif = this.state.notifs.slice();
            newNotif.unshift(res);
            this.setState({notifs: newNotif});
            const nb_unread_notifs = await this.countUnReadNotifs(this.state.notifs);
            this.setState({number : nb_unread_notifs});
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
// export default Notifications;