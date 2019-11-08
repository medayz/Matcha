import React, {Component} from 'react';
import FavoriteIcon from "@material-ui/icons/Favorite";
import LabelIcon from '@material-ui/icons/Label';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import FormLabel from "@material-ui/core/FormLabel";
import PersonIcon from '@material-ui/icons/Person';

const pStyle = {
	marginTop: '5%',
};

class Sort extends Component { 
    state = {
        sortCriteria: null
    };

    render(props) {
        return (
            <div className="col-md-5" style={pStyle}>
                <div className="row">
                    <FormLabel component="legend">Sort By</FormLabel>
                </div>
                <div className="row">
                    <ToggleButtonGroup
                        value={this.state.sortCriteria}
                        exclusive
                        onChange={this.props.changeSorting}
                        aria-label="text alignment"
                    >
                        <ToggleButton value="age" aria-label="left aligned">
                            <PersonIcon />
                        </ToggleButton>
                        <ToggleButton value="tags" aria-label="centered">
                            <LabelIcon />
                        </ToggleButton>
                        <ToggleButton value="distance" aria-label="centered">
                            <LocationOnIcon />
                        </ToggleButton>
                        <ToggleButton value="fame" aria-label="right aligned">
                            <FavoriteIcon />
                        </ToggleButton>
                    </ToggleButtonGroup>
                </div>
            </div>
        );
    }
}

export default Sort;