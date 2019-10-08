import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import DoneIcon from '@material-ui/icons/Done';
 
const avatarcss = {
    width: '140px',
    height: '140px',
    maxWidth: '140px',
    maxHeight: '140px',
}


class Profileuser extends Component {

  state = {
    data : this.props.location.state.userprofile
  }

  componentDidMount() {
      console.log(this.state.data);
  }

  render() {
    return (
        <div className="container-fluid">
            <div className="row profile">
                <div className="col-md-1" />
                <br />
                <div className="col-md-10">
                    <div className="profile-content">
                        <div className="row">
                            <div className="col-md-4">
                                <Avatar style={avatarcss} alt="Remy Sharp" src="https://cdn.intra.42.fr/users/large_iouzzine.jpg" />
                                <Chip
                                    label={`${this.state.data.fName} ${this.state.data.lName}`}
                                    color="primary"
                                    deleteIcon={<DoneIcon />}
                                    variant="outlined"
                                    style={{marginTop : '2%', marginLeft : '7%'}}
                                />
                            </div>
                            <div className="col-md-1" />
                            <div className="col-md-7">
                                
                            </div>
                        </div>                        
                    </div>
                </div>
                <div className="col-md-1" />
            </div>
        </div>
       
    );
  } 
}

export default (Profileuser);
