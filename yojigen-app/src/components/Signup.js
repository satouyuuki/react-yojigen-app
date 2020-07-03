import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: ''
    }
  }
  handleNameVal(e) {
    this.setState({
      name: e.target.value
    });
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
      this.state.name === '' ||
      this.state.email === '' ||
      this.state.password === ''
    ) return;
    fetch('/user', {
      method: 'post',
      headers: {
        "Content-type": 'application/json'
      },
      body: JSON.stringify(this.state)
    })
      .then(res => res.json())
      .then(data => {
        this.setState({ name: '' });
        this.setState({ email: '' });
        this.setState({ password: '' });
        // this.props.history.push('/');
      })
      .catch(err => console.log(err));
    e.preventDefault();
  }
  render() {
    return (
      <div className="login-card">
        <h1 className="heading1">新規登録</h1>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <div className="input-wrap">
            <input
              className="input-form"
              type="text"
              placeholder="Name"
              onChange={this.handleNameVal.bind(this)}
            />
          </div>
          <div className="input-wrap">
            <input
              type="email"
              className="input-form"
              placeholder="Email"
              onChange={this.handleEmailVal.bind(this)}
            />
          </div>
          <div className="input-wrap">
            <input
              type="passowrd"
              className="input-form"
              placeholder="Password"
              onChange={this.handlePassVal.bind(this)}
            />
          </div>
          <div className="input-wrap">
            <input className="button" type="submit" value="送信"/>
          </div>
        </form>
        <Link className="card-link" to="/login">ログインはこちら</Link>
      </div>
    )
  }
}

export default Signup;