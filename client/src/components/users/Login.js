import React, { Component } from 'react';

class Login extends Component {
  
  render() {
    return (
    <div className="container">
        <form id="Login">
            <div class="form-group">
                <input type="email" class="form-control" id="inputEmail" placeholder="Email Address" />
            </div>
            <div class="form-group">
                <input type="password" class="form-control" id="inputPassword" placeholder="Password" />
            </div>
            <button type="submit" class="btn btn-danger">Login</button>
        </form>
    </div>
    );
  } 
}

export default Login;
