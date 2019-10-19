import React, { Component } from 'react';
import axios from 'axios';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import SendIcon from '@material-ui/icons/Send';
import io from 'socket.io-client';

const iconstyle = {
    float: 'right',
    cursor: 'pointer',
    color: '#4590ff',
}

const scroll = {
    width: '100%',
    height: '518px',
    overflowY: 'scroll',
    padding: '2%',
    marginTop: '1%'

}

const styleinput = {
    width: '85%'
}

const mymsgStyle = {
    float: 'right'
}

const sendstyle = {
    color : 'blue',
    margin: '4%'
}

const convstyle= {
    backgroundColor: 'white',
    padding: '1%'
}

class Chats extends Component {
    state = {
        msg: [],
        usernames : [],
        to: "Choose a conversation",
        from: "",
        conversation : [],
        socket : ''
    }

    onChange = async e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    getusernames = (users) => {
        let usernames = [];
        let promise = new Promise(function (resolve, reject) {
            usernames = users.map(u => {
                return u.props.username;
            })
            resolve(usernames);
        })
        return promise;
    }

    switchconv = (user) => {
        console.log(user);
        this.setState({conversation : []})
        this.setState({to : user});
    }

    sendmsg = () => {
        let obj = {
            from : this.state.from,
            to : this.state.to,
            date: new Date(),
            msg: this.state.msg
        }
        console.log(obj)
        this.state.socket.emit('msg', obj);
        console.log(this.state.conversation);
    }

    mapOnChats = (chat) => {
        let promise = new Promise(function (resolve, reject){
            let res = chat.map(c => {
                return (c.props.user2);
            });
            resolve(res);
        });
        return (promise);
    }

    async componentDidMount () {
        axios
        .get('/api/chats/get/hamid')
        .then ( async (res) => {
            console.log(res);
            await this.mapOnChats(res.data.data).then(res => {
                this.setState({usernames : res});
            });

            this.setState({socket : io(':1337', {query: `owner=${this.state.from}`})})
        })
        .catch(err => {
            console.log(err);
        })
        
        this.state.socket.on('msg', (data) => {
            let allmsg = this.state.conversation;
            allmsg.push(data);
            this.setState({conversation : allmsg});
        });
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-3">
                        <div className="card" style={{margin : '20px'}}>
                            <ul className="list-group list-group-flush">
                                {this.state.usernames.map(u => <li key={u} className="list-group-item">{u} <NavigateNextIcon onClick={(e) => this.switchconv(u)} style={iconstyle} /></li>)}
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div>
                            <div style={convstyle}>
                                <div className="card" >
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item">{this.state.to}</li>
                                    </ul>
                                </div>
                                <div style={scroll}>
                                    {this.state.conversation.map(msg => 
                                        <div>
                                            {(msg.from === this.state.to
                                                && <Chip label={msg.msg} style={{marginTop: '3%'}} color="primary" variant="outlined" />)
                                                || <Chip  label={msg.msg}  color="primary" style={mymsgStyle}/>}
                                            <br />
                                            <br />
                                        </div>    
                                    )}
                                </div>
                                {this.state.to !== "Choose a conversation" && 
                                <div>
                                    <TextField
                                        style={styleinput}
                                        id="standard-dense"
                                        label="Message"
                                        margin="dense"
                                        name="msg"
                                        onChange={this.onChange}
                                    />
                                    <SendIcon style={sendstyle} size='large' onClick={this.sendmsg} color="primary"/>
                                </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
  } 
}

export default Chats;
