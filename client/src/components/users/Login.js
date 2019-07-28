import React, { Component } from 'react';

class Login extends Component {
  
  render() {
    return (
    <div className="container">
        <form id="Login">
            <div className="form-group">
                <input type="email" className="form-control" id="inputEmail" placeholder="Email Address" />
            </div>
            <div className="form-group">
                <input type="password" className="form-control" id="inputPassword" placeholder="Password" />
            </div>
            <button type="submit" className="btn btn-danger">Login</button>
        </form>
    </div>
    );
  } 
}

export default Login;
