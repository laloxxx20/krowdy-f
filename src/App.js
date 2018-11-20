import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect
} from "react-router-dom";
import { LoginView, RegisterView, ProfileView } from './screens';

import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path='/' component={()=>(<Redirect to='/login'/>)}/> 
          <Route path="/login" component={LoginView} />
          <Route path="/register" component={RegisterView} />
          <Route path="/profile" component={ProfileView} />
        </div>  
      </Router>
    );
  }
}

export default App;
