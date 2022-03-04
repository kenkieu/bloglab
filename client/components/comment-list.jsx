import React from 'react';
import { formatDistance } from 'date-fns';

class CommentList extends React.Component {
  render(props) {
    const { comments } = this.props;
    return (
      <div className="row">
        {comments.map(comment => (
          <div key={comment.createdAt} className="col s12 l12">
            <Comment comment={comment}/>
          </div>
        ))
        }
      </div>
    );
  }
}

function Comment(props) {
  const { username, content, createdAt } = props.comment;
  const timeAgo = formatDistance(
    new Date(createdAt),
    new Date()
  ) + ' ago';
  return <>
    <span className="bold">{username}</span>
    <span className="comment-time-ago light-grey-text">{timeAgo}</span>
    <p className="mb-two-rem mt-half-rem">{content}</p>
  </>;
}

export default CommentList;
