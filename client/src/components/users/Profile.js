import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Fjla from '../../backIndex.jpg'
class Login extends Component {
    
  render() {
    return (

        <div className="container-fluid">
    <div className="row profile">
		<div className="col-md-3">
			<div className="profile-sidebar">
				<div className="profile-userpic">
                    <div className="row">
					        <img src={Fjla} className="img-responsive" alt="" />
                    </div>
				</div>
				<div className="profile-usertitle">
					<div className="profile-usertitle-name">
						Marcus Doe
					</div>
					<div className="profile-usertitle-job">
						Developer
					</div>
				</div>
				<div className="profile-userbuttons">
					<button type="button" className="btn btn-success btn-sm">Upload</button>
					<button type="button" className="btn btn-danger btn-sm">Delete</button>
				</div>
				<div className="profile-usermenu">
					<ul className="sidebar-nav">
						<li className="active" height="">
                            <Link to="#" className="nav-link">
                                My snap
                            </Link>
						</li>
                    </ul>
                    <ul className="sidebar-nav">
						<li className="active" height="">
                            <Link to="#" className="nav-link">
                                Update profile
                            </Link>
						</li>
                    </ul>
                    <ul className="sidebar-nav">
						<li className="active" height="">
                            <Link to="#" className="nav-link">
                                Update password
                            </Link>
						</li>
                    </ul>
				</div>
			</div>
		</div>
        <br />
		<div className="col-md-9">
            <div className="profile-content">
			   Some user related content goes here...
            </div>
		</div>
	</div>
</div>
    );
  } 
}

export default Login;
