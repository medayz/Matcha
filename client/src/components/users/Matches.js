import React, { Component } from "react";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import RestoreIcon from "@material-ui/icons/Restore";
import FavoriteIcon from "@material-ui/icons/Favorite";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import Fjla from "../../backIndex.jpg";
import axios from "axios";
import Profileuser from './Profileuser';
import { Redirect } from 'react-router';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';


const pStyle = {
  marginTop: '5%',
};

const styleFilter = {
  backgroundColor : 'white',
  padding : '5%',
  margin: '1%',
  width : '253px'
}

const stylebtn = {
  width: '100%',
  margin: '0.3%',
  marginTop: '3%'
}

class Matches extends Component {

  state = {
    redirect : false,
    dataprofile : {},
    agefilter: [0,100],
    tagsFilter : [0],
    distanceFilter : [0],
    tokenErr : false
  }

  changeSorting = () => {
    //alert("Sorting");
  };

  toProfile = async (username) => {
    
    await axios
    .get(`api/users/get/iouzzine`)
    .then (res => {
      console.log(res.data.data);
      this.setState({dataprofile: res.data.data});
    })
    .catch (err => {
      this.setState({tokenErr : true});
    });
    this.setState({redirect : true});
  }

  filterAge = (e, newValue) => {
    this.setState({agefilter: newValue});
  };

  filterLocation = (e, newValue) => {
    this.setState({distanceFilter : newValue});
  };

  filterTags = (e, newValue) => {
    this.setState({tagsFilter: newValue});
  };

  filter = () => {
    let obj = {
      age : this.state.agefilter,
      distance: this.state.distanceFilter[0],
      tags: this.state.tagsFilter[0]
    }
    console.log(obj);
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
            <div className="row"><FormLabel component="legend">Sort By</FormLabel></div>
            <div className="row"> <BottomNavigation
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
              </BottomNavigation></div>
            </div>
            <div className="col-md-2" />
            <div className="col-md-4">
              <FormControl component="fieldset" style={styleFilter}>
                <FormLabel component="legend">Filter</FormLabel>
                <FormGroup>
                  <Typography id="range-slider" gutterBottom>
                    Age
                  </Typography>
                  <Slider

                    value={this.state.agefilter}
                    onChange={this.filterAge}
                    valueLabelDisplay="auto"
                    aria-labelledby="range-slider"
                  />
                  <Typography id="range-slider" gutterBottom>
                    Distance
                  </Typography>
                  <Slider
                    value={this.state.distanceFilter}
                    onChange={this.filterLocation}
                    valueLabelDisplay="auto"
                    min={0}
                    max={20}
                    aria-labelledby="range-slider"
                  />
                  <Typography id="range-slider" gutterBottom>
                    Tags
                  </Typography>
                  <Slider
                    value={this.state.tagsFilter}
                    onChange={this.filterTags}
                    valueLabelDisplay="auto"
                    min={0}
                    max={10}
                    aria-labelledby="range-slider"
                  />
                </FormGroup>
                <button className="btn btn-primary" onClick={this.filter} style={stylebtn}>Filter</button>
              </FormControl>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="card">
                <img
                  src="https://cdn.intra.42.fr/users/large_iouzzine.jpg"
                  className="card-img-top"
                  height="200"
                  alt="..."
                />
                <div className="card-body">
                  <h5 className="card-title">Ismail ouzzine</h5>
                  <p className="card-text">
                    My biography
                  </p>
                  <button className="btn btn-primary" onClick={() => this.toProfile("iouzzine")}>See profile</button>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <img
                  src={Fjla}
                  className="card-img-top"
                  height="200"
                  alt="..."
                />
                <div className="card-body">
                  <h5 className="card-title">sfax telbsax</h5>
                  <p className="card-text">
                    My biography
                  </p>
                  <button className="btn btn-primary">See profile</button>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <img
                  src={Fjla}
                  className="card-img-top"
                  height="200"
                  alt="..."
                />
                <div className="card-body">
                  <h5 className="card-title">sfax telbsax</h5>
                  <p className="card-text">
                    My biography
                  </p>
                  <button className="btn btn-primary">See profile</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Matches;
