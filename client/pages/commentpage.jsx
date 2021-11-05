import React from 'react';
import CommentForm from '../components/commentform';
import CommentList from '../components/commentlist';

class CommentPage extends React.Component {

  render() {
    return <>
    <div className="container">
      <div className="row">
        <div className="col s12 l12">
            <h1 className="comment-header text-center">Comments</h1>
        </div>
      </div>
    </div>
      <CommentForm postId={this.props.postId} />
      <CommentList postId={this.props.postId} />
    </>;
  }
}

export default CommentPage;
