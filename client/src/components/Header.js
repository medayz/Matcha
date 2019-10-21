import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./../css/profile.css";
import { connect } from 'react-redux';
import axios from 'axios';
import { user_state } from "../actions/connected";

class Header extends Component {

  state = {
    connected: false,
    whoami: ""
  };

  async componentDidMount () {
      await axios
        .get("/api/users/isLoggedOn")
        .then(res => {
            this.props.user_state(true);
            })
        .catch(err => {
          this.props.user_state(false);
          })
      await axios.get('/api/users/whoami')
        .then(res => {
          this.setState({
              whoami : res.data.user
          })
        })
        .catch(er => {
          
        })
  }

  componentDidUpdate () {
    let stateuser = this.props.userState;
    if (stateuser !== this.state.connected)
      this.setState({connected : stateuser});
  }

  render() {
    return (
      <nav className="navbar navbar-expand-sm navbar-dark bg-primary mb-3 py-0">
        <div className="container">
          <Link to="/" className="navbar-brand">
            Matcha
          </Link>
          <div>
            <ul className="navbar-nav mr-auto">
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
                <li className="nav-item">
                  <Link to="/logout" className="nav-link">
                    Logout
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
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
