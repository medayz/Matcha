import React, { Component } from 'react';
import RegisterInput from './RegisterInput';
import axios from 'axios';

class Login extends Component {
    state = {
        username: '',
        pass: '',
        errState: {}
    };
    onChange = e => {
        this.setState({[e.target.name]: e.target.value});
    };
    clear = () => {
      document.getElementById('username').value = "";
      document.getElementById('pass').value = "";
    }
    onSubmit = async e => {
        e.preventDefault();
        const err = {
          username: '',
          pass: '',
          active: ''
        };
        this.setState({errState: err});
        if (this.state.username.length === 0)
          err.username = 'Username is required';
        if (this.state.pass.length === 0)
          err.pass = 'password is required';
        if (err.username === '' && err.pass === '')
        {
          const user = this.state;
          await axios
            .post(`http://localhost:1337/api/users/auth`, user)
            .then(res => {
              const err_back = res.data.err;
              if (err_back.username === '' && err_back.pass === '' && err_back.active === '')
              {
                this.setState({ login: 'done'})
                this.setState(
                  {
                    username: '',
                    pass: '',
                    errState: {}
                  }
                );
                this.clear();
              }
              else
              {
                if (err_back.username !== '')
                  err.email = err_back.username;
                if (err_back.pass !== '')
                  err.username = err_back.pass;
                if (err_back.active !== '')
                  err.active = err_back.active;
                this.setState({errState: err_back});
                return;
              }
              
            });
        }
        else
          return;
    }
  render() {
    return (
    <div className="container">
        {this.state.errState.active && <div className="alert alert-primary" role="alert"> {this.state.errState.active} </div>}
        <form id="Login" onSubmit={this.onSubmit}>
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
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
    </div>
    );
  } 
}

export default Login;
