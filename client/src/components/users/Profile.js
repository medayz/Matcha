import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Fjla from "../../backIndex.jpg";
import Account from "@material-ui/icons/AccountCircle";
import Location from "@material-ui/icons/LocationCity";
import Gender from "@material-ui/icons/SupervisedUserCircle";
import Help from "@material-ui/icons/Help";
import Thumb from "@material-ui/icons/ThumbsUpDown";
import Info from "@material-ui/icons/Info";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";

const useStyles = makeStyles(theme => ({
  bigAvatar: {
    margin: 10,
    width: 200,
    height: 200
  },
  root: {
    padding: theme.spacing(3, 2)
  },
  card: {
    maxWidth: 345
  }
}));

const paddingImg = {

};


export default function Profile() {
  
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className="container">
        <div className="row">
          <div className="col-md-2" />
          <div className="col-md-3">
            <center>
              <Avatar
                alt="Remy Sharp"
                src={Fjla}
                className={classes.bigAvatar}
              />
            </center>
          </div>
          <div className="col-md-2" />
          <div className="col-md-5">
            <List className={classes.root}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <Account />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="cmarouan" secondary="Marouane Chakour" />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <Location />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Location" secondary="1337, Khouribga" />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <Gender />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Gender" secondary="Male" />
              </ListItem>
            </List>
          </div>
        </div>        
        <div className="row">
          <div className="col-md-3" />
          <div className="col-md-7">
          <List className={classes.root}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <Thumb />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Fame rating" secondary="100%" />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <Help />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Biography" secondary="student in 1337, Khouribga" />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <Info />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="tages" secondary="Male, coding, sport, raja casablanca" />
              </ListItem>
            </List>
            </div>
          <div className="col-md-2" />
        </div>
        <div className="row">
          <div className="col-md-4" />
          <div className="col-md-5">
            <center>
              <div className="alert alert-primary" role="alert">
                Snap
              </div>
            </center>
          </div>
          <div className="col-md-3" />
        </div>
        <div className="row">
          <div className="col-md-3" />
          <div className="col-md-7">
            <div
              id="carouselExampleControls"
              className="carousel slide"
              data-ride="carousel"
              style={paddingImg}
            >
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <img src={Fjla} className="d-block w-100" alt="..." />
                </div>
                <div className="carousel-item">
                  <img src={Fjla} className="d-block w-100" alt="..." />
                </div>
                <div className="carousel-item">
                  <img src={Fjla} className="d-block w-100" alt="..." />
                </div>
              </div>
              <a
                className="carousel-control-prev"
                href="#carouselExampleControls"
                role="button"
                data-slide="prev"
              >
                <span className="carousel-control-prev-icon" aria-hidden="true" />
                <span className="sr-only">Previous</span>
              </a>
              <a
                className="carousel-control-next"
                href="#carouselExampleControls"
                role="button"
                data-slide="next"
              >
                <span className="carousel-control-next-icon" aria-hidden="true" />
                <span className="sr-only">Next</span>
              </a>
            </div>
          </div>
          <div className="col-md-2" />
        </div>
      </div>
    </div>
  );
}
