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
          .get(`http://localhost:1337/api/users/activation/${params.username}/${params.token}`)
          .then(res => {
            if (!res.data.status === 200)
            {
                this.setState({ msg: res.data.msg});
                this.props.setAlert(this.state.msg, 'success');
            }
            else
            {
                this.setState({ msg: res.data.msg});
                this.props.setAlert(this.state.msg, 'danger');
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