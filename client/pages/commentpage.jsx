import React from 'react';
// import Moment from 'react-moment';
// import 'moment-timezone';
// import CommentForm from '../components/commentform';
// import parseRoute from '../lib/parse-route';

class CommentPage extends React.Component {
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
        <div className="col s12 l12">
            <h1 className="comment-header text-center">Comments</h1>
        </div>
      </div>
    </div>
    </>;
  }
}

export default CommentPage;
