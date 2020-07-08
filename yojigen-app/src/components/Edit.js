import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import User from './User';
class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      userId: ''
    }
  }
  componentDidMount() {
    const id = this.props.match.params.id;
    fetch(`/thread/${id}`)
    .then(res => res.json())
    .then(data => {
      this.setState({
        title: data.title,
      });
      this.setState({
        description: data.description,
      });
      this.setState({
        userId: data.user_id
      });
    })
    .catch(err => console.log(err));
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
    const updatedThread = {
      title: this.state.title,
      description: this.state.description,
      updated_date: new Date(),
      user_id: this.state.userId
    }
    const id = this.props.match.params.id;
    const token = User.getToken();
    if (typeof token === 'undefined') return;
    fetch(`/thread/${id}`, {
      method: 'put',
      headers: {
        "Content-type": 'application/json',
        "Authorization": token
      },
      body: JSON.stringify(updatedThread)
    })
      .then(res => res.json())
      .then(data => {
        // this.props.history.push('/');
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
                  value={this.state.title}
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
                  value={this.state.description}
                  className="table-textarea"
                  placeholder="説明文"
                  onChange={this.handleDescVal.bind(this)}
                />
              </div>
            </div>
            <div className="table__full">
              <button className="button--back" onClick={this.handleBack.bind(this)}>戻る</button>
              <button className="button--default" type="submit">更新</button>
            </div>
          </div>
          <input type="hidden" value={this.state.userId} />
        </form>
      </div>
    )
  }
}

export default withRouter(Edit);