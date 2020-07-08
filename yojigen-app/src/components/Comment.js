import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import User from './User';
class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      threads: {},
      comments: [],
      comment: '',
    }
  }
  componentDidMount() {
    const id = this.props.match.params.id;
    fetch(`/api/thread/comments/${id}`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          threads: data[0],
        })
        const initComments = data[0].comments;
        if (initComments[0] == null) return;
        initComments.map(comment => {
          comment.editFlg = false;
        })
        this.setState({
          comments: initComments
        })
      })
      .catch(err => console.log(err));
  }
  handleCommentVal(e) {
    this.setState({
      comment: e.target.value
    })
  }
  handleBack() {
    this.props.history.push('/');
  }

  handleToggleEditFlg(id) {
    const updateComments = this.state.comments;
    updateComments.map(comment => {
      return (comment.id === id) ? comment.editFlg = !comment.editFlg : null;
    })
    this.setState({comments: updateComments})
  }
  handleUpdateComment(id, e) {
    const updateComments = this.state.comments;
    updateComments.map(comment => {
      return (comment.id === id) ? comment.comment = e.target.value : null;
    })
    this.setState({ comments: updateComments })
  }

  handleEditCommentSubmit(id, e) {
    let updateComment = this.state.comments;
    updateComment = updateComment.filter(comment => comment.id === id);
    if (
      updateComment[0].comment === ''
    ) return;
    const token = User.getToken();
    if (typeof token === 'undefined') return;
    const submitBody = {
      comment: updateComment[0].comment,
      user_id: updateComment[0].user_id,
    }

    fetch(`/api/comment/${id}`, {
      method: 'put',
      headers: {
        "Content-type": 'application/json',
        "Authorization": token
      },
      body: JSON.stringify(submitBody)
    })
      .then(res => res.json())
      .then(data => {
        const newComment = this.state.comments;
        const index = newComment.findIndex(comment => comment.id === data.id);
        newComment[index] = data;
        this.setState({
          comments: newComment
        })
      })
      .catch(err => console.log(err));
    e.preventDefault();
  }

  handleDeleteCommentSubmit(id, e) {
    let deleteComment = this.state.comments;
    deleteComment = deleteComment.filter(comment => comment.id === id);
    const token = User.getToken();
    if (typeof token === 'undefined') return;

    const submitBody = {
      user_id: deleteComment[0].user_id,
    }

    fetch(`/api/comment/${id}`, {
      method: 'delete',
      headers: {
        "Content-type": 'application/json',
        "Authorization": token
      },
      body: JSON.stringify(submitBody)
    })
      .then(res => res.json())
      .then(data => {
        if (data.message) return console.log(data.message);
        const newComment = this.state.comments;
        const index = newComment.findIndex(comment => comment.id === data.id);
        newComment.splice(index, 1);
        this.setState({
          comments: newComment
        })
      })
      .catch(err => console.log(err));
    e.preventDefault();
  }

  handleSubmit(e) {
    if (
      this.state.comment === ''
    ) return;
    const id = this.props.match.params.id;
    const token = User.getToken();
    if (typeof token === 'undefined') return;

    const newComment = {
      thread_id: id,
      comment: this.state.comment
    }

    fetch(`/api/comment`, {
      method: 'post',
      headers: {
        "Content-type": 'application/json',
        "Authorization": token
      },
      body: JSON.stringify(newComment)
    })
      .then(res => res.json())
      .then(data => {
        if (data.message) return console.log(data.message);
        const newComment = this.state.comments;
        newComment.push(data);
        this.setState({
          comments: newComment
        })
        alert('コメントを挿入しました');
        this.setState({ comment: '' });
      })
      .catch(err => console.log(err));
    e.preventDefault();
  }

  render() {
    return (
      <div className="container">
        <div className="msg-area">
          <div className="msg-area__head">
            <h3>{this.state.threads.title}</h3>
          </div>
          <div className="msg-area__content">
            <div className="scroll-area">
              <p className="comment left">
                {this.state.threads.description}
              </p>
              <p>
                作成日: {moment(this.state.threads.created_date).format('YYYY/MM/DD k:mm')}
              </p>
              <p>
                最終更新日: {moment(this.state.threads.updated_date).format('YYYY/MM/DD k:mm')}
              </p>

              <ul>
                {
                  this.state.comments.map(comment =>
                    <li
                      key={comment.id}
                      className={(this.state.threads.user_id === comment.user_id ? 'left' : 'right')}
                    >
                      {comment.editFlg === true ?
                        <div>
                          <input
                          value={comment.comment}
                          onChange={this.handleUpdateComment.bind(this, comment.id)}
                        />
                          <button onClick={this.handleEditCommentSubmit.bind(this, comment.id)}>編集</button>
                        </div>
                        :
                        <p className={'comment' + ' ' + (this.state.threads.user_id === comment.user_id ? 'left' : 'right')}>{ comment.comment }</p>
                      }
                    作成日: {moment(comment.created_date).format('YYYY/MM/DD k:mm')}<br />
                    更新日: {moment(comment.updated_date).format('YYYY/MM/DD k:mm')}<br />
                    ユーザID: {comment.user_id}<br />
                    記事iD: {comment.thread_id}<br />
                      {
                        this.props.userId === comment.user_id &&
                        <div>
                          <button onClick={this.handleToggleEditFlg.bind(this, comment.id)}>編集</button>
                          <button onClick={this.handleDeleteCommentSubmit.bind(this, comment.id)}>削除</button>
                        </div>
                      }
                    </li>
                  )
                }
              </ul>

            </div>
          </div>
          <div className="msg-area__bottom">
            <form onSubmit={this.handleSubmit.bind(this)}>
              <div className="cmt-group">
                <textarea
                  className="cmt-textarea"
                  placeholder="コメントを送信してください"
                  onChange={this.handleCommentVal.bind(this)}
                />
                <button
                  className="cmt-back-buttom"
                  onClick={this.handleBack.bind(this)}  
                >戻る</button>
                <button className="cmt-buttom" type="submit">投稿</button>
              </div>

            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Comment;