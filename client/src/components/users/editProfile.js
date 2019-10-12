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

// const logoAdd = {
//   width: "25%",
//   height: "25%",
//   paddingLeft: "2%"
// };

const addstyle= {
	fontSize: '50px',
	marginTop: '8%',
	float: 'left'
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
		errState: {}
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
			console.log(img);
			const formData = new FormData();
			formData.append("profileImg", img, img.name);
		}
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
		// e.preventDefault();
		axios.post(
			'/api/users/delete/picture',
			{ filename }
		);
	}

	async UNSAFE_componentWillMount() {
		try {
			const res = await axios.get(`/api/users/get`);
			if (res.data.data) {
				const user = res.data.data;
				user.username && this.setState({ username: user.username });
				user.email && this.setState({ email: user.email });
				this.setState({ visible: true });
				let pics = await axios.get(`/api/pics/get/${user.username}`);
				console.log(pics)
				pics = pics.data.data;
				this.setState({pics : pics.filter(img => !img.ispp)});
				this.setState({pp : pics.filter(img => img.ispp)});
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
					 {this.state.visible &&  <ProfilePic />}
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
						<form>
							<div className="row jjj">
								{this.state.pics.map((img, index) => (
									<Picture key={index} img={ img.filename } deleteImg={ () => this.deleteImg(img.filename) } />
								))}
							</div>
							<AddIcon style={addstyle} color="primary" size="large"/>
							<br />
							<input
								type="file"
								ref={this.fileUpload}
								id="snapInput"
								hidden
							/>
							
						</form>
					</div>
				</div>
			</div>}
		</div>
		);
	}
}

export default EditProfile;
