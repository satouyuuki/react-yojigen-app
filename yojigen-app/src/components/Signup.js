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
        console.log(data);
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
      <form onSubmit={this.handleSubmit.bind(this)}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            onChange={this.handleNameVal.bind(this)}
          />
        </div>
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
        <input type="submit" value="送信"/>
      </form>
    )
  }
}

export default Signup;