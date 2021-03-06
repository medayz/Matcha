import React, { Component } from "react";
import Chip from "@material-ui/core/Chip";
import CreatableSelect from "react-select/creatable";
import RegisterInput from "../RegisterInput";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import { getAllTags } from "../../../helpers/getAllTags";
import { getUserTags } from "../../../helpers/getUserTags";
import { addTags } from "../../../helpers/addTags";
import { btnColor, tagsColor } from "../../../css/styleClasses";
import GoogleMaps from '../../MapsInput';

const tagsErrorStyle = {
  color: "red"
};

const red = {
  color : "red"
}

const genderMapping = {
  Men: "Male",
  Women: "Female",
  Everyone: "Everyone",
  Male: "Men",
  Female: "Women"
};

export default class EditInfos extends Component {
  state = {
    fName: "",
    lName: "",
    gender: "",
    birthDate: "",
    sexualPref: "",
    activeLocation: false,
    bio: "",
    msg1: "",
    tokenErr: "",
    errState: {},
    options: [],
    optionsUser: [],
    tagsExit: "",
    visible: false,
    genderArr: ["Male", "Female", "Other"],
    sexual: ["Men", "Women", "Everyone"],
    location: ''
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  onChangeTags = async newValue => {
    this.setState({
      tagsExit: ""
    });
    if (newValue) {
      var Tags = {
        tagName: newValue.value
      };
      var Tag = {
        value: newValue.value,
        label: newValue.value
      };
      let alltags = this.state.options.filter(tg => tg.value !== Tag.value);
      var neww = [...alltags, Tag];
      this.setState({
        options: neww
      });
      addTags(Tags)
        .then(({ data }) => {
          this.calluserTags();
        })
        .catch(err => {
          this.setState({
            tagsExit: "error"
          });
          this.setState({
            options: []
          });
        });
    }
  };
  clearErrorState = () => {
    this.setState({
      tagsExit: ""
    });
    this.setState({
      errState: {}
    });
    this.setState({
      msg1: ""
    });
  };
  callTags = async () => {
    await getAllTags().then(({ data }) => {
      this.setState({
        options: data.data.map(tag => {
          return {
            value: tag.props.name,
            label: tag.props.name
          };
        })
      });
      let yFilter = this.state.optionsUser.map(itemY => {
        return itemY.value;
      });
      let filteredTags = this.state.options.filter(
        itemX => !yFilter.includes(itemX.value)
      );
      this.setState({
        options: filteredTags
      });
    });
  };
  calluserTags = () => {
    getUserTags(this.props.username).then(({ data }) => {
      this.setState({
        optionsUser: data.data.map(tag => {
          return {
            value: tag.props.name,
            label: tag.props.name
          };
        })
      });
    });
  };
  ondeleteTag = async (tagName) => {
    let tags =  this.state.optionsUser;
    delete tags[tags.indexOf(tagName)];
    this.setState({optionsUser: tags});
    let obj = {
      tagName: tagName.value,
    }
    await axios.post('/api/users/delete/tag', obj)
    .then(res => {
    })
    .catch(err => {});
  };

  filterLocation = (e) => {
    this.setState({ location: e.target.value });
  }

  handleBirthday = e => {
    this.setState({ birthDate: e.currentTarget.value });
  };

  handleActiveNotif = e => {
    this.setState({ activeLocation: e.currentTarget.value });
  };

  handleGender = e => {
    this.setState({ gender: e.currentTarget.value });
  };

  handleSexual = e => {
    this.setState({ sexualPref: e.currentTarget.value });
  }

  async UNSAFE_componentWillMount() {
    const res = await axios.get(`/api/users/get`);
    if (res.data.data) {
      const user = res.data.data;
      user.fName && this.setState({ fName: user.fName });
      user.lName && this.setState({ lName: user.lName });
      user.gender && this.setState({ gender: user.gender });
      user.bio && this.setState({ bio: user.bio });
      user.sexualPref && this.setState({ sexualPref: genderMapping[user.sexualPref] });
      user.birthDate && this.setState({ birthDate: user.birthDate });
      user.place && this.setState({location: user.place});
      this.setState({ visible: true });
      this.callTags();
      this.calluserTags();
    }
  }

  editInfo = async e => {
    e.preventDefault();
    this.clearErrorState();
    const usr = {
      fName: this.state.fName,
      lName: this.state.lName,
      gender: this.state.gender,
      activeLocation: this.state.activeLocation,
      bio: this.state.bio,
      birthDate: this.state.birthDate,
      sexualPref: genderMapping[this.state.sexualPref]
    };
    if (usr.activeLocation === "1") usr.activeLocation = true;
    else usr.activeLocation = false;
    this.setState({
      activeLocation: usr.activeLocation
    });
    axios
      .put(
        `/api/users/edit/infos`,
        usr
      )
      .then(async res => {
        axios
          .post('/api/users/add/location', { place: this.state.location })
          .then(res => {
            this.setState({
              msg1: "Modified !"
            });
          })
          .catch(err => {});
        
      })
      .catch(err => {
        const backend = err.response.data;
        if (backend.status === 400)
          this.setState({
            errState: backend.data.err
          });
        else if (backend.status === 401) {
          this.setState({
            tokenErr: backend.msg
          });
        }
      });
  };

  render() {
    return (
      <div>
        <br />
        <div className="profile-content">
          <form onSubmit={this.editInfo}>
            <div className="row">
              <div className="col">
                {" "}
                {this.state.visible !== "" && (
                  <RegisterInput
                    label="First name"
                    type="text"
                    name="fName"
                    id="fName"
                    value={this.state.fName}
                    placeholder="Enter first name"
                    err={this.state.errState.fName}
                    onChange={this.onChange}
                  />
                )}{" "}
              </div>{" "}
              <div className="col">
                {" "}
                {this.state.visible !== "" && (
                  <RegisterInput
                    label="Last name"
                    type="text"
                    name="lName"
                    id="lName"
                    value={this.state.lName}
                    placeholder="Enter last name"
                    err={this.state.errState.lName}
                    onChange={this.onChange}
                  />
                )}{" "}
              </div>{" "}
            </div>{" "}
            <br />
            <div className="row">
              <div className="col">
                <label>  <span style={red}>*</span>Gender </label>{" "}
                <select
                  id="gender"
                  value={this.state.gender}
                  onChange={this.handleGender}
                  className="form-control"
                >

                  {this.state.gender === "" && <option>-</option>}
                  {this.state.genderArr.map((gen, index) => 
                    <option value={gen} key={index} disabled={gen === this.state.gender ? true : false}> {gen} </option>
                  )}
                </select>{" "}
              </div>{" "}
              <div className="col">
                {" "}
                {this.state.visible !== "" && (
                  <div>
                    <label>  <span style={red}>*</span>You are looking for </label>
                    <select
                      id="sexualPref"
                      value={this.state.sexualPref}
                      onChange={this.handleSexual}
                      className="form-control"
                    >
                      {this.state.sexualPref === "" && <option>-</option>}
                      {this.state.sexual.map((gen, index) => 
                        <option value={gen} key={index} disabled={gen === this.state.sexualPref ? true : false}> {gen} </option>
                      )}
                    </select>
                  </div>
                )}{" "}
              </div>{" "}
            </div>{" "}
            <br />
            <div className="row">
              <div className="col">
                {" "}
                {this.state.visible !== "" && (
                  <div className="row">
                    <div className="col-md-12"> 
                      <label> <span style={red}>*</span>Choose your Location</label>
                      <span> (current: {this.state.location})</span>
								      <GoogleMaps inputValue={this.state.location} handleChange={this.filterLocation} />
                    </div>
                  </div>
                )}{" "}
              </div>{" "}
            </div>{" "}
            <br />
            <div className="row">
              <div className="col-md-12">
                <label>
                  <small> <span style={red}>*</span>Your birth Date </small> {this.state.birthDate}{" "}
                </label>{" "}
                <br />{" "}
                {this.state.visible !== "" && (
                  <TextField
                    style={{width : '100%'}}
                    id="date"
                    type="date"
                    variant="outlined"
                    onChange={this.handleBirthday}
                    defaultValue={this.state.birthDate}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                )}{" "}
                {this.state.errState.birthDate && <span style={{color: 'red'}}>{this.state.errState.birthDate}</span>}
              </div>{" "}
            </div>{" "}
            <br />
            <div className="row">
              <div className="col">
                <label> Biography </label>{" "}
                {this.state.visible !== "" && (
                  <textarea
                    className="form-control"
                    id="bio"
                    rows="3"
                    name="bio"
                    placeholder="Bio"
                    value={this.state.bio}
                    onChange={this.onChange}
                  />
                )}{" "}
              </div>{" "}
            </div>{" "}
            <br />
            <div className="row">
              <div className="col" style={{color: "black"}}>
                <label style={{color: "white"}}>  <span style={red}>*</span>Add tags <small style={red}>(At least one tag)</small></label>{" "}
                <CreatableSelect
                  isClearable
                  onChange={this.onChangeTags}
                  options={this.state.options}
                />{" "}
                {this.state.tagsExit && (
                  <small style={tagsErrorStyle}> Tags aleardy exist </small>
                )}{" "}
              </div>{" "}
            </div>{" "}
            <br />
            <div className="row">
              <div className="col">
                <label> My tags </label> <br />{" "}
                {this.state.optionsUser.map(tag => {
                  return (
                    <Chip
                      key={tag.label}
                      label={tag.label}
                      value={tag.value}
                      onChange={this.handleChangeTag}
                      onDelete={(e) => this.ondeleteTag(tag)}
                      className="mr-1 mb-1"
                      style={tagsColor}
                    />
                  );
                })}{" "}
              </div>{" "}
            </div>{" "}
            <br />
            <div className="row">
              <div className="col">
                <button type="submit" className="btn" style={btnColor}>
                  Save{" "}
                </button>{" "}
              </div>{" "}
              <div className="col">
                {" "}
                {this.state.msg1 && (
                  <div className="alert alert-primary" role="alert">
                    {" "}
                    {this.state.msg1}{" "}
                  </div>
                )}{" "}
              </div>{" "}
            </div>{" "}
          </form>{" "}
        </div>{" "}
      </div>
    );
  }
}
