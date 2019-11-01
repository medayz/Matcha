import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import NotificationsIcon from '@material-ui/icons/Notifications';

class Notifications extends Component {
    state = {
        anchor: null
    };

    handleClick = event => {
        console.log(event.currentTarget);
        this.setState({anchor: event.currentTarget});
    };

    handleClose = () => {
        this.setState({anchor: null});
    };

    profile = () => {
        console.log('PROOOOOFFIIIIIILEEE');
        this.handleClose();
    };

    render() {
        return (
                <div>
                    <Button aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleClick}>
                        <NotificationsIcon />
                    </Button>
                    <Menu
                        id="simple-menu"
                        anchorEl={this.state.anchor}
                        keepMounted
                        open={Boolean(this.state.anchor)}
                        onClose={this.handleClose}
                    >
                        { this.props.notifs.map(
                            (notif, index) => <MenuItem key={index} onClick={()=>{}}>{notif.text}</MenuItem>
                        )}
                    </Menu>
                </div>
            );
    }
}

export default  Notifications;