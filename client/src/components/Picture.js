import React from 'react';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

const deletestyle = {
  fontSize: '30px',
  position: 'absolute',
  color: 'red',
  cursor: 'pointer'
};

const setAsProfile = {
	fontSize: '30px',
	position: 'absolute',
	color: '#8aff7c',
	float: 'right',
	cursor: 'pointer',
	marginLeft: '82%',
  };
 
function Picture(props) {

	return (
		<div className="card jj">
			<img src={ `http://localhost:1337/userPics/${props.img}` } style={{height: "100%", width:"100%"}} className="card-img-top" alt="..." />
			<DeleteOutlineIcon style={ deletestyle } onClick={ props.deleteImg }/>
			<AccountCircleIcon style={ setAsProfile } onClick={ props.setAsProfilePic }/>
		</div>
	);
}

export default Picture;