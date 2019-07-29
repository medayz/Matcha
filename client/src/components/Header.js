import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './../css/profile.css'
class Header extends Component {
  render() {
    return (
        <nav className="navbar navbar-expand-sm navbar-dark bg-primary mb-3 py-0">
            <div className="container">
                <Link to="/" className="navbar-brand">
                    Matcha
                </Link>
                <div>
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link to="/login" className="nav-link">
                                Login
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/register" className="nav-link">
                                Register
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
  }
} 

export default Header;
