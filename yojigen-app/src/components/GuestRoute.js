import React, { Component }  from 'react';
import { Route, Redirect } from 'react-router-dom';

// function GuestRoute(props) {
//   console.log(props);
//   const isAuth = true;
//   return isAuth ? <Redirect to="/"/> : <Route {...props}/>
// }
class GuestRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    console.log('guestRoute');
    console.log(this.props);
  }
  componentDidUpdate() {
    this.authChack();
  }
  authChack() {
    const isAuth = this.props.name === 'テスト太郎' ? false : true;
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
