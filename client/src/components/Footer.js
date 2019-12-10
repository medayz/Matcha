import React, { Component } from "react";

const spanStyle = {
    paddingBottom: '2%'
}

const footer =  {
    
    bottom: '0px',
    width: '100%',
    height: '2.5rem',
    color: 'pink',
    marginBottom: '1.5rem'
}

class Footer extends Component {

  render() {
    return (
        <div className="container-fluid" style={footer}>
            <div className="row">
                <div className="col-md-1" />
                <div className="col-md-10">
                    <hr />
                    <span style={spanStyle}>
                        <center>
                            Copyright © 2019, Made by Mohamed Ayoub Zahir, Marouane Chakour 
                        </center>
                    </span>
                </div>
                <div className="col-md-1" />
            </div>
        </div>
    );
  }
}

export default (Footer);
