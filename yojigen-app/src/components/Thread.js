import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment'
import { AiFillHeart } from "react-icons/ai";
class Thread extends Component {
  constructor(props) {
    super(props);
    this.state = {
      threads: []
    }
  }
  componentDidMount() {
    fetch('/thread')
      .then(res => res.json())
      .then(data => {
        console.log(data);
        console.log(this.props);
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
    if (!localStorage.getItem('token')) return alert('ログインしてください');
    const token = "Bearer " + localStorage.getItem('token');
    const userId = this.props.userId;
    const allThreads = this.state.threads;
    console.log( allThreads );
    
    fetch(`/like`, {
      method: 'post',
      headers: {
        "Content-type": 'application/json',
      },
      body: JSON.stringify({ threadId, userId })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (data.length) {
          fetch(`/thread/like/${data[0].id}`, {
            method: 'delete',
          })
            .then(res => res.json())
            .then(data => {
              console.log(data);
              allThreads.map(thread => {
                if (thread.id === data.thread_id) {
                  thread.like--;
                }
              })
              this.setState({
                threads: allThreads
              });
            })
            .catch(err => console.log(err));
        } else {
          fetch('/thread/like', {
            method: 'post',
            headers: {
              "Content-type": 'application/json',
              "Authorization": token
            },
            body: JSON.stringify({ threadId })
          })
            .then(res => res.json())
            .then(data => {
              console.log(data);
              allThreads.map(thread => {
                if (thread.id === data.thread_id) {
                  thread.like++;
                }
              })
              this.setState({
                threads: allThreads
              });
            })
            .catch(err => console.log(err));
        }
      })
      .catch(err => console.log(err));
  }
  handleDeleteThread(id) {
    const token = "Bearer " + localStorage.getItem('token');
    const allThreads = this.state.threads;
    const deleteThread = allThreads.filter(thread => thread.id === id);
    fetch(`/thread/${id}`, {
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
        console.log(allThreads);
        const index = allThreads.findIndex(thread => thread.id === id);
        allThreads.splice(index, 1);
        this.setState({ threads: allThreads });
      })
      .catch(err => console.log(err));
  }
  render() {
    return (
      <div>
        <Link to="/thread/create">記事作成</Link>
        <ul className="thre-group">
            {
              this.state.threads.map(thread => 
                <li className="thre-card" key={thread.id}>
                  <Link to={`/thread/comment/${thread.id}`}>
                    <p className="thre-card__title">タイトル: {thread.title}</p>
                  </Link>
                  <p className="thre-card__text">説明: {thread.description}</p><br />
                  最終更新日: {moment(thread.updated_date).format('YYYY/MM/DD h:mm')}<br />
                  作成日: {moment(thread.created_date).format('YYYY/MM/DD h:mm')}<br />
                  <AiFillHeart
                    onClick={this.handleLike.bind(this, thread.id)}
                    className="i-heart"
                  />: {thread.like}<br />
                  ユーザID: {thread.user_id}<br />
                  
                  <button onClick={this.editPage.bind(this, thread.id)}>編集</button>
                  <button onClick={this.handleDeleteThread.bind(this, thread.id)}>削除</button>
                </li>
              )
            }
        </ul>
      </div>
    )
  }
}

export default Thread;