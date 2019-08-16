import React, {
  Component
} from "react";
import Chip from "@material-ui/core/Chip";
import CreatableSelect from "react-select/creatable";
import RegisterInput from "../RegisterInput";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import {
  getter
} from "../../../helpers/tokenOperation";
import {
  getAllTags
} from "../../../helpers/getAllTags";
import {
  getUserTags
} from "../../../helpers/getUserTags";
import {
  addTags
} from "../../../helpers/addTags";
const head = {
  "auth-token": getter("token"),
  Accept: "application/json",
  "Content-Type": "application/json"
};
const tagsErrorStyle = {
  color: 'red'
};
export default class EditInfos extends Component {
  state = {
    fName: "",
    lName: "",
    gender: "",
    location: "",
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
    visible: false
  };
  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  onChangeTags = async newValue => {
    this.setState({
      tagsExit: ''
    });
    if (newValue) {
      var Tags = {
        tagName: newValue.value
      };
      var Tag = {
        value: newValue.value,
        label: newValue.value
      };
      var neww = [...this.state.options, Tag];
      this.setState({
        options: neww
      });
      addTags(Tags, head)
        .then(({
          data
        }) => {
          this.calluserTags();
          this.callTags();
        })
        .catch(err => {
          this.setState({
            tagsExit: 'error'
          });
          this.setState({
            options: []
          });
        });
    }
  };
  clearErrorState = () => {
    this.setState({
      tagsExit: ''
    });
    this.setState({
      errState: {}
    });
    this.setState({
      msg1: ""
    });
  };
  callTags = async () => {
    await getAllTags().then(({
      data
    }) => {
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
    getUserTags(this.props.username).then(({
      data
    }) => {
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
  ondeleteTag = () => {
    console.log(this.state.optionsUser);
    console.log("tag will be deleted");
  };

  async componentWillMount() {
    const user = this.props.username;
    this.calluserTags(this.state.user);
    this.setState({
      username: user
    });
    await axios.get(`http://localhost:1337/api/users/get/${user}`).then(res => {
      if (res.data.data.props) {
        const user = res.data.data.props;
        if (user.fName)
          this.setState({
            fName: user.fName
          });
        if (user.lName)
          this.setState({
            lName: user.lName
          });
        if (user.gender)
          this.setState({
            gender: user.gender
          });
        if (user.location)
          this.setState({
            location: user.location
          });
        if (user.bio)
          this.setState({
            bio: user.bio
          });
        if (user.sexualPref)
          this.setState({
            sexualPref: user.sexualPref
          });
        if (user.birthDate)
          this.setState({
            birthDate: user.birthDate
          });
        this.setState({
          visible: true
        });
        this.callTags();
      }
    });
  }
  editInfo = async e => {
    e.preventDefault();
    this.clearErrorState();
    const usr = {
      fName: this.state.fName,
      lName: this.state.lName,
      gender: this.state.gender,
      location: this.state.location,
      activeLocation: this.state.activeLocation,
      bio: this.state.bio,
      birthDate: this.state.birthDate,
      sexualPref: this.state.sexualPref
    };
    if (usr.activeLocation === "1") usr.activeLocation = true;
    else usr.activeLocation = false;
    this.setState({
      activeLocation: usr.activeLocation
    });
    await axios
      .put(`http://localhost:1337/api/users/edit/infos`, usr, {
        headers: head
      })
      .then(res => {
        this.setState({
          msg1: res.data.msg
        });
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
    return ( <
        div >
        <
        div className = "profile-content" >
        <
        form onSubmit = {
          this.editInfo
        } >
        <
        div className = "row" >
        <
        div className = "col" > {
          " "
        } {
          this.state.visible !== "" && ( <
            RegisterInput label = "First name"
            type = "text"
            name = "fName"
            id = "fName"
            value = {
              this.state.fName
            }
            placeholder = "Enter first name"
            err = {
              this.state.errState.fName
            }
            onChange = {
              this.onChange
            }
            />
          )
        } {
          " "
        } <
        /div>{" "} <
        div className = "col" > {
          " "
        } {
          this.state.visible !== "" && ( <
            RegisterInput label = "Last name"
            type = "text"
            name = "lName"
            id = "lName"
            value = {
              this.state.lName
            }
            placeholder = "Enter last name"
            err = {
              this.state.errState.lName
            }
            onChange = {
              this.onChange
            }
            />
          )
        } {
          " "
        } <
        /div>{" "} < /
        div > {
          " "
        } <
        br / >
        <
        div className = "row" >
        <
        div className = "col" >
        <
        label > Gender < /label>{" "} <
        select id = "gender"
        defaultValue = {
          this.state.gender
        }
        onChange = {
          this.handleGender
        }
        className = "form-control" >
        <
        option value = "Male" > Male < /option>{" "} <
        option value = "Female" > Female < /option>{" "} <
        option value = "Other" > Other < /option>{" "} < /
        select > {
          " "
        } <
        /div>{" "} <
        div className = "col" > {
          " "
        } {
          this.state.visible !== "" && ( <
            RegisterInput label = "sexualPref"
            type = "text"
            name = "sexualPref"
            id = "sexualPref"
            value = {
              this.state.sexualPref
            }
            placeholder = "Enter your sexualPref"
            err = {
              this.state.errState.sexualPref
            }
            onChange = {
              this.onChange
            }
            />
          )
        } {
          " "
        } <
        /div>{" "} < /
        div > {
          " "
        } <
        br / >
        <
        div className = "row" >
        <
        div className = "col" > {
          " "
        } {
          this.state.visible !== "" && ( <
            RegisterInput label = "Location"
            type = "text"
            name = "location"
            id = "location"
            value = {
              this.state.location
            }
            placeholder = "Enter your location"
            err = {
              this.state.errState.location
            }
            onChange = {
              this.onChange
            }
            />
          )
        } {
          " "
        } <
        /div>{" "} < /
        div > {
          " "
        } <
        br / >
        <
        div className = "row" >
        <
        div className = "col" >
        <
        label >
        <
        small > Your birthDay < /small> {this.state.birthDate}{" "} < /
        label > {
          " "
        } <
        br / > {
          " "
        } {
          this.state.visible !== "" && ( <
            TextField id = "date"
            type = "date"
            onChange = {
              this.handleBirthday
            }
            defaultValue = {
              this.state.birthDate
            }
            InputLabelProps = {
              {
                shrink: true
              }
            }
            />
          )
        } {
          " "
        } <
        /div>{" "} <
        div className = "col" >
        <
        label > Active location < /label>{" "} <
        select onChange = {
          this.handleActiveNotif
        }
        id = "activeNotf"
        defaultValue = {
          ""
        }
        className = "form-control" >
        <
        option value = "1" > True < /option>{" "} <
        option value = "0" > False < /option>{" "} < /
        select > {
          " "
        } <
        /div>{" "} < /
        div > {
          " "
        } <
        br / >
        <
        div className = "row" >
        <
        div className = "col" >
        <
        label > Biography < /label>{" "} {
        this.state.visible !== "" && ( <
          textarea className = "form-control"
          id = "bio"
          rows = "3"
          name = "bio"
          placeholder = "Bio"
          value = {
            this.state.bio
          }
          onChange = {
            this.onChange
          }
          />
        )
      } {
        " "
      } <
      /div>{" "} < /
    div > {
        " "
      } <
      br / >
      <
      div className = "row" >
      <
      div className = "col" >
      <
      label > Add tags < /label>{" "} <
    CreatableSelect isClearable onChange = {
      this.onChangeTags
    }
    //onInputChange={this.handleInputChange}
    options = {
      this.state.options
    }
    />{" "} {
    this.state.tagsExit &&
      <
      small style = {
        tagsErrorStyle
      } > Tags aleardy exist < /small>} < /
    div > {
        " "
      } <
      /div>{" "} <
    br / >
      <
      div className = "row" >
      <
      div className = "col" >
      <
      label > My tags < /label> <br / > {
        " "
      } {
        this.state.optionsUser.map(tag => {
          return ( <
            Chip key = {
              tag.label
            }
            label = {
              tag.label
            }
            value = {
              tag.value
            }
            onDelete = {
              this.ondeleteTag
            }
            onChange = {
              this.handleChangeTag
            }
            className = ""
            color = "primary" /
            >
          );
        })
      } {
        " "
      } <
      /div>{" "} < /
    div > {
        " "
      } <
      br / >
      <
      div className = "row" >
      <
      div className = "col" >
      <
      button type = "submit"
    className = "btn btn-primary" >
      Save {
        " "
      } <
      /button>{" "} < /
    div > {
        " "
      } <
      div className = "col" > {
        " "
      } {
        this.state.msg1 && ( <
          div className = "alert alert-primary"
          role = "alert" > {
            " "
          } {
            this.state.msg1
          } {
            " "
          } <
          /div>
        )
      } {
        " "
      } <
      /div>{" "} < /
    div > {
        " "
      } <
      /form>{" "} < /
    div > {
        " "
      } <
      /div>
  );
}
}