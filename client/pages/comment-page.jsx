import React from 'react';
import CommentForm from '../components/comment-form';
import CommentList from '../components/comment-list';
import ConnectionError from './connection-error';

class CommentPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      loading: false,
      error: false
    };
    this.addComment = this.addComment.bind(this);
  }

  render() {
    const iconColor = this.props.user ? 'blue-text text-darken-2' : 'blue-grey-text text-lighten-2';

    return <>
    <div className="container">
      {this.state.loading
        ? <div className="row">
              <div className="col s12 l12">
                <div className="progress light-blue darken-2">
                  <div className="indeterminate blue darken-4"></div>
                </div>
              </div>
            </div>
        : this.state.error
          ? <ConnectionError />
          : <>
            <div className="row">
              <div className="col s12 l12">
                  <h1 className="text-center">Comments</h1>
              </div>
            </div>
            <CommentForm onSubmit={this.addComment} postId={this.props.postId} user={this.props.user} />
              {!this.state.comments.length && !this.state.loading
                ? (
                <div className='text-center mt-two-rem blue-grey-text text-lighten-2'>
                  <div className={`width-100 ${iconColor}`}>
                  <i className="material-icons">comment</i>
                  </div>
                  <h2 className='mt-one-rem width-100'>No Comments Yet</h2>
                  <p className='width-100'>Be the first to share what you think!</p>
                </div>
                  )
                : <CommentList comments={this.state.comments} postId={this.props.postId} />
              }
           </>
      }
    </div>
    </>;
  }

  componentDidMount() {
    this.setState({ loading: true });
    fetch(`/api/comments/${this.props.postId}`)
      .then(res => res.json())
      .then(comments => {
        this.setState({ comments });
        this.setState({ loading: false });
      })
      .catch(err => {
        this.setState({ loading: false });
        this.setState({ error: true });
        console.error(err);
      });
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
