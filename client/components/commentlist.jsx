import React from 'react';
import { formatDistance } from 'date-fns';

class CommentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: []
    };
  }

  render() {
    return <>
      <div className="container">
        <div className="row">
          {this.state.comments.map(comment => (
            <div key={comment.createdAt} className="col s12 l12">
              <Comment comment={comment}/>
            </div>
          ))
          }
        </div>
      </div>
    </>;
  }

  componentDidMount() {
    fetch(`/api/comments/${this.props.postId}`)
      .then(res => res.json())
      .then(comments => this.setState({ comments }))
      .catch(err => console.error(err));
  }
}

function Comment(props) {
  const { username, content, createdAt } = props.comment;
  const timeAgo = formatDistance(
    new Date(createdAt),
    new Date()
  ) + ' ago';
  return <>
    <span className="comment-username">{username}</span>
    <span className="comment-time-ago light-grey-text">{timeAgo}</span>
    <p className="mb-two-rem mt-half-rem">{content}</p>
  </>;
}

export default CommentList;
