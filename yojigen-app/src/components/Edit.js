import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: ''
    }
  }
  componentDidMount() {
    const id = this.props.match.params.id;
    console.log(id);
    fetch(`http://localhost:3000/thread/${id}`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          title: data.title,
          description: data.description
        })
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
    const id = this.props.match.params.id;
    fetch(`http://localhost:3000/thread/${id}`, {
      method: 'put',
      headers: {
        "Content-type": 'application/json'
      },
      body: JSON.stringify(this.state)
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.props.history.push('/');
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
      </form>
    )
  }
}

export default Edit;