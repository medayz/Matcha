import React, { Component } from 'react';
import RegisterInput from './RegisterInput';
class Login extends Component {
    state = {
        username: '',
        pass: '',
        errState: {},
        login: ''
    };
    onChange = e => {
        this.setState({[e.target.name]: e.target.value});
    };
  render() {
    return (
    <div className="container">
        <form id="Login">
            <RegisterInput 
              label="Username"
              type="text"
              name="username"
              id="username"
              placeholder="Enter username"
              err={this.state.errState.username}
              value={this.state.username}
              onChange={this.onChange}
            />
            <RegisterInput 
              label="Password"
              type="password"
              name="pass"
              id="pass"
              placeholder="Enter password"
              err={this.state.errState.pass}
              value={this.state.pass}
              onChange={this.onChange}
          />
          <button type="submit" className="btn btn-danger">Login</button>
        </form>
    </div>
    );
  } 
}

export default Login;
