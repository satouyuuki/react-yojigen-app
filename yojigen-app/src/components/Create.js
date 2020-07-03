import React, { Component } from 'react';
import { Link } from 'react-router-dom';

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

  handleSubmit(e) {
    if (
      this.state.title === '' ||
      this.state.description === ''
    ) return;
    const newThread = {
      title: this.state.title,
      description: this.state.description,
    }
    const token = "Bearer " + localStorage.getItem('token');
    fetch('/thread', {
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
      <form onSubmit={this.handleSubmit.bind(this)}>
        <Link to="/">戻る</Link>
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
            <input className="button" type="submit" value="送信" />
          </div>
        </div>
      </form>
    )
  }
}

export default Create;