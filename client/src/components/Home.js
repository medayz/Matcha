import React, { Component } from "react";
import axios from "axios";
import Profileuser from './users/Profileuser';
import SuggestionCard from './SuggestionCard';
import Filters from './Filters';
import Sort from './Sort';
import { Redirect } from 'react-router';

class Home extends Component {

	state = {
		redirect : false,
		dataprofile : {},
		suggestions: [],
		tokenErr : false
	};

	changeSorting = (e, sortingCriteria) => {

		if (!sortingCriteria) return null;
		const sortFuncs = {
			tags: (a, b) => b.ntags - a.ntags,
			distance: (a, b) => a.distance - b.distance,
			age: (a, b) => a.age - b.age
		};
		this.setState({
			suggestions: this.state.suggestions.sort(sortFuncs[sortingCriteria]).slice()
		});
	};

	toProfile = async (username) => {
		axios.get(`/api/users/get/${username}`)
			.then (res => {
				this.setState({dataprofile: res.data.data});
				this.setState({redirect : true});
			})
			.catch (err => {
				this.setState({tokenErr : true});
			});
	}

	filter = (filtersState) => {
		const filters = {
			distance: filtersState.distanceFilter,
			tags: filtersState.tagsFilter,
			ageMin: filtersState.ageFilter[0],
			ageMax: filtersState.ageFilter[1]
		};
		axios
			.post('/api/users/filter', filters)
			.then(res => {
				this.setState({ suggestions: res.data.data });
			})
			.catch(err => {
				this.setState({tokenErr : true});
			});
	}

	async componentDidMount () {
		await axios.get('/api/users/whoami')
        .then(res => {
            
        })
        .catch(err => {
            this.setState({tokenErr : true});
        })
	}

	render() {
		return (
			<div>
				{this.state.tokenErr && <Redirect to="/login" />}
				{this.state.redirect && <Redirect to={
					{
						pathname: `/profile/${this.state.dataprofile.username}`,
						state: {userprofile: this.state.dataprofile }
					}
				} Component={Profileuser} />}
				<div className="container">
					<div className="row" >
						<div className="col-md-1" />
							<Sort changeSorting={this.changeSorting} />
						<div className="col-md-2" />
						<div className="col-md-4">
							<Filters filterFunction={this.filter}/>
						</div>
					</div>
					<div className="row">
						{this.state.suggestions.map((suggestion, index) => (
							<SuggestionCard
								key={index}
								img={suggestion.pic}
								username={suggestion.username}
								age={suggestion.age}
								ntags={suggestion.ntags}
								distance={suggestion.distance}
								toProfile={() => this.toProfile(suggestion.username)}
							/>
						))}
					</div>
				</div>
			</div>
		);
	}
}

export default Home;
