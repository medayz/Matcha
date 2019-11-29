import "./edit.css";
import React, { Component } from "react";
import axios from "axios";
import EditInfos from "./editProfileCom/EditInfos";
import ProfilePic from "./editProfileCom/ProfilePic";
import EditUsername from "./editProfileCom/EditUsername";
import EditPassword from "./editProfileCom/EditPassword";
import EditEmail from "./editProfileCom/EditEmail";
import { Redirect } from "react-router";
import AddIcon from '@material-ui/icons/Add';
import Picture from '../Picture';
import { addPic } from "../../helpers/addImg";

const red = {
	color : "red"
}

const addstyle= {
	fontSize: '50px',
	float: 'right',
	cursor: 'pointer'
}

const padd = {
	paddingTop: '3%'
}

const fileaddstyle= {
	fontSize: '50px',
	width: '100%',
	float: 'right',
	cursor: 'pointer'
}

class Alertmsgerror extends Component{

	render () {
	  return (
		<div className="alert alert-warning alert-dismissible fade show" role="alert">
		  Error image
		</div>
	  )
	}
  }
  
  class Alertmsgsuccess extends Component{
  
	render () {
	  return (
		<div className="alert alert-success alert-dismissible fade show" role="alert">
		  Image {this.props.action}
		</div>
	  )
	}
  }

class EditProfile extends Component {
	constructor(props) {
		super(props);
		this.fileUpload = React.createRef();
	}
	state = {
		visible: false,
		pass: "",
		cPass: "",
		email: "",
		username: "",
		pics: [],
		pp: "",
		msg2: "",
		msg3: "",
		tokenErr: false,
		errState: {},
		addlogo: true
	};
	clearErrorState = () => {
		this.setState({ errState: {} });
		this.setState({ msg1: "" });
		this.setState({ msg2: "" });
		this.setState({ msg3: "" });
	};

	uploadProfileImg = async e => {
		let img = e.target.files[0];
		if (img.name.match(/\.(jpg|jpeg|png)$/)) {
		var formData = new FormData();
		formData.append("profileImg", img);
		formData.append("isProfilePic", false);
		addPic(formData)
			.then(({ data }) => {
				this.setState({msguploadimage : data.status});
				let imgs = this.state.pics;
				data.img.isProfilePic = false;
				imgs.push(data.img);
				this.setState({pics : imgs});
				if (this.state.pics.length === 4)
					this.setState({addlogo : false});
				this.setState({err : true});
			})
			.catch(err => {
				this.setState({err : false});
			});
		}
		else
			this.setState({err : false});
		setTimeout(() => {
		this.setState({err : 'not yet'});
		}, 3000);
	};

	uploadsnap = () => {
		this.fileUpload.current.click();
	};
	onChangeTags = newValue => {
		var Tags = {
			value: newValue.value,
			label: newValue.label
		};
		console.log(Tags);
	};

	deleteImg = (filename) => {
		axios
		.post('/api/users/delete/picture',{ filename })
		.then(res => {
			let pics = this.state.pics;
			this.setState({pics : pics.filter(img => img.filename !== filename)});
			if (this.state.pics.length < 4)
				this.setState({addlogo : true});
			this.setState({err : "deleted"});
		})
		;
		setTimeout(() => {
			this.setState({err : 'not yet'});
		}, 3000);
	}

	async UNSAFE_componentWillMount() {
		try {
			const res = await axios.get(`/api/users/get`);
			if (res.data.data) {
				const user = res.data.data;
				user.username && this.setState({ username: user.username });
				user.email && this.setState({ email: user.email });
				let pics = await axios.get(`/api/pics/get/${user.username}`);
				pics = pics.data.data;
				this.setState({pics : pics.filter(img => img.ispp === "false")});
				this.setState({pp : pics.filter(img => img.ispp === "true")});
				this.setState({ visible: true });
			}
		} catch(err) {
			console.log(`ERROOR: ${err.message}`);
			//this.setState({tokenErr : true});
		};
	}

	onChange = e => {
		this.setState({ [e.target.name]: e.target.value });
	};

	render() {
		return (
			<div className="container-fluid">
				{this.state.tokenErr && <Redirect to="/login" />}
				
				<div className="row profile">
					<div className="col-md-3">
					 	{this.state.visible &&  <ProfilePic pp={this.state.pp[0]} username={`${this.state.username}`}/>}
					</div>
					<br />
					<div className="col-md-9">
						<ul className="nav nav-tabs" id="myTab" role="tablist">
							<li className="nav-item">
								<a className="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Setting</a>
							</li>
							<li className="nav-item">
								<a className="nav-link" id="username-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Username</a>
							</li>
							<li className="nav-item">
								<a className="nav-link" id="email-tab" data-toggle="tab" href="#mail" role="tab" aria-controls="contact" aria-selected="false">Email</a>
							</li>
							<li className="nav-item">
								<a className="nav-link" id="pass-tab" data-toggle="tab" href="#pass" role="tab" aria-controls="contact" aria-selected="false">Password</a>
							</li>
							<li className="nav-item">
								<a className="nav-link" id="imgs-tab" data-toggle="tab" href="#imgs" role="tab" aria-controls="contact" aria-selected="false">Images</a>
							</li>
						</ul>
						<div className="tab-content" id="myTabContent">
						<div style={padd} className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
							{this.state.visible && <EditInfos username={this.state.username} />}
						</div>
						<div style={padd} className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="username-tab">
							{this.state.visible && (
								<EditUsername username={this.state.username} />
							)}
						</div>
						<div  style={padd} className="tab-pane fade" id="mail" role="tabpanel" aria-labelledby="email-tab">
							{this.state.visible && <EditEmail email={this.state.email} />}
						</div>
						<div style={padd} className="tab-pane fade" id="pass" role="tabpanel" aria-labelledby="pass-tab">
							{this.state.visible && <EditPassword /> }
						</div>
						<div style={padd} className="tab-pane fade" id="imgs" role="tabpanel" aria-labelledby="imgs-tab">
							<div className="profile-content">
								<small style={red}>*You should have at least one picture</small>
									
								{this.state.err === true && <Alertmsgsuccess action="uploaded"/>}
								{this.state.err === false && <Alertmsgerror />}
								{this.state.err === "deleted" && <Alertmsgsuccess action="deleted"/>}
								<form>
									<div className="row jjj">
										{this.state.pics.map((img, index) => (
											<div className="col-md-6 col-lg-3" style={{marginTop: '2%'}} key={index}>
												<Picture img={ img.filename } deleteImg={ () => this.deleteImg(img.filename) } />
											</div>
										))}
									</div>
									{this.state.addlogo &&
									<div className="upload-btn-wrapper">
										<center>
										<AddIcon style={addstyle} className="btn222" size="large"/>
										<input
											style={fileaddstyle}
											type="file"
											name="myfile"
											onChange={this.uploadProfileImg}
										/>
										</center>
									</div>}
								</form>
							</div>
						</div>
						</div>
					</div>
				</div>
		</div>
		);
	}
}

export default EditProfile;
