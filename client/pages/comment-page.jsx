import React from 'react';
import CommentForm from '../components/comment-form';
import CommentList from '../components/comment-list';

class CommentPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: []
    };
    this.addComment = this.addComment.bind(this);
  }

  render() {
    return <>
    <div className="container">
      <div className="row">
        <div className="col s12 l12">
            <h1 className="text-center">Comments</h1>
        </div>
      </div>
    </div>
      <CommentForm onSubmit={this.addComment} postId={this.props.postId} user={this.props.user} />
      <CommentList comments={this.state.comments} postId={this.props.postId} />
    </>;
  }

  componentDidMount() {
    fetch(`/api/comments/${this.props.postId}`)
      .then(res => res.json())
      .then(comments => this.setState({ comments }
      ))
      .catch(err => console.error(err));
  }

  addComment(newComment) {
    const jwt = localStorage.getItem('jwt-token');
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': jwt
      },
      body: JSON.stringify(newComment)
    };
    fetch('/api/comments', req)
      .then(res => res.json())
      .then(data => {
        const prevState = this.state.comments.slice();
        const newState = [data, ...prevState];
        this.setState({
          comments: newState
        });
      })
      .catch(err => console.error(err));
  }
}

export default CommentPage;
