import React, { Component } from 'react';
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormLabel from "@material-ui/core/FormLabel";
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import { filterColor } from "../css/styleClasses";

const styleFilter = {
	backgroundColor : 'white',
	padding : '5%',
	margin: '1%',
	width : '253px'
}

const stylebtn = {
	width: '100%',
	margin: '0.3%',
	marginTop: '3%',
	backgroundColor: 'pink',
    color: 'white'
}

class Filters extends Component {
	state = {
		ageFilter: [18, 25],
		tagsFilter : 1,
		distanceFilter : 10,
		fameFilter : 0
	}

	filterAge = (e, newValue) => {
		this.setState({ageFilter: newValue});
	};

	filterLocation = (e, newValue) => {
		this.setState({distanceFilter : newValue});
	};

	filterTags = (e, newValue) => {
		this.setState({tagsFilter: newValue});
	};

	filterFame = (e, newValue) => {
		this.setState({fameFilter: newValue});
	};

	render () {
		return (
			<FormControl component="fieldset" style={styleFilter}>
				<FormLabel component="legend">Filter</FormLabel>
				<FormGroup>
					<Typography id="range-slider" style={{color: "black"}} gutterBottom>Age</Typography>
					<Slider
						value={this.state.ageFilter}
						onChange={this.filterAge}
						min={18}
						max={55}
						style={filterColor}
						valueLabelDisplay="auto"
						aria-labelledby="range-slider"
					/>
					<Typography id="continuous-slider" style={{color: "black"}} gutterBottom>Distance</Typography>
					<Slider
						value={this.state.distanceFilter}
						onChange={this.filterLocation}
						valueLabelDisplay="auto"
						min={0}
						max={30000}
						aria-labelledby="continuous-slider"
						style={filterColor}
					/>
					<Typography id="continuous-slider" style={{color: "black"}} gutterBottom>Tags</Typography>
					<Slider
						value={this.state.tagsFilter}
						onChange={this.filterTags}
						valueLabelDisplay="auto"
						style={filterColor}
						min={1}
						max={10}
						aria-labelledby="continuous-slider"
					/>
					<Typography id="continuous-slider" style={{color: "black"}} gutterBottom>Fame Rating</Typography>
					<Slider
						value={this.state.fameFilter}
						onChange={this.filterFame}
						valueLabelDisplay="auto"
						style={filterColor}
						min={0}
						max={100}
						aria-labelledby="continuous-slider"
					/>
				</FormGroup>
				<button
					className="btn"
					onClick={() => this.props.filterFunction(Object.assign({}, this.state))}
					style={stylebtn}
				>
					Filter
				</button>
			</FormControl>
		);
	   }
}

export default Filters;