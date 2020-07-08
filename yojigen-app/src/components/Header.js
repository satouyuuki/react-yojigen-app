import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import User from './User';
class Header extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const token = User.getToken();
    if (typeof token === 'undefined') return;
    fetch('/api/user-name', {
      headers: {
        "Content-type": 'application/json',
        "Authorization": token,
      }
    })
      .then(res => res.json())
      .then((data) => {
        this.props.updateState(data);
      })
      .catch(err => console.log(err));
  }
  handleLogout() {
    localStorage.removeItem('token');
    alert('ログアウトしました');
    this.props.updateState({name: '', id: 0});
    this.props.history.push('/login');
  }
  render() {
    return (
      <div className="header">
        <Link className="header__title" to="/">スレッド一覧</Link>
        {this.props.name != ''
          ? 
          <div>
            <Link className="header__text" to="/login" onClick={this.handleLogout.bind(this)}>Log Out</Link>
            <span className="header__text">{this.props.name}さん</span>
          </div>
          : 
          <div>
            <Link className="header__text" to="/login">Login</Link>
            <Link className="header__text" to="/signup">Sign Up</Link>
          </div>
        }
      </div>
    )
  }
}
// this.props propsにhistory objectが渡される
export default withRouter(Header);