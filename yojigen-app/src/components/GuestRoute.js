import React, { Component }  from 'react';
import { Route, Redirect } from 'react-router-dom';

class GuestRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidUpdate() {
    this.authChack();
  }
  authChack() {
    const isAuth = this.props.name === '' ? false : true;
    return isAuth;
  }
  render() {
    const isAuth = this.authChack();
    return (
      isAuth ? <Redirect to="/" /> : <Route {...this.props} />
    );
  }
}

export default GuestRoute;
