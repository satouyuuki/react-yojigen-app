import React, { Component }  from 'react';
import { Route, Redirect } from 'react-router-dom';
import User from './User';
class GuestRoute extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const isAuth = User.get();
    return (
      isAuth ? <Redirect to="/" /> : <Route {...this.props} />
    );
  }
}

export default GuestRoute;
