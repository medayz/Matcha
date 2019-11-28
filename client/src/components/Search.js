import React, { Component, useState } from 'react'
import Filters from './SearchFilters';
import Paper from '@material-ui/core/Paper';
import '../css/search.css';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import SuggestionCard from './SuggestionCard';
import axios from "axios";

const spanStyle = {
	fontSize: 'x-large',
	color: 'pink'
}

const BarTop = () => {

	const [activeSort, setActiveSort] = useState(false);
	const [searchResults, setResults] = useState([]);

	const search = (e, filterValues) => {
		console.log(filterValues);
		setActiveSort(true);
		const filters = {
			location: filterValues.location,
			tags: filterValues.tagsFilter,
			ageMin: filterValues.ageFilter[0],
			ageMax: filterValues.ageFilter[1],
			fameMin: filterValues.fame[0],
			fameMax: filterValues.fame[1]
		};
		axios
			.post('/api/users/search', filters)
			.then(res => {
				setResults(res.data.data);
			})
			.catch(err => {
				console.log('search error!');
			});
	};

	return (
		<div>
			<Filters search={search} />
			<br />
			{activeSort && <div className="container-fluid">
				<div className="row">
					<div className="col-md-3">
						<Paper id="divSearch">
							<span style={spanStyle}>Sort</span>
							<br />
							<RadioGroup aria-label="sort" name="sort">
								<FormControlLabel value="age" control={<Radio />} label="Age" />
								<FormControlLabel value="fame" control={<Radio />} label="Fame" />
								<FormControlLabel value="localisation" control={<Radio />} label="Localisation" />
								<FormControlLabel value="tags" control={<Radio />} label="Tags" />
							</RadioGroup>
						</Paper>
					</div>
					<div className="col-md-9">
						<div className="row">
							{searchResults.map((item, index) => (
								<SuggestionCard
									key={index}
									img={item.pp}
									username={item.username}
									age={item.age}
									ntags={item.ntags}
									distance={item.distance}
									fameRating={item.fame}
									toProfile={() => this.toProfile(item.username)}
								/>
							))}
						</div>
					</div>
				</div>
			</div>}
		</div>
		
	)
}


export default class Search extends Component {
	render() {
		return (
			<div className="container">
				<div className="row">
					<div className="col-md-12">
						<BarTop />
					</div>
				</div>
			</div>
		)
	}
}
