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

	state = {
		redirect : false,
		dataprofile : {},
		suggestions: [],
		tokenErr : false,
		user: {},
		whoami: "",
		redirectToEdit: false,
		_unmout: true
	};

	//abortController = new AbortController();

	changeSorting = (e, sortingCriteria) => {

		if (!sortingCriteria) return null;
		const sortFuncs = {
			tags: (a, b) => b.ntags - a.ntags,
			distance: (a, b) => a.distance - b.distance,
			age: (a, b) => a.age - b.age,
			fame: (a, b) => a.fameRating - b.fameRating
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
				this.setState({ suggestions: res.data.data });
			})
			.catch(err => {
				//this.setState({tokenErr : true});
			});
	}

	async componentDidMount () {
		if (this.props.userState){
			this.state._unmout && axios.get('/api/users/whoami')
			.then(async res => {
				this.state._unmout && this.setState({whoami: res.data.user});
				res = await axios.get(`/api/users/get/${this.state.whoami}`)
						.catch(er => {
							this.state._unmout && this.setState({redirect: true});    
				});
				let pics = await axios.get(`/api/pics/get/${this.state.whoami}`);
				pics = pics.data.data;
				this.state._unmout && this.setState({pics : pics.filter(img =>  img.ispp === "false")});
				this.state._unmout && this.setState({data: res.data.data});
				if (this.state.pics.length === 0 || this.state.data.birthDate === "" || this.state.data.gender === "" ||
					this.state.data.place === undefined)
					this.state._unmout && this.setState({redirectToEdit: true});
			})
			.catch(err => {
			})
		}
	}

	

	render() {
		
			return (
			<div>
				
				{this.state.redirectToEdit && <Redirect to="/profile/edit" />}
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

