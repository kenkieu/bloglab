import React from 'react';
// import Moment from 'react-moment';
// import 'moment-timezone';
import CommentForm from '../components/commentform';
// import parseRoute from '../lib/parse-route';

class CommentPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: []
      // route: parseRoute(window.location.hash)
    };
  }

  // componentDidMount() {
  //   window.addEventListener('hashchange', () => {
  //     this.setState({ route: parseRoute(window.location.hash) });
  //   });
  // }

  render() {
    // const { route } = this.state;
    // const postId = parseRoute(route.params.get('postId'));
    return <>
    <div className="container">
      <div className="row">
        <div className="col s12 l12">
            <h1 className="comment-header text-center">Comments</h1>
        </div>
      </div>
    </div>
    <CommentForm/>
    </>;
  }
}

export default CommentPage;
