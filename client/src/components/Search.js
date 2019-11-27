import React, { Component, useState } from 'react'
import Paper from '@material-ui/core/Paper';
import '../css/search.css';
import GoogleMaps from './MapsInput';
import TagsChoose from './TagsChooseTags';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';

const filterColor = {
    color: 'pink',
}


const marg = {
    marginTop: '10px'
}

const BarTop = () => {
    
    const [ageFilter, setageFilter] = useState([18, 55]);

    const [fame, setFame] = useState([0, 100]);

    const filterAge = (e, newValue) => {
		setageFilter(newValue);
	};

	const filterFame = (e, newValue) => {
		setFame(newValue);
	};

    return (
        <Paper id="divSearch">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-6">
                        <div className="row">
                            <div className="col-md-12" style={marg}>
                                <GoogleMaps />
                            </div>
                            <div className="col-md-12" style={marg}>
                                <TagsChoose />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="row">
                            <div className="col-md-12" style={marg}>
                                <Typography id="range-slider" gutterBottom>Age</Typography>
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
                            <div className="col-md-12" style={marg}>
                                <Typography id="continuous-slider" style={{color: "black"}} gutterBottom>Fame Rating</Typography>
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
                        <Button variant="contained" style={{backgroundColor: 'pink', color: 'white'}}>
                            Search
                        </Button>
                    </div>
                </div>
            </div>
        </Paper>
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
                    <br />
                    <div className="col-md-12">
                        
                    </div>
                </div>
            </div>
        )
    }
}
