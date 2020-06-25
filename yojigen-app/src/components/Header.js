import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';

class Header extends Component {
  constructor(props) {
    super(props);
  }
  handleLogout() {
    localStorage.removeItem('token');
    alert('ログアウトしました');
    this.props.history.push('/login');
  }
  render() {
    return (
      <div>
        <Link to="/">スレッド一覧</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign Up</Link>
        <button onClick={this.handleLogout.bind(this)}>Log Out</button>
      </div>
    )
  }
}

export default withRouter(Header);