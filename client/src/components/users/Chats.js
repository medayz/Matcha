import React, { Component } from 'react';
import axios from 'axios';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import SendIcon from '@material-ui/icons/Send';
import io from 'socket.io-client';
import { Redirect } from "react-router-dom";

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

const styleDate = {
    float: 'right',
    fontSize: 'x-small',
    marginTop: '1%',
    marginLeft: '1%'
}

class Chats extends Component {
    state = {
        msg: [],
        usernames : [],
        to: "Choose a conversation",
        from: "",
        conversation : [],
        socket : '',
        redirect: false
    }

    onChange = async e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    mapOnChats = (chat) => {
        let promise = new Promise((resolve, reject) => {
            let res = chat.map(c => {
                return c.name
            });
            resolve(res);
        });
        return (promise);
    }

    mapOnMsgs = (msg) => {
        let msgJson;
        let promise = new Promise((resolve, reject) => {
            msgJson = msg.map((m) => {
                let obj = {
                    sender: m.props.sender,
                    receiver: m.props.receiver,
                    body: m.props.body,
                    date: m.props.date,
                    time: m.props.time
                }
                return (obj);
            });
            resolve(msgJson);  
        });
        return promise;
    }

    switchconv = async (user) => {
        this.setState({conversation : []})
        this.setState({to : user});
        await axios.get(`/api/chats/getConversation/${this.state.from}/${user}`)
        .then(res => {
            this.mapOnMsgs(res.data.data).then(res => {
                let conv = res;
                conv = conv.reverse();
                this.setState({conversation : conv});
                
            });
            
        })
        .catch(err => {
            console.log(err);
        })
    }

    sendmsg = async () => {
        let obj = {
            from : this.state.from,
            to : this.state.to,
            date: new Date(),
            msg: this.state.msg
        }
        if (obj.msg.length > 0)
        {
            obj.msg = obj.msg.trim();
            if (obj.msg)
            {
                this.state.socket.emit('msg', obj);
                await axios.get(`/api/chats/getConversation/${this.state.from}/${this.state.to}`)
                .then(res => {
                    this.mapOnMsgs(res.data.data).then(res => {
                        let conv = res;
                        conv = conv.reverse();
                        this.setState({conversation : conv});
                    });
                    this.setState({ msg: "" });
                })
                .catch(err => {
                    console.log(err);
                })
                this.setState({msg : ""});

            }
        }
        
    }

    async componentDidMount () {
        await axios.get('/api/users/whoami')
        .then(res => {
            this.setState({
                from : res.data.user
            })
        })
        .catch(err => {
            this.setState({redirect : true});
        })
        await axios
        .get(`/api/chats/get/${this.state.from}`)
        .then ( async (res) => {
            await this.mapOnChats(res.data.data).then(res => {
                this.setState({usernames : res});
            });
            this.setState({socket : io(':1337', {query: `owner=${this.state.from}`})});
            this.state.socket.on('msg', (data) => {
                let allmsg = this.state.conversation;
                allmsg.push(data);
                if ((allmsg[0].sender === this.state.to) || (allmsg[0].receiver === this.state.to))
                    this.setState({conversation : allmsg});
                else
                    this.setState({conversation : []});
            });
        })
        .catch(err => {
            this.setState({redirect : true});
        })
        //<span style={styleDate}>{msg.time.hour.low}:{msg.time.minute.low}</span>
    }

    render() {
        return (
            <div className="container-fluid">
                {this.state.redirect && <Redirect to={`/login`} />}
                {!this.state.redirect &&
                <div className="row">
                    <div className="col-md-4">
                        <div className="card" style={{margin : '20px'}}>
                            <ul className="list-group list-group-flush">
                                {this.state.usernames.map(u => 
                                <li key={u} className="list-group-item"> 
                                
                                    <div className="row">
                                        <div className="col-md-10">
                                            <span style={{float : "left"}}>{u}</span> 
                                        </div>
                                        <div className="col-md-2">
                                            <NavigateNextIcon onClick={(e) => this.switchconv(u)} style={iconstyle} />
                                        </div>
                                    </div>
                                
                                </li>)}
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-7">
                        <div>
                            <div style={convstyle}>
                                <div className="card" >
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item">{this.state.to}</li>
                                    </ul>
                                </div>
                                <div style={scroll}>
                                    {this.state.conversation.map((msg, index) => 
                                        <div key={index}>
                                            {(msg.receiver === this.state.from
                                                && <div><Chip label={msg.body} style={{marginTop: '3%'}} color="primary" variant="outlined" /> </div>)
                                                || <div><Chip  label={msg.body}  color="primary" style={mymsgStyle}/></div>}
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
                                        value={this.state.msg}
                                        onChange={this.onChange}
                                    />
                                    <SendIcon style={sendstyle} size='large' onClick={this.sendmsg} color="primary"/>
                                </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>}
            </div>
        );
  } 
}

export default Chats;
