import React, { useState } from 'react';
import GoogleMaps from './MapsInput';
import TagsChoose from './TagsChooseTags';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';
import { filterColor } from "../css/styleClasses";

const topMargin = {
	marginTop: '10px'
}

const spanStyle = {
	fontSize: 'x-large',
	color: 'pink'
}

const SearchFilters = (props) => {

	const [ageFilter, setAgeFilter] = useState([18, 25]);
	const [tagsFilter, setTagsFilter] = useState([]);
	const [location, setLocation] = useState("");
	const [fame, setFame] = useState([0, 10]);

	const filterAge = (e, newValue) => {
		setAgeFilter(newValue);
	};

	const filterLocation = (event) => {
		const value = event.target.value ? event.target.value.trim() : "";
		value && setLocation(value);
	};

	const filterTags = (selected) => {
		setTagsFilter(selected.map(item => item.title));
	};

	const filterFame = (e, newValue) => {
		setFame(newValue);
	};

	return (
		<Paper id="divSearch">
			<div className="container-fluid">
				<div className="row">
					<div className="col-md-12">
						<span style={spanStyle}>Search</span>
					</div>
				</div>
				<div className="row">
					<div className="col-md-6">
						<div className="row">
							<div className="col-md-12" style={topMargin}>
								<GoogleMaps inputValue={location} handleChange={filterLocation} />
							</div>
							<div className="col-md-12" style={topMargin}>
								<TagsChoose handleChange={filterTags} />
							</div>
						</div>
					</div>
					<div className="col-md-6">
						<div className="row">
							<div className="col-md-12" style={topMargin}>
								<Typography id="range-slider" gutterBottom>
									Age
								</Typography>
								<Slider
									value={ageFilter}
									onChange={filterAge}
									min={18}
									max={55}
									style={filterColor}
									valueLabelDisplay="auto"
									aria-labelledby="range-slider"
								/>
							</div>
							<div className="col-md-12" style={topMargin}>
								<Typography id="continuous-slider" style={{color: "black"}} gutterBottom>
									Fame Rating
								</Typography>
								<Slider
									value={fame}
									onChange={filterFame}
									valueLabelDisplay="auto"
									style={filterColor}
									min={0}
									max={100}
									aria-labelledby="continuous-slider"
								/>
							</div>
						</div>
					</div>
					<br />
					<div className="col-md-12">
						<Button
							onClick={(e) => props.search(e, {
								ageFilter: ageFilter,
								tagsFilter: tagsFilter,
								location: location,
								fame: fame
							})}
							variant="contained"
							style={{float: 'left', backgroundColor: 'pink', color: 'white', boxShadow: 'none'}}
						>
							Search
						</Button>
					</div>
				</div>
			</div>
		</Paper>
	);
}

export default SearchFilters;