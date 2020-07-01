import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
/**
 * 認証状態を保持する変数
 */
// var UserStatus = {
//   auth: false
// };
class Header extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   name: '',
    // }
    console.log('header')
  }
  componentDidMount() {
    let token = localStorage.getItem('token');
    if (token === null) return;
    token += "Bearer " + token;
    console.log(token);
    fetch('/user-name', {
      headers: {
        "Content-type": 'application/json',
        "Authorization": token,
      }
    })
      .then(res => res.json())
      .then((data) => {
        // UserStatus.auth = true;
        this.props.updateState(data.name);
        // this.setState({
        //   name: data.name
        // })
      })
      .catch(err => console.log(err));
  }
  handleLogout() {
    localStorage.removeItem('token');
    alert('ログアウトしました');
    console.log(this.props);
    this.props.updateState('テスト太郎');
    this.props.history.push('/login');
  }
  render() {
    return (
      <div>
        <Link to="/">スレッド一覧</Link>
        {this.props.name != 'テスト太郎'
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