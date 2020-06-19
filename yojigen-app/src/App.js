import React, { Component } from 'react';
import Create from './components/Create';
import Edit from './components/Edit';
import Comment from './components/Comment';
import Thread from './components/Thread';
import Header from './components/Header';
import Login from './components/Login';
import Signup from './components/Signup';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <Header />
        <Route path='/Login' component={Login} />
        <Route path='/Signup' component={Signup} />
        <Route path='/Comment' component={Comment} />
        <Route exact path='/' component={Thread} />
        <Route path='/Edit' component={Edit} />
        <Route path='/Create' component={Create} />
      </Router>
    )
  }
}
export default App;
