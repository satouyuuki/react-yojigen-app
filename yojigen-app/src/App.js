import React, { Component } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import GuestRoute from './components/GuestRoute';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import './App.css';
import Header from './components/Header';
import Create from './components/Create';
import Edit from './components/Edit';
import Comment from './components/Comment';
import Thread from './components/Thread';
import './styles/imports.scss';

class App extends Component {
  constructor(props) {
    super(props);
    this.state= {
      name: '',
      id: 0,
    }
    this.updateState = this.updateState.bind(this);
  }
  updateState(state) {
    this.setState(state);
    console.log(this.state);
  }
  render() {
    return (
      <div>
        <Router>
          <Header updateState={this.updateState} name={this.state.name}/>
          <Switch>
            {/* <Route exact path='/' component={Default} /> */}
            <Route exact path="/" render={props => <Thread userId={this.state.id} {...props}/>}/>
            <Route path="/thread/comment/:id" render={props => <Comment userId={this.state.id} {...props} />}/>
            <Route path="/thread/edit/:id" component={Edit} />
            <Route path="/thread/create" component={Create} />
 
            <GuestRoute path='/login' children={<Login />}  updateState={this.updateState} name={this.state.name} />
            <GuestRoute path='/signup' children={<Signup />}  updateState={this.updateState} name={this.state.name} />
          </Switch>
          <div>{this.state.name}</div>
        </Router>
        <footer>food</footer>
      </div>
    )
  }
}
export default App;
