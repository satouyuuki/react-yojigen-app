import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    }
  }
  handleEmailVal(e) {
    this.setState({
      email: e.target.value
    });
  }
  handlePassVal(e) {
    this.setState({
      password: e.target.value
    });
  }
  handleSubmit(e) {
    if (
      this.state.email === '' ||
      this.state.password === ''
    ) return;
    fetch('/login', {
      method: 'post',
      headers: {
        "Content-type": 'application/json'
      },
      body: JSON.stringify(this.state)
    })
      .then(res => res.json())
      .then(data => {
        localStorage.setItem('token', data.accessToken);
        this.setState({ email: '' });
        this.setState({ password: '' });
        this.props.history.push('/');
      })
      .catch(err => console.log(err));
    e.preventDefault();
  }
  render() {
    return (
      <div className="container">
        <div className="login-card">
          <h1 className="heading1">ログイン</h1>
          <form onSubmit={this.handleSubmit.bind(this)}>
            <div className="input-wrap">
              <input
                className="input-form"
                type="email"
                placeholder="Email"
                onChange={this.handleEmailVal.bind(this)}
              />
            </div>
            <div className="input-wrap">
              <input
                className="input-form"
                type="passowrd"
                placeholder="Password"
                onChange={this.handlePassVal.bind(this)}
              />
            </div>
            <div className="input-wrap">
              <input className="button" type="submit" value="送信" />
            </div>
          </form>
          <Link className="card-link" to="/signup">新規登録はこちら</Link>
        </div>
      </div>
    )
  }
}

export default withRouter(Login);