import React, { Component } from 'react';
import { Redirect } from 'react-router';
import axios from 'axios';

class Logout extends Component {

  componentDidMount() {
    axios.get('/api/users/logout');
  }

  render() {
    return (
        1 && <Redirect to='/login'/>
    );
  } 
}

export default Logout;
