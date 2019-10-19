import React, { Component } from "react";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import RestoreIcon from "@material-ui/icons/Restore";
import FavoriteIcon from "@material-ui/icons/Favorite";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import FormLabel from "@material-ui/core/FormLabel";
import axios from "axios";
import Profileuser from './users/Profileuser';
import SuggestionCard from './SuggestionCard';
import Filters from './Filters';
import { Redirect } from 'react-router';


const pStyle = {
	marginTop: '5%',
};

class Home extends Component {

	state = {
		redirect : false,
		dataprofile : {},
		suggestions: [],
		tokenErr : false
	}

	changeSorting = () => {
		//alert("Sorting");
	};

	getSuggestions = (filters) => {
		
	};

	toProfile = async (username) => {
		axios.get(`api/users/get/iouzzine`)
			.then (res => {
				console.log(res.data.data);
				this.setState({dataprofile: res.data.data});
			})
			.catch (err => {
				this.setState({tokenErr : true});
			});
		this.setState({redirect : true});
	}

	filter = (filters) => {
		axios
			.post('/api/users/filter')
			.then(res => {
				console.log(res.data.data);
				this.setState({ suggestions: res.data.data });
			})
			.catch(err => console.log(err));
	}

	render() {
		return (
			<div>
				{this.state.tokenErr && <Redirect to="/login" />}
				{this.state.redirect && <Redirect to={{pathname: `/profile/iouzzine`,state: {userprofile: this.state.dataprofile }}} Component={Profileuser} />}
				<div className="container">
					<div className="row" >
						<div className="col-md-1" />
						<div className="col-md-5" style={pStyle}>
						<div className="row">
							<FormLabel component="legend">Sort By</FormLabel>
						</div>
						<div className="row">
							<BottomNavigation
								value="SortBar"
								onChange={this.changeSorting}
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
							/>
						))}
					</div>
				</div>
			</div>
		);
	}
}

export default Home;
