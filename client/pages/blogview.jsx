import React from 'react';
import { format } from 'date-fns';

class BlogView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post: null
    };
    this.toggleLike = this.toggleLike.bind(this);
    this.copyPageUrl = this.copyPageUrl.bind(this);
  }

  componentDidMount() {
    fetch(`/api/posts/${this.props.postId}`)
      .then(res => res.json())
      .then(postInfo => {
        fetch(`api/likes/${this.props.postId}`)
          .then(res => res.json())
          .then(likes => {
            const { userLiked } = likes;
            const totalLikes = Number(likes.totalLikes);
            const post = { ...postInfo, totalLikes, userLiked };
            this.setState({ post });
          })
          .catch(err => console.error(err));
      })
      .catch(err => console.error(err));
  }

  toggleLike() {
    const { postId, userId, userLiked } = this.state.post;
    const newLike = {
      postId: postId,
      userId: userId
    };

    if (userLiked) {
      const req = {
        method: 'DELETE'
      };
      fetch(`/api/likes/${postId}`, req)
        .catch(err => console.error(err));
      this.setState(prevState => ({
        post: { ...prevState.post, userLiked: false, totalLikes: this.state.post.totalLikes - 1 }
      }));
    } else {
      const req = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newLike)
      };
      fetch('/api/likes', req)
        .then(res => {
          res.json();
        })
        .catch(err => console.error(err));
      this.setState(prevState => ({
        post: { ...prevState.post, userLiked: true, totalLikes: this.state.post.totalLikes + 1 }
      }));
    }
  }

  copyPageUrl() {
    navigator.clipboard.writeText(window.location.href)
      .catch(err => console.error('Failed to copy:', err));
  }

  render() {
    if (!this.state.post) return null;
    const { imageUrl, summary, title, username, createdAt, body, totalComments, totalLikes } = this.state.post;
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
              <div onClick={this.copyPageUrl} className="col s6 l6 share-btn pad-l-half-rem mt-one-rem">
                <a className="waves-effect waves-light btn-large width-100 share-btn black">
                  <i className="fas fa-link share-icon"></i>
                </a>
              </div>
            </div>
            <div className="col s12 flex-wrap">
              <p>{body}</p>
            </div>
          </div>
          <hr className="mb-one-rem"/>
          <div className="row">
          <div className="justify-between align-center plr-three-fourth">
            <div>
              <a onClick={this.toggleLike} className="font-two-rem mr-third-rem click-target">
                {!this.state.post.userLiked
                  ? <i className="far fa-heart"></i>
                  : <i className="fas fa-heart heart-color"></i>}
              </a>
            <a className="font-two-rem ml-third-rem" href={`#comments?postId=${this.props.postId}`}>
                <i className="far fa-comment"></i>
              </a>
            </div>
            <div className="font-bold">
              <a className="mr-third-rem">
                {`${totalLikes} Likes`}
              </a>
              <a className="ml-third-rem" href={`#comments?postId=${this.props.postId}`}>
                {`${totalComments} Comments`}
              </a>
            </div>
            </div>
          </div>
        </div>;
        </>;
  }
}

export default BlogView;
