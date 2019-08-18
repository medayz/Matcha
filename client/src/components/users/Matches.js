import React, { Component } from "react";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import RestoreIcon from "@material-ui/icons/Restore";
import FavoriteIcon from "@material-ui/icons/Favorite";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Fjla from "../../backIndex.jpg";


const pStyle = {
  marginTop: '5%',
};

class Matches extends Component {
  changeSorting = () => {
    //alert("Sorting");
  };

  handleChange = () => {};

  render() {
    return (
      <div>
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
              <FormControl component="fieldset">
                <FormLabel component="legend">Filter</FormLabel>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={false}
                        color="primary"
                        onChange={this.handleChange()}
                        value="age"
                      />
                    }
                    label="Age"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={false}
                        color="primary"
                        onChange={this.handleChange()}
                        value="rating"
                      />
                    }
                    label="Rating"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={false}
                        color="primary"
                        onChange={this.handleChange()}
                        value="location"
                      />
                    }
                    label="Location"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={true}
                        color="primary"
                        onChange={this.handleChange()}
                        value="tags"
                      />
                    }
                    label="Tags"
                  />
                </FormGroup>
              </FormControl>
            </div>
          </div>
          <div className="row">
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
