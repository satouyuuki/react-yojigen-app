import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
class Header extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    let token = localStorage.getItem('token');
    if (token === null) return;
    token += "Bearer " + token;
    fetch('/user-name', {
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
      <div>
        <Link to="/">スレッド一覧</Link>
        {this.props.name != ''
          ? 
          <div>
            <button onClick={this.handleLogout.bind(this)}>Log Out</button>
            <span>{this.props.name}さん</span>
          </div>
          : 
          <div>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </div>
        }
      </div>
    )
  }
}
// this.props propsにhistory objectが渡される
export default withRouter(Header);