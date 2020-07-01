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
      test: 'テスト太郎'
    }
    this.updateState = this.updateState.bind(this);
  }
  updateState(state) {
    this.setState({test: state});
  }
  render() {
    return (
      <div>
        <Router>
          <Header updateState={this.updateState} name={this.state.test}/>
          <Switch>
            {/* <Route exact path='/' component={Default} /> */}
            <Route exact path="/" component={Thread} />
            <Route path="/thread/comment/:id" component={Comment} />
            <Route path="/thread/edit/:id" component={Edit} />
            <Route path="/thread/create" component={Create} />
 
            <GuestRoute path='/login' children={<Login />}  updateState={this.updateState} name={this.state.test} />
            <GuestRoute path='/signup' children={<Signup />}  updateState={this.updateState} name={this.state.test} />
          </Switch>
          <div>{this.state.test}</div>
        </Router>
        <footer>food</footer>
      </div>
    )
  }
}
export default App;
