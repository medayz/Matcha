import React, { Component } from 'react';
import RegisterInput from './RegisterInput';
import Alert from '../layout/Alert'

class Forget extends Component {
    state = {
        email: '',
        err: '',
        errState: {}
    };
    onChange = e => {
        this.setState({[e.target.name]: e.target.value});
    };
    clear = () => {
      document.getElementById('email').value = "";
    }
    onSubmit = async e => {
        
    }
  render() {
    return (
    <div className="container">
        <Alert />
        <form id="Login" onSubmit={this.onSubmit}>
            <RegisterInput 
              label="E-mail"
              type="email"
              name="email"
              id="email"
              placeholder="Enter username"
              err={this.state.errState.email}
              value={this.state.email}
              onChange={this.onChange}
            />
          <button type="submit" className="btn btn-primary">Send</button>
        </form>
    </div>
    );
  } 
}

export default Forget;