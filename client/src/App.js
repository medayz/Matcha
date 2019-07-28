import React, { Component } from 'react';
import Header  from './components/Header';
import Register  from './components/users/Register';
import Index  from './components/Index';
import Login  from './components/users/Login';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css';


class App extends Component {
  render() {
    return (
        <Router>
          <Header />
          <Switch>
            <Route exact path="/" component={Index}/>
            <Route exact path="/register" component={Register}/>
            <Route exact path="/login" component={Login}/>
          </Switch>
        </Router>
    );
  }
}

export default App;
