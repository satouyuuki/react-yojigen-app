import React, { Component } from 'react';
import { Link } from 'react-router-dom';

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
      console.log(data);
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
    const token = "Bearer " + localStorage.getItem('token');
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
        console.log(data);
        // this.props.history.push('/');
      })
      .catch(err => console.log(err));
    e.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <Link to="/">戻る</Link>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={this.state.title}
            onChange={this.handleTitleVal.bind(this)}
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            value={this.state.description}
            onChange={this.handleDescVal.bind(this)}
          />
        </div>
        <input type="submit" value="送信" />
        <input type="hidden" value={this.state.userId}/>
      </form>
    )
  }
}

export default Edit;