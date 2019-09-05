import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setAlert } from '../../actions/alert';
import axios from 'axios';
import { Redirect } from 'react-router';

class ConfirmAcc extends Component {
state = {
    msg: '',
    isVerified: false
}
async componentDidMount(){
    const { match: { params } } = this.props;
   
    await axios
          .get(`/api/users/activation/${params.username}/${params.token}`)
          .then(res => {
            console.log("hello");
            if (res.data.status === 200)
            {
                this.setState({ msg: res.data.msg});
                this.props.setAlert(this.state.msg, 'success');
            }
          })
          .catch (err => {
              const errBack = err.response.data;
              if (errBack.status === 400){
                   this.setState({ msg: errBack.msg});
                   this.props.setAlert(errBack.msg, 'danger');
              }
          }); 
    this.setState({isVerified: true});
}    
  render() {
    return (
        this.state.isVerified && <Redirect to='/login'/>
    );
  } 
}

export default connect(null, { setAlert })(ConfirmAcc);
