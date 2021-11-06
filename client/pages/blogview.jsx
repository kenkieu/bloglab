import React from 'react';
import { format } from 'date-fns';

class BlogView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { post: null };
  }

  componentDidMount() {
    fetch(`/api/posts/${this.props.postId}`)
      .then(res => res.json())
      .then(post => this.setState({ post }));
  }

  render() {
    if (!this.state.post) return null;
    const { imageUrl, summary, title, username, createdAt, body, totalComments } = this.state.post;
    const formattedDate = format(new Date(createdAt), 'MMMM dd, yyyy');
    return <>
        <div className="container blogpost">
          <div className="row">
            <div className="col s12 l6 flex-wrap">
              <img src={imageUrl} alt="image" className="width-100" />
            </div>
            <div className="col s12 l6 flex-wrap">
              <blockquote className="blockquote-color"><em>{summary}</em></blockquote>
              <h1>{title}</h1>
              <h2 className="light-grey-text">by {username}</h2>
              <h3 className="light-grey-text">posted on {formattedDate}</h3>
            </div>
            <div className="col s12 flex-wrap">
              <p>{body}</p>
            </div>
          </div>
          <hr className="mb-one-rem"/>
          <div className="row">
          <div className="justify-between align-center plr-three-fourth">
            <a className="font-two-rem" href={`#comments?postId=${this.props.postId}`}>
              <i className="far fa-comment comment-icon"></i>
            </a>
            <a className="font-bold" href={`#comments?postId=${this.props.postId}`}>
               {`${totalComments} Comments`}
            </a>
            </div>
          </div>
        </div>;
        </>;
  }
}

export default BlogView;
