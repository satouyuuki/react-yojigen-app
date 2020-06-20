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
    fetch('http://localhost:3000/thread')
      .then(res => res.json())
      .then(data => {
        this.setState({
          threads: data
        })
      })
      .catch(err => console.log(err));
  }
  editPage(id) {
    this.props.history.push(`/thread/edit/${id}`);
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
                    {thread.title}
                    date: {moment(thread.updated_date).format('YYYY-MM-DD')}
                  </Link>
                  <button onClick={this.editPage.bind(this, thread.id)}>編集</button>
                </li>
              )
            }
        </ul>
      </div>
    )
  }
}

export default Thread;