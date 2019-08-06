import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { deletter } from '../../helpers/tokenOperation';

class Logout extends Component {

    componentDidMount(){
        console.log(deletter('token'));
    }
  render() {
    return (
        !deletter() && <Redirect to='/login'/>
    );
  } 
}

export default Logout;
