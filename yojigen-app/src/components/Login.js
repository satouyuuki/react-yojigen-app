import React, { Component } from 'react';
import { Link } from 'react-router-dom';

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
    console.log(this.state);
    fetch('http://localhost:3000/login', {
      method: 'post',
      headers: {
        "Content-type": 'application/json'
      },
      body: JSON.stringify(this.state)
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        localStorage.setItem('token', data.accessToken);
        this.setState({ email: '' });
        this.setState({ password: '' });
        // this.props.history.push('/');
      })
      .catch(err => console.log(err));
    e.preventDefault();
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            onChange={this.handleEmailVal.bind(this)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="passowrd"
            onChange={this.handlePassVal.bind(this)}
          />
        </div>
        <input type="submit" value="送信" />
      </form>
    )
  }
}

export default Login;