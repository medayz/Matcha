import React, { Component, useState, useEffect } from 'react'
import Filters from './SearchFilters';
import Paper from '@material-ui/core/Paper';
import '../css/search.css';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import SuggestionCard from './SuggestionCard';
import axios from "axios";
import { Redirect } from 'react-router-dom';

const spanStyle = {
	fontSize: 'x-large',
	color: 'pink'
}



const BarTop = () => {

	const [activeSort, setActiveSort] = useState(false);
	const [searchResults, setResults] = useState([]);
	const [redirect, setRedirect] = useState(false);
	const [data, setData] = useState({});
	const [toEdit, setToEdit] = useState(false);



	const search = (e, filterValues) => {
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
				setActiveSort(true);
			})
			.catch(err => {
			});
	};

	const toProfile = (username) => {
		axios.get(`/api/users/get/${username}`)
			.then (res => {
				setData(res.data.data);
				setRedirect(true);
			})
			.catch (err => {

			});
	}

	const sortByAge = () => {
		let arr = [];
		searchResults.forEach(element => {
			arr.push(element);
		});
		arr.sort((a, b) => a.age - b.age);
		setResults(arr);
	}

	const sortByFame = () => {
		let arr = [];
		searchResults.forEach(element => {
			arr.push(element);
		});
		arr.sort((a, b) => b.fame - a.fame);
		setResults(arr);
	}

	const sortByLoc = () => {
		let arr = [];
		searchResults.forEach(element => {
			arr.push(element);
		});
		arr.sort((a, b) => a.distance - b.distance);
		setResults(arr);
	}

	const sortByTags = () => {
		let arr = [];
		searchResults.forEach(element => {
			arr.push(element);
		});
		arr.sort((a, b) => b.ntags - a.ntags);
		setResults(arr);
	}

	useEffect(() => {
		axios.get('/api/users/whoami')
        .then(async result => {
			let res = await axios.get(`/api/users/get/${result.data.user}`)
				.catch(er => {
				});    
			let pics = await axios.get(`/api/pics/get/${result.data.user}`);
			pics = pics.data.data;
			let data = res.data.data;
			if (pics.length === 0 || data.birthDate === "" || data.gender === "")
				setToEdit(true);
		}).catch(err => {});
	}, [])


	if (toEdit)
		return (<Redirect to='/profile/edit' />)
	else
		return (
			<div>
				<Filters search={search} />
				<br />
				{redirect && <Redirect to={
						{
							pathname: `/profile/${data.username}`,
							state: data
						}
					} />}
				{activeSort && <div className="container-fluid">
					<div className="row">
						<div className="col-md-3">
							<Paper id="divSearch">
								<span style={spanStyle}>Sort</span>
								<br />
								<RadioGroup aria-label="sort" name="sort">
									<FormControlLabel  value="age" control={<Radio onChange={sortByAge} />} label="Age" />
									<FormControlLabel  value="fame" control={<Radio onChange={sortByFame}/>} label="Fame" />
									<FormControlLabel  value="localisation" control={<Radio onChange={sortByLoc}/>} label="Localisation" />
									<FormControlLabel  value="tags" control={<Radio onChange={sortByTags}/>} label="Tags" />
								</RadioGroup>
							</Paper>
						</div>
						<div className="col-md-9">
							<div className="row">
								{searchResults.length > 0 && searchResults.map((item, index) => (
									<SuggestionCard
										key={index}
										img={item.pp}
										username={item.username}
										age={item.age}
										ntags={item.ntags}
										distance={item.distance}
										fameRating={item.fame}
										toProfile={() => toProfile(item.username)}
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
