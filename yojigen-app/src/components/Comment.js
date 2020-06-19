import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      thread: {},
      comments: [],
      comment: '',
    }
  }
  componentDidMount() {
    const id = this.props.match.params.id;
    console.log(id);
    fetch(`http://localhost:3000/thread/${id}`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          thread: data
        })
      })
      .catch(err => console.log(err));
    
    fetch(`http://localhost:3000/comment`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          comments: data
        })
      })
      .catch(err => console.log(err));
  }
  handleCommentVal(e) {
    this.setState({
      comment: e.target.value
    })
  }

  handleSubmit(e) {
    if (
      this.state.comment === ''
    ) return;
    const id = this.props.match.params.id;
    const newComment = {
      threadId: id,
      comment: this.state.comment
    }

    fetch(`http://localhost:3000/comment`, {
      method: 'post',
      headers: {
        "Content-type": 'application/json'
      },
      body: JSON.stringify(newComment)
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
      })
      .catch(err => console.log(err));
    e.preventDefault();
  }

  render() {
    return (
      <div>
        <Link to="/">戻る</Link>
        <div>
          <h3>{this.state.thread.title}</h3>
          <p>
            {this.state.thread.description}
          </p>
        </div>
        <ul>
          {
            this.state.comments.map(comment =>
              <li key={comment.id}>
                {comment.comment}
              </li>
            )
          }
        </ul>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <div>
            <label>Comment:</label>
            <input
              type="text"
              onChange={this.handleCommentVal.bind(this)}
            />
          </div>
          <input type="submit" value="送信" />
        </form>
      </div>
    )
  }
}

export default Comment;