import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Profileuser from './users/Profileuser';
import { Redirect } from 'react-router';

const MyCard = (props) => {

    const [user, setuser] = useState({});
    const [photo, setPhoto] = useState(null);
    const [redirect, setredirect] = useState(false);
    const [unblock, setunblock] = useState(false);
    const [cleanup, setcleanup] = useState(true)

    const toProfile = () => {
        setredirect(true);
    }

    const unBlock = () => {
        axios.get(`/api/users/unblockUser/${user.username}`)
        .then(res => {
            setunblock(true);
        })
        .catch(err => {
            console.log(err);
        });
    }

    useEffect(() => {
        const user = props.user.props;
        cleanup && setuser(user);
        axios.get(`/api/pics/get/${user.username}`)
        .then(res => {
            let pic = res.data.data.filter(p => p.ispp === 'true');
            if (pic.length > 0)
                cleanup && setPhoto(pic[0].filename);
        })
        .catch(err => {
            console.log(err);
        });
        return () => {
            setcleanup(false);
        };
    }, [cleanup, props]);

    return (
        <Card style={{marginButtom: '2%'}}>
            <CardContent>
                <Typography variant="h5" component="h2">
                    <span style={{color: 'pink'}}>{user.username}</span>
                    {photo !== null && <Avatar style={{float: 'right'}} alt={user.username} src={`http://localhost:1337/userPics/${photo}`} />}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                    {`${user.fName} ${user.lName}`}
                </Typography>
                <Typography color="textSecondary">
                    {`Gender: ${user.gender}`}
                </Typography>
                <Typography color="textSecondary">
                    {`Looking for: ${user.sexualPref}`}
                </Typography>
                <Typography color="textSecondary">
                    {`Adress: ${user.place}`}
                </Typography>
            </CardContent>
            <CardActions>
                {!props.block && <Button onClick={toProfile} style={{backgroundColor: 'pink', color: 'white'}} size="small">See profile</Button>}
                {props.block && <Button onClick={unBlock} style={{backgroundColor: 'pink', color: 'white'}} size="small">Unblock</Button>}
                {redirect && <Redirect to={
					{
						pathname: `/profile/${user.username}`,
						state: {userprofile: user }
					}
                } Component={Profileuser} />}
                {unblock && <Redirect to={
					{
						pathname: `/profile/${user.username}`,
						state: {userprofile: user }
					}
				} Component={Profileuser} />}
            </CardActions>
        </Card>
    );
}

const Who = () => {

    const [blocked, setBlocked] = useState([]);
    const [viewed, setviewed] = useState([]);
    const [myvisits, setmyvisits] = useState([]);
    const [matched, setmatched] = useState([]);
    const [liked, setliked] = useState([]);
    const [toEdit, setToEdit] = useState(false);
    const [likedme, setlikedme] = useState([]);
    
    const likedUser = () => {
        axios.get('/api/users/likedMe')
        .then(res => {
            let data = res.data.data;
            setlikedme(data);
        })
        .catch(err => {
        });
    }

    const myVisits = () => {
        axios.get('/api/users/myVisits')
        .then(res => {
            let data = res.data.data;
            setmyvisits(data);
        })
        .catch(err => {
        });
    }

    const likedMe = () => {
        axios.get('/api/users/likedUser')
        .then(res => {
            let data = res.data.data;
            setliked(data);
        })
        .catch(err => {
        });
    }

    const matchedUser = () => {
        axios.get('/api/users/matchedUser')
        .then(res => {
            let data = res.data.data;
            setmatched(data);
        })
        .catch(err => {
        });
    }

    const viewedUser = () => {
        axios.get('/api/users/viewedUser')
        .then(res => {
            let data = res.data.data;
            setviewed(data);
        })
        .catch(err => {
        });
    }

    const blockedUser = () => {
        axios.get('/api/users/blockedUser')
        .then(res => {
            let data = res.data.data;
            setBlocked(data);
        })
        .catch(err => {
        });
    }

 

    useEffect(() => {
        axios
		.get('/api/users/completed')
		.then (res => {
			likedUser();
            viewedUser();
            matchedUser();
            blockedUser();
            likedMe();
            myVisits();
		})
		.catch(err => {
			setToEdit(true);
		});
    }, [])
    
    return (
        <div className="conatiner">
            <br />
            {toEdit && <Redirect to='/profile/edit'/>}
            <div className="row">
                <div className="col-md-2"></div>
                <div className="col-md-8">
                    <h1 style={{textAlign: 'center'}}>Who ?</h1>
                    <br />
                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <li className="nav-item">
                            <a className="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Matched users</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" id="username-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Viewed My profile</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" id="username-tab" data-toggle="tab" href="#visits" role="tab" aria-controls="profile" aria-selected="false">My visits</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" id="email-tab" data-toggle="tab" href="#mail" role="tab" aria-controls="contact" aria-selected="false">Blocked users</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" id="email-tab" data-toggle="tab" href="#likes" role="tab" aria-controls="contact" aria-selected="false">Liked users</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" id="email-tab" data-toggle="tab" href="#likeme" role="tab" aria-controls="contact" aria-selected="false">Liked me</a>
                        </li>
                    </ul>
                    <div className="tab-content" id="myTabContent">
                        <div  className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                            <br />
                            <br />
                            <div className="row">
                                {matched.map((user, index) => 
                                    <div key={index} className="col-md-6">
                                        <MyCard user={user} block={false}></MyCard>    
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="username-tab">
                            <br />
                            <br />
                            <div className="row">
                                {viewed.map((user, index) => 
                                    <div key={index} className="col-md-6">
                                        <MyCard user={user} block={false}></MyCard>    
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="tab-pane fade" id="visits" role="tabpanel" aria-labelledby="username-tab">
                            <br />
                            <br />
                            <div className="row">
                                {myvisits.map((user, index) => 
                                    <div key={index} className="col-md-6">
                                        <MyCard user={user} block={false}></MyCard>    
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="tab-pane fade" id="mail" role="tabpanel" aria-labelledby="email-tab">
                            <br />
                            <br />
                            <div className="row">    
                                {blocked.map((user, index) => 
                                    <div key={index} className="col-md-6">
                                        <MyCard user={user} block={true}></MyCard>    
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="tab-pane fade" id="likes" role="tabpanel" aria-labelledby="email-tab">
                            <br />
                            <br />
                            <div className="row">
                                {liked.map((user, index) => 
                                    <div key={index} className="col-md-6">
                                        <MyCard user={user} block={false}></MyCard>    
                                    </div>
                                )}
                            </div>
                            
                        </div>
                        <div className="tab-pane fade" id="likeme" role="tabpanel" aria-labelledby="email-tab">
                            <br />
                            <br />
                            <div className="row">
                                {likedme.map((user, index) => 
                                    <div key={index} className="col-md-6">
                                        <MyCard user={user} block={false}></MyCard>    
                                    </div>
                                )}
                            </div>
                            
                        </div>
                    </div>
                </div>
                <div className="col-md-2"></div>
            </div>
        </div>
    )
}

export default Who;