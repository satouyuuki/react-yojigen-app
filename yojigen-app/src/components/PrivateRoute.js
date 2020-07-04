import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import User from './User';
class PrivateRoute extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const isAuth = User.get();
    return (
      isAuth ? <Route {...this.props} /> : <Redirect to="/login" />
    );
  }
}
export default PrivateRoute;

