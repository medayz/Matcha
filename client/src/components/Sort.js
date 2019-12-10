import React, {Component} from 'react';
import FavoriteIcon from "@material-ui/icons/Favorite";
import LabelIcon from '@material-ui/icons/Label';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import FormLabel from "@material-ui/core/FormLabel";
import PersonIcon from '@material-ui/icons/Person';

const rowStyle = {
    padding: '5%'
};

class Sort extends Component { 
    state = {
        sortCriteria: null
    };

    render(props) {
        return (
            <div className="col-md-4">
                <div className="col" style={rowStyle}>
                    <div className="row" style={{position: 'relative'}}>
                        <FormLabel component="legend">Sort By</FormLabel>
                    </div>
                    <div className="row" style={{display: 'inline-block', position: 'relative'}}>
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
            </div>
        );
    }
}

export default Sort;