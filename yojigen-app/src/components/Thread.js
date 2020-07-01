import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment'
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
        this.setState({
          threads: data
        })
      })
      .catch(err => console.log(err));
  }
  editPage(id) {
    this.props.history.push(`/thread/edit/${id}`);
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
        <ul>
            {
              this.state.threads.map(thread => 
                <li key={thread.id}>
                  <Link to={`/thread/comment/${thread.id}`}>
                    タイトル: {thread.title}<br/>
                    説明: {thread.description}<br />
                    最終更新日: {moment(thread.updated_date).format('YYYY/MM/DD h:mm')}<br />
                    作成日: {moment(thread.created_date).format('YYYY/MM/DD h:mm')}<br />
                    いいね: {thread.good}<br />
                    ユーザID: {thread.user_id}<br />
                  </Link>
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