import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
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
        const threadComment = data.filter(comment =>
          comment.threadId == id
        );
        this.setState({
          comments: threadComment
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
      comment: this.state.comment,
      created_date: new Date(),
      updated_date: new Date()
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
        const newComment = this.state.comments;
        newComment.push(data);
        this.setState({
          comments: newComment
        })
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
          <p>
            作成日: {moment(this.state.thread.created_date).format('YYYY-MM-DD')}
          </p>
          <p>
            最終更新日: {moment(this.state.thread.updated_date).format('YYYY-MM-DD')}
          </p>
        </div>
        <ul>
          {
            this.state.comments.map(comment =>
              <li key={comment.id}>
                {comment.comment}
                作成日: {moment(comment.created_date).format('YYYY-MM-DD')}
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