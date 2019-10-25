import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./../css/profile.css";
import { connect } from 'react-redux';
import axios from 'axios';
import Notifications from './Notifications'
import { user_state } from "../actions/connected";
import { Redirect } from "react-router-dom";
import {navBar} from "../css/styleClasses";

class Header extends Component {

  state = {
    connected: false,
    whoami: "",
    show: false,
    toLogin: false,
  };

  logout = () => {
    axios
      .get('/api/users/logout')
      .then(res => this.props.user_state(false));
    this.setState({whoami: ""});
    this.setState({toLogin: true}); 
  }
  
  async componentDidMount () {
      await axios
        .get("/api/users/isLoggedOn")
        .then(res => {
            this.props.user_state(true);
            })
        .catch(err => {
          this.props.user_state(false);
          this.setState({toLogin : true})
          })
      console.log(this.state.whoami);
      this.setState({show : true});
  }

  async componentDidUpdate () {

    let stateuser = this.props.userState;
    if (stateuser !== this.state.connected)
    {
      axios.get('/api/users/whoami')
        .then(res => {
          this.setState({
              whoami : res.data.user
          });
        })
        .catch(err => {
          console.log(err.message);
        });
      this.setState({connected : stateuser});
    }
  }

  render() {
    return (
      
      <nav style={navBar} className="navbar navbar-expand-sm navbar-dark mb-3 py-0">
      {this.state.toLogin && <Redirect to={`/login`} />}
      {this.state.show &&
        <div className="container">
          <Link to="/" className="navbar-brand">
            Matcha
          </Link>
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
                  <Link to={'/chats'} className="nav-link">
                    Chat
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
    userState: state.connected
  }
}

export default connect(mapStateToProps, {user_state})(Header);
