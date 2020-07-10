import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment'
import { AiFillHeart } from "react-icons/ai";
import { FaComment } from "react-icons/ai";
import { FcComments } from "react-icons/fc";
import User from './User';
class Thread extends Component {
  constructor(props) {
    super(props);
    this.state = {
      threads: []
    }
  }
  componentDidMount() {
    this.getThreads();
  }
  getThreads() {
    fetch('/api/thread')
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.setState({
          threads: data
        })
      })
      .catch(err => console.log(err));
  }
  editPage(id) {
    this.props.history.push(`/thread/edit/${id}`);
  }
  handleLike(threadId) {
    if (!User.get()) return alert('ログインしてください');
    const token = User.getToken();
    if (typeof token === 'undefined') return;
    const userId = this.props.userId;
    const allThreads = this.state.threads;
    fetch(`/apitest/like/${threadId}`, {
      method: 'post',
      headers: {
        "Content-type": 'application/json',
        "Authorization": token
      },
      body: JSON.stringify({ threadId, userId })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.getThreads();
      })
      .catch(err => console.log(err));
  }
  handleDeleteThread(id) {
    const token = User.getToken();
    if (typeof token === 'undefined') return;
    const allThreads = this.state.threads;
    const deleteThread = allThreads.filter(thread => thread.id === id);
    console.log(deleteThread);
    const result = window.confirm('本当に削除しますか？');
    if (!result) return;
    fetch(`/api/thread/${id}`, {
      method: 'delete',
      headers: {
        "Content-type": 'application/json',
        "Authorization": token
      },
      body: JSON.stringify(deleteThread[0])
    })
      .then(res => res.json())
      .then(data => {
        if (data.message) return console.log(data.message);
        const index = allThreads.findIndex(thread => thread.id === id);
        allThreads.splice(index, 1);
        this.setState({ threads: allThreads });
      })
      .catch(err => console.log(err));
  }
  render() {
    return (
      <div className="container">
        {
          this.props.userId !== 0 &&
          <Link
            className="button--default"
            to="/thread/create">記事作成</Link>
        }
        <ul className="thre-group">
            {
              this.state.threads.map(thread => 
                <li className="thre-card" key={thread.id}>
                  <Link to={`/thread/comment/${thread.id}`}>
                    <p className="thre-card__title">タイトル: {thread.title}</p>
                  </Link>
                  最終更新日: {moment(thread.updated_date).format('YYYY/MM/DD k:mm')}<br />
                  作成日: {moment(thread.created_date).format('YYYY/MM/DD k:mm')}<br />
                  <AiFillHeart
                    onClick={this.handleLike.bind(this, thread.id)}
                    className="i-heart"
                  />: {thread.like}
                  <Link to={`/thread/comment/${thread.id}`}>
                    <FcComments
                      className="i-comment"
                    />: {thread.comment}
                  </Link><br/>
                  ユーザID: {thread.user_id}<br />
                  {
                    this.props.userId === thread.user_id &&
                    <div>
                      <button onClick={this.editPage.bind(this, thread.id)}>編集</button>
                      <button onClick={this.handleDeleteThread.bind(this, thread.id)}>削除</button>
                    </div>
                  }
                </li>
              )
            }
        </ul>
      </div>
    )
  }
}

export default Thread;