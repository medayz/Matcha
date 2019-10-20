import React, {Component} from 'react';
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import RestoreIcon from "@material-ui/icons/Restore";
import FavoriteIcon from "@material-ui/icons/Favorite";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import FormLabel from "@material-ui/core/FormLabel";

const pStyle = {
	marginTop: '5%',
};

class Sort extends Component { 
    render(props) {
        return (
            <div className="col-md-5" style={pStyle}>
                <div className="row">
                    <FormLabel component="legend">Sort By</FormLabel>
                </div>
                <div className="row">
                    <BottomNavigation
                        value="SortBar"
                        onChange={() => this.props.changeSorting()}
                        showLabels
                    >
                    <BottomNavigationAction label="Tags" icon={<RestoreIcon />} />
                    <BottomNavigationAction
                        label="Rating"
                        icon={<FavoriteIcon />}
                    />
                    <BottomNavigationAction
                        label="Geographic"
                        icon={<LocationOnIcon />}
                    />
                    </BottomNavigation>
                </div>
            </div>
        );
    }
}

export default Sort;