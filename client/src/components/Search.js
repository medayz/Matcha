import React, { Component, useState } from 'react'
import Paper from '@material-ui/core/Paper';
import '../css/search.css';
import GoogleMaps from './MapsInput';
import TagsChoose from './TagsChooseTags';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import SuggestionCard from './SuggestionCard';

const filterColor = {
    color: 'pink',
}

const spanStyle = {
    fontSize: 'x-large',
    color: 'pink'
}

const marg = {
    marginTop: '10px'
}

const BarTop = () => {
    
    const [ageFilter, setageFilter] = useState([18, 55]);

    const [fame, setFame] = useState([0, 100]);

    const [activeSort, setactiveSort] = useState(false)

    const filterAge = (e, newValue) => {
		setageFilter(newValue);
	};

	const filterFame = (e, newValue) => {
		setFame(newValue);
	};

    const search = () => {
        setactiveSort(true);
    }

    return (
        <div>
            <Paper id="divSearch">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <center>
                                <span style={spanStyle}>Search</span>
                            </center>
                        </div>
                    </div>
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
                            <Button onClick={search} variant="contained" style={{float: 'left',backgroundColor: 'pink', color: 'white'}}>
                                Search
                            </Button>
                        </div>
                    </div>
                </div>
            </Paper>
            <br />
            {activeSort && <div className="container-fluid">
                <div className="row">
                    <div className="col-md-3">
                        <Paper id="divSearch">
                            <center>
                                <span style={spanStyle}>Sort</span>
                            </center>
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
                                <SuggestionCard
                                    img="IMG-1571667612202.jpg"
                                    username="cmarouan"
                                    age="21"
                                    ntags="1"
                                    distance="2"
                                    fameRating="10"
                                    //toProfile={() => this.toProfile('cmarouan')}
                                />
                                <SuggestionCard
                                    img="IMG-1571667612202.jpg"
                                    username="cmarouan"
                                    age="21"
                                    ntags="1"
                                    distance="2"
                                    fameRating="10"
                                    //toProfile={() => this.toProfile('cmarouan')}
                                />
                                <SuggestionCard
                                    img="IMG-1571667612202.jpg"
                                    username="cmarouan"
                                    age="21"
                                    ntags="1"
                                    distance="2"
                                    fameRating="10"
                                    //toProfile={() => this.toProfile('cmarouan')}
                                />
                                <SuggestionCard
                                    img="IMG-1571667612202.jpg"
                                    username="cmarouan"
                                    age="21"
                                    ntags="1"
                                    distance="2"
                                    fameRating="10"
                                    //toProfile={() => this.toProfile('cmarouan')}
                                />
                                <SuggestionCard
                                    img="IMG-1571667612202.jpg"
                                    username="cmarouan"
                                    age="21"
                                    ntags="1"
                                    distance="2"
                                    fameRating="10"
                                    //toProfile={() => this.toProfile('cmarouan')}
                                />
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
