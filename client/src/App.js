import React, { Component } from 'react';
import Header  from './components/Header';
//import Footer  from './components/Footer';
import Register  from './components/users/Register';
import Login  from './components/users/Login';
import editProfile  from './components/users/editProfile';
import Infos  from './components/users/Infos';
import ConfirmAcc from './components/users/ConfirmAcc';
import Search from './components/Search';
import NewPass from './components/users/NewPassword';
import Profileuser from './components/users/Profileuser';
import Home from './components/Home';
import Chats from './components/users/Chats';
import Who from './components/Who';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'; 
import { Provider } from 'react-redux'
import store from './store'

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Header />
          <Switch>
            <Route exact path="/register" component={Register}/>
            <Route exact path="/login" component={Login}/>
            <Route exact path="/profile/edit/" component={editProfile}/>
            <Route exact path="/search" component={Search}/>
            <Route exact path="/confirmAcc/:username/:token" component={ConfirmAcc}/>
            <Route exact path="/resetpwd/:username/:token" component={NewPass}/>            
            <Route exact path="/profile/:username" component={Profileuser}/>
            <Route exact path="/who" component={Who}/>
            <Route exact path="/logout" component={Login}/>
            <Route exact path="/infos" component={Infos}/>
            <Route exact path="/chats" component={Chats}/>
            <Route exact path="/" component={Home}/>
          </Switch>
        </Router>
      </Provider> 
    );
  }
}

export default App;
