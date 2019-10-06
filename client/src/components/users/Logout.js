import React, { Component } from 'react';
import { Redirect } from 'react-router';
import axios from 'axios';
import { user_state } from "../../actions/connected";
import { connect } from "react-redux";

class Logout extends Component {

  componentDidMount() {
    axios
      .get('/api/users/logout')
      .then(res => this.props.user_state(false));
  }

  render() {
    return (
        1 && <Redirect to='/login'/>
    );
  } 
}

export default connect(null, {user_state})(Logout);
