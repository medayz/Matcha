import React, { Component } from "react";
import axios from "axios";
import Profileuser from './users/Profileuser';
import SuggestionCard from './SuggestionCard';
import Filters from './Filters';
import Sort from './Sort';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { user_state } from "../actions/connected";

class Home extends Component {

	_unmout = true;

	state = {
		redirect : false,
		dataprofile : {},
		suggestions: [],
		tokenErr : false,
		user: {},
		whoami: "",
		redirectToEdit: false,
		completed: true
	};

	//abortController = new AbortController();

	changeSorting = (e, sortingCriteria) => {

		if (!sortingCriteria) return null;
		const sortFuncs = {
			tags: (a, b) => b.ntags - a.ntags,
			distance: (a, b) => a.distance - b.distance,
			age: (a, b) => a.age - b.age,
			fame: (a, b) => b.fameRating - a.fameRating
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
				//this.setState({tokenErr : true});
			});
	}

	filter = (filtersState) => {
		const filters = {
			distance: filtersState.distanceFilter,
			tags: filtersState.tagsFilter,
			ageMin: filtersState.ageFilter[0],
			ageMax: filtersState.ageFilter[1],
			fame: filtersState.fameFilter
		};
		axios
			.post('/api/users/filter', filters)
			.then(res => {
				this._unmout && this.setState({ suggestions: res.data.data });
			})
			.catch(err => {
				//this.setState({tokenErr : true});
			});
	}

	componentDidMount () {
		axios
		.get('/api/users/completed')
		.then (res => {
			console.log(res);
			if (this.props.userState){
				const test = {
					ageFilter: [18, 25],
					tagsFilter : 1,
					distanceFilter : 5000,
					fameFilter : 0
				}
				this._unmout && this.filter(test);
			}
		})
		.catch(err => {
			this._unmout && this.setState({completed: false});
		});
		
	}

	componentWillUnmount () {
		this._unmout = false;
	}

	render() {
		
			return (
			<div>
				{!this.props.userState && <Redirect to="/login" />}
				{!this.state.completed && <Redirect to="/profile/edit" />}
				{this.state.redirect && <Redirect to={
					{
						pathname: `/profile/${this.state.dataprofile.username}`,
						state: {userprofile: this.state.dataprofile }
					}
				} Component={Profileuser} />}
				<div className="container" style={{margin: '30px auto'}}>
					<div className="row">
						<Sort changeSorting={this.changeSorting} />
						<div className="col-md-4" />
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
								fameRating={suggestion.fameRating}
								toProfile={() => this.toProfile(suggestion.username)}
							/>
						))}
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
	  userState: state.connected,
	}
  }

export default connect(mapStateToProps, {user_state})(Home);

