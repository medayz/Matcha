import React, { Component } from 'react';
import Header  from './components/Header';
import Register  from './components/users/Register';
import Index  from './components/Index';
import Login  from './components/users/Login';
import Profile  from './components/users/Profile';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom'; 

class App extends Component {
  render() {
    return (
        <Router>
          <Header />
          <Switch>
            <Route exact path="/" component={Index}/>
            <Route exact path="/register" component={Register}/>
            <Route exact path="/login" component={Login}/>
            <Route exact path="/profile" component={Profile}/>
          </Switch>
        </Router>
    );
  }
}

export default App;
