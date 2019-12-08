import React, { Component } from 'react';
import RegisterInput from './RegisterInput';
import axios from 'axios';
import { btnColor } from "../../css/styleClasses";
import '../../css/login.css';
import { Redirect } from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import classnames from "classnames";
const regStyle = {
  padding: '15px'
}

class Register extends Component {
  state = {
      fName: '',
      lName: '',
      username: '',
      email: '',
      birthDate: '',
      pass: '',
      cPass: '',
      errState: {},
      registred: '',
      show: undefined
  };
  
  _unmount = true;

  clear = () => {
    document.getElementById('firstName').value = "";
    document.getElementById('lastName').value = "";
    document.getElementById('email').value = "";
    document.getElementById('username').value = "";
    document.getElementById('pass').value = "";
    document.getElementById('cPass').value = "";
  }

  getlocalisation = async () => {
    const head = {
      Accept: "application/json",
      "Content-Type": "application/json"
    };
    const ipinfo_token = "fb1bb2d727f4b8";
    navigator.geolocation.getCurrentPosition(
      function(position) {
        const loc = {
          long: position.coords.longitude,
          lat: position.coords.latitude
        }
        axios
          .post('/api/users/add/location', loc, head)
          .catch(err => console.log(err));
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED)
        {
          this.state.myip.then(ip => {
            axios
              .get(`http://ipinfo.io/${ip}?token=${ipinfo_token}`)
              .then(
                res => {
                  const [long, lat] = res.data.loc.split(',');
                  const location = {
                    long: Number(long),
                    lat: Number(lat),
                    city: res.data.city,
                    country: res.data.country
                  };
                  axios
                    .post('/api/users/add/location', location, head)
                    .catch(err => console.log(err));
                }
              )
              .catch(err => {
                console.log(err.message);
              });
          });
        }
      }
    );  
  }

  onChange = e => {
    this.setState({[e.target.name]: e.target.value});
  };

  onSubmit = async e => {
      e.preventDefault();
      const err = {
        fName: '',
        lName: '',
        username: '',
        email: '',
        birthDate: '',
        pass: '',
        cPass: ''
      };
      try{
        this.setState({errState: err});
        if (this.state.pass.length < 6)
          err.pass = 'Password must be at least 6 characters';
        if (this.state.cPass.length === 0)
          err.cPass = 'Confirm password is required';
        if (this.state.cPass !== this.state.pass)
          err.cPass = 'Password error';
        if (this.state.email === '')
          err.email = 'Email is required';
        if (this.state.username.length === 0)
          err.username = 'Username is required';
        if (this.state.lName.length === 0)
          err.lName = 'Last name is required';
        if (this.state.fName.length === 0)
          err.fName = 'First name is required';
        if (this.state.birthDate.length === 0)
          err.birthDate = 'Birthday date is required';

        if (err.fName === '' && err.lName === ''
        && err.username === '' && err.email === ''
        && err.pass === '' && err.cPass === '' && err.birthDate === '')
        {
          const user = this.state;
          await axios
            .post(`/api/users/create`, user)
            .then(res => {
              const backend = res.data;
              if (backend.status === 200)
              {
                this.setState({ registred: 'done'})
                this.setState(
                  { 
                    fName: '',
                    lName: '',
                    username: '',
                    email: '',
                    pass: '',
                    cPass: '',
                    birthDate: '',
                    errState: {}
                  }
                );
                this.clear();
              }
            })
            .catch(err => {
              const back_err = err.response.data;
              console.log(back_err);
              if (back_err.status === 400){
                if (back_err.data.err.fName !== '')
                  err.fName = back_err.data.err.fName;
                if (back_err.data.err.lName !== '')
                  err.lName = back_err.data.err.lName;
                if (back_err.data.err.email !== '')
                  err.email = back_err.data.err.email;
                if (back_err.data.err.username !== '')
                  err.username = back_err.data.err.username;
                if (back_err.data.err.birthDate !== '')
                  err.birthDate = back_err.data.err.birthDate;
                if (back_err.data.err.pass !== '')
                  err.pass = back_err.data.err.pass;
                if (back_err.data.err.cPass !== '')
                  err.cPass = back_err.data.err.cPass;
                this.setState({errState: err});
              }
            });
        }
        else
          return;
      }
      catch (err) {
        console.log(err);
      }
  }

  componentDidMount () {
    axios.get('/api/users/whoami')
    .then(res => {
      this._unmount && this.setState({show: true});
    })
    .catch(err => {
      this._unmount && this.setState({show: false});
    });
  }

  componentWillUnmount () {
    this._unmount = false;
  }

  render() {
    if (this.state.show)
      return (<Redirect to="/"/>)
    return (
    <div className="container">
        
        <br />
        {this.state.show === false && <div className="row login-wrap">
          <div className="col-md-3"></div>
          <div className="col-md-6" style={regStyle} >
            <form id="form1" onSubmit={this.onSubmit}>
              {this.state.registred === 'done' && <div className="alert alert-primary" role="alert"> you will receive an email to confirm your account before you sign in </div>}
              {this.state.registred === '500' && <div className="alert alert-primary" role="alert"> Unsuccesful registration, please retry! </div>}
              <br />
              <RegisterInput 
                  label="First Name"
                  type="text"
                  name="fName"
                  id="firstName"
                  placeholder="Enter first name"
                  err={this.state.errState.fName}
                  value={this.state.fName}
                  onChange={this.onChange}
              />
              <RegisterInput 
                  label="Last Name"
                  type="text"
                  name="lName"
                  id="lastName"
                  placeholder="Enter last name"
                  err={this.state.errState.lName}
                  value={this.state.lName}
                  onChange={this.onChange}
              />
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
                  label="Email"
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter email"
                  err={this.state.errState.email}
                  value={this.state.email}
                  onChange={this.onChange}
              />
              <div className="form-group">
                <label htmlFor='date' style={{color: 'pink'}}>Bithday date</label>
                <TextField
                  id="date"
                  name="birthDate"
                  className={classnames("form-control", { "is-invalid": this.state.errState.birthDate })}
                  variant="outlined"
                  type="date"
                  style={{width: '100%'}}
                  onChange={this.onChange}
                  defaultValue={this.state.fName}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <br /><br />
                {this.state.errState.birthDate && <div className="invalid-feedback"> {this.state.errState.birthDate} </div>}
              </div>
              <RegisterInput 
                  label="Password"
                  type="password"
                  name="pass"
                  id="pass"
                  placeholder="Enter password"
                  err={this.state.errState.pass}
                  onChange={this.onChange}
                  value={this.state.pass}
              />
              <RegisterInput 
                  label="Confirm password"
                  type="password"
                  name="cPass"
                  id="cPass"
                  placeholder="Confirm password"
                  err={this.state.errState.cPass}
                  onChange={this.onChange}
                  value={this.state.cPass}
              />
              <br />
              <button type="submit" className="btn" style={btnColor}>Submit</button>
            </form>
          </div>
          <div className="col-md-3"></div>
        </div>}
    </div>
    );
  } 
} 

export default Register;
