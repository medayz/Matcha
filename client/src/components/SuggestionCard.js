import React from 'react';

const propsStyle = {
    fontWeight: 'bold'
};

function SuggestionCard(props) {
    return (
        <div className="col-md-4">
            <div className="card">
                <img
                    src={`userPics/${props.img}`}
                    className="card-img-top img-fluid"
                    alt="user suggestion card"
                />
                <div className="card-body">
                    <h5 className="card-title">{props.username}</h5>
                    <p className="card-text">
                        <span style={propsStyle}>Age: </span>{props.age} yo<br />
                        <span style={propsStyle}>Distance: </span>{props.distance} Km<br />
                        <span style={propsStyle}>Common tags: </span>{props.ntags} tags<br />
                    </p>
                    <button className="btn btn-primary" onClick={props.toProfile}>See profile</button>
                </div>
            </div>
        </div>
    );
}

export default SuggestionCard;