import React from 'react';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

const deletestyle = {
  fontSize: '30px',
  position: 'absolute',
  color: 'red',
  cursor: 'pointer'
};
 
function Picture(props) {

	return (
		<div className="card jj">
			<img src={ `/userPics/${props.img}` } className="card-img-top" alt="..." />
			<DeleteOutlineIcon style={ deletestyle } onClick={ props.deleteImg }/>
		</div>
	);
}

export default Picture;