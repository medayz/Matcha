import React, { Component } from 'react';
import Header  from './components/Header';
import Register  from './components/users/Register';
import Index  from './components/Index';
import Login  from './components/users/Login';
import editProfile  from './components/users/editProfile';
import ConfirmAcc from './components/users/ConfirmAcc'
import Profile from './components/users/Profile'
import Logout from './components/users/Logout'
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom'; 
import { Provider } from 'react-redux'
import store from './store'

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Header />
          <Switch>
            <Route exact path="/" component={Index}/>
            <Route exact path="/register" component={Register}/>
            <Route exact path="/login" component={Login}/>
            <Route exact path="/profile/edit/" component={editProfile}/>
            <Route exact path="/confirmAcc/:username/:token" component={ConfirmAcc}/>
            <Route exact path="/profile/users/" component={Profile}/>
            <Route exact path="/logout" component={Logout}/>
          </Switch>
        </Router>
      </Provider> 
    );
  }
}

export default App;
