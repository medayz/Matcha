import "./edit.css";
import React, { Component } from "react";
// import addLogo from "../../images/default/plus.png";
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

const addstyle= {
	fontSize: '50px',
	float: 'right',
	cursor: 'pointer'
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
				console.log("hey");
				this.setState({msguploadimage : data.status});
				let imgs = this.state.pics;
				imgs.push(data.img);
				this.setState({pics : imgs});
				console.log(this.state.pics.length);
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
		console.log(this.state.pics);
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
				console.log(pics);
				this.setState({pics : pics.filter(img => !img.ispp)});
				this.setState({pp : pics.filter(img => img)});
				this.setState({ visible: true });
			}
		} catch(err) {
			console.log(`ERROOR: ${err.message}`);
			this.setState({tokenErr : true});
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
					 	{this.state.visible &&  <ProfilePic pp={this.state.pp[0]}/>}
					</div>
					<br />
					<div className="col-md-9">
						{this.state.visible && <EditInfos username={this.state.username} />}
					</div>
				</div>
				<div className="row profile">
					<div className="col-md-3" />
					<br />
					<div className="col-md-9">
						{this.state.visible && (
							<EditUsername username={this.state.username} />
						)}
					</div>
				</div>
				<div className="row profile">
					<div className="col-md-3" />
					<br />
					<div className="col-md-9">
						{this.state.visible && <EditEmail email={this.state.email} />}
					</div>
				</div>
				{this.state.visible && <EditPassword /> }
				{this.state.visible &&  <div className="row profile">
				<div className="col-md-3" />
				<br />
				<div className="col-md-9">
					<div className="profile-content">
						{this.state.err === true && <Alertmsgsuccess action="uploaded"/>}
						{this.state.err === false && <Alertmsgerror />}
						{this.state.err === "deleted" && <Alertmsgsuccess action="deleted"/>}
						<form>
							<div className="row jjj">
								{this.state.pics.map((img, index) => (
									<Picture key={index} img={ img.filename } deleteImg={ () => this.deleteImg(img.filename) } />
								))}
							</div>
							{this.state.addlogo &&
							<div className="upload-btn-wrapper">
								<center>
								<AddIcon style={addstyle} className="btn222" color="primary" size="large"/>
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
			</div>}
		</div>
		);
	}
}

export default EditProfile;
