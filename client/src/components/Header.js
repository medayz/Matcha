import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getter } from '../helpers/tokenOperation';
import './../css/profile.css'
class Header extends Component {
    token = getter('token');
  render() {
    return (
        <nav className="navbar navbar-expand-sm navbar-dark bg-primary mb-3 py-0">
            <div className="container">
                <Link to="/" className="navbar-brand">
                    Matcha
                </Link>
                <div>
                    <ul className="navbar-nav mr-auto">
                        {!this.token &&
                        <li className="nav-item">
                            <Link to="/login" className="nav-link">
                                Login
                            </Link>
                        </li>}
                        {!this.token &&
                        <li className="nav-item">
                            <Link to="/register" className="nav-link">
                                Register
                            </Link>
                        </li>}
                        {this.token &&
                        <li className="nav-item">
                            <Link to="/profile/users/cmarouan" className="nav-link">
                                profile
                            </Link>
                        </li>}
                        {this.token &&
                        <li className="nav-item">
                            <Link to="/profile/edit/cmarouan" className="nav-link">
                                Edit 
                            </Link>
                        </li>
                        }
                        {this.token &&
                        <li className="nav-item">
                            <Link to="/logout" className="nav-link">
                                Logout 
                            </Link>
                        </li>
                        }
                    </ul>
                </div>
            </div>
        </nav>
    );
  }
} 

export default Header;
