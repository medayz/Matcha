import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./../css/profile.css";
import { connect } from 'react-redux';
import axios from 'axios';
import Notifications from './Notifications'
import { user_state } from "../actions/connected";
import { user_socket } from "../actions/socket";
import {navBar} from "../css/styleClasses";
import io from 'socket.io-client';
import { Redirect } from "react-router-dom";

class Header extends Component {

  
  _unmout = true;

  state = {
    connected: false,
    whoami: "",
    show: false,
    toLogin: false,
    socket: {},
  };

  logout = () => {
    let statesocket = this.props.userSocket;
    axios
      .get('/api/users/logout')
      .then(res => {
        this.props.user_state(false);
        this.props.user_socket(null);
        statesocket.emit('ForceDisconnect', this.state.whoami);
        this.setState({whoami: ""});
        this.setState({toLogin: true});
      })
      .catch(err => {});
  }

  componentDidMount () {
     axios
      .get("/api/users/isLoggedOn")
      .then(async res => {
        let socket = this.props.userSocket;
        if (!socket) {
          socket = io(':1337');
          this._unmout && this.props.user_socket(socket);
        }
        this._unmout && this.props.user_state(true);
        this._unmout && this.setState({show : true});
      })
      .catch(err => {
        const path = window.location.pathname.split("/");
        if (path[1] !== "resetpwd" && path[1] !== "confirmAcc")
        {
          this._unmout && this.props.user_state(false);
          this._unmout && this.setState({toLogin: true});
        }
        else
        {
          this._unmout && this.props.user_state(false);
          if (this.props.userSocket !== {})
            this._unmout && this.props.user_socket(null);
        }
        this._unmout && this.setState({show : true});
      });
      
  }

  async componentDidUpdate () {
    let stateuser = this.props.userState;
    if (stateuser !== this.state.connected)
    {
      axios.get('/api/users/whoami')
        .then(res => {
          this._unmout && this.setState({
              whoami : res.data.user
          });
          
        })
        .catch(err => {
        });
        this._unmout && this.setState({connected : stateuser});
    }
  }

  //abortController = new AbortController();

  componentWillUnmount () {
		this._unmout = false;
	}


  render() {
    return (
      
      <nav style={navBar} className="navbar navbar-expand-sm navbar-dark">
      {this.state.toLogin && <Redirect to='/login'/>} 
      {this.state.show &&
        <div className="container">
          
          {this.props.userState && 
          <Link to="/" className="navbar-brand">
            Matcha
          </Link>}
          {!this.props.userState && 
          <Link to="/login" className="navbar-brand">
            Matcha
          </Link>}
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div  className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ml-auto">
              {!this.state.connected && (
                <li className="nav-item">
                  <Link to="/login" className="nav-link">
                    Login
                  </Link>
                </li>
              )}
              {!this.state.connected && (
                <li className="nav-item">
                  <Link to="/register" className="nav-link">
                    Register
                  </Link>
                </li>
              )}
              {this.state.connected && <Notifications />}
              {this.state.connected && (
                <li className="nav-item">
                  <Link to={`/profile/${this.state.whoami}`} className="nav-link">
                    profile
                  </Link>
                </li>
              )}
              {this.state.connected && (
                <li className="nav-item">
                  <Link to={'/search'} className="nav-link">
                    search
                  </Link>
                </li>
              )}
              {this.state.connected && (
                <li className="nav-item">
                  <Link to={'/chats'} className="nav-link">
                    Chat
                  </Link>
                </li>
              )}
              {this.state.connected && (
                <li className="nav-item">
                  <Link to={'/who'} className="nav-link">
                    Who?
                  </Link>
                </li>
              )}
              {this.state.connected && (
                <li className="nav-item">
                  <Link to={'/infos'} className="nav-link">
                    History
                  </Link>
                </li>
              )}
              {this.state.connected && (
                <li className="nav-item">
                  <Link to={`/profile/edit/`} className="nav-link">
                    Edit
                  </Link>
                </li>
              )}
              {/*this.state.connected && (
                <li className="nav-item">
                  <Link to={`/matches`} className="nav-link">
                    Matches
                  </Link>
                </li>
              )*/}
              {this.state.connected && (
                <li className="nav-item" onClick={this.logout}>
                  <Link to={`/login`} className="nav-link">
                    Logout
                  </Link> 
                </li>
              )}
            </ul>
          </div>
        </div>}
      </nav>
    );
  }
}



const mapStateToProps = (state) => {
  return {
    userState: state.connected,
    userSocket: state.socket
  }
}

export default connect(mapStateToProps, {user_state, user_socket})(Header);
