import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import User from './User';
class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: ''
    }
  }
  handleTitleVal(e) {
    this.setState({
      title: e.target.value
    });
  }
  handleDescVal(e) {
    this.setState({
      description: e.target.value
    });
  }
  handleBack() {
    this.props.history.push('/');
  }

  handleSubmit(e) {
    if (
      this.state.title === '' ||
      this.state.description === ''
    ) return;
    const newThread = {
      title: this.state.title,
      description: this.state.description,
    }
    const token = User.getToken();
    if (typeof token === 'undefined') return;

    fetch('/api/thread', {
      method: 'post',
      headers: {
        "Content-type": 'application/json',
        "Authorization": token
      },
      body: JSON.stringify(newThread)
    })
      .then(res => res.json())
      .then(data => {
        // this.props.history.push('/');
        this.setState({ title: '' });
        this.setState({ description: '' });
      })
      .catch(err => console.log(err));
    e.preventDefault();
  }

  render() {
    return (
      <div className="container">
        <form onSubmit={this.handleSubmit.bind(this)}>
          <div className="table">
            <div className="table__row">
              <div className="table__head">
                <label>タイトル:</label>
              </div>
              <div className="table__body">
                <input
                  className="table-input"
                  placeholder="タイトル"
                  type="text"
                  onChange={this.handleTitleVal.bind(this)}
                />
              </div>
            </div>
            <div className="table__row">
              <div className="table__head">
                <label>説明文:</label>
              </div>
              <div className="table__body">
                <textarea
                  className="table-textarea"
                  placeholder="説明文"
                  onChange={this.handleDescVal.bind(this)}
                />
              </div>
            </div>
            <div className="table__full">
              <button className="button--back" onClick={this.handleBack.bind(this)}>戻る</button>
              <button className="button--default" type="submit">作成</button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

export default withRouter(Create);