import React from 'react';
import { format } from 'date-fns';

class BlogView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailBtnClicked: false,
      post: null,
      viewerEmail: ''
    };
    this.toggleLike = this.toggleLike.bind(this);
    this.copyPageUrl = this.copyPageUrl.bind(this);
    this.emailPost = this.emailPost.bind(this);
  }

  componentDidMount() {
    const jwtToken = localStorage.getItem('jwt-token');
    const firstReq = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': jwtToken
      }
    };
    fetch('/api/email-share', firstReq)
      .then(res => res.json())
      .then(data => {
        this.setState({ viewerEmail: data.email });
      })
      .catch(err => console.error(err));

    fetch(`/api/posts/${this.props.postId}`)
      .then(res => res.json())
      .then(postInfo => {
        fetch(`/api/likes/${this.props.postId}`)
          .then(res => res.json())
          .then(data => {
            const totalLikes = Number(data.totalLikes);
            const req = {
              method: 'GET',
              headers: {
                'x-access-token': jwtToken
              }
            };
            fetch(`/api/liked/${this.props.postId}`, req)
              .then(res => res.json())
              .then(data => {
                const { userLiked } = data;
                const post = { ...postInfo, userLiked, totalLikes };
                this.setState({ post });
              })
              .catch(err => console.error(err));
          })
          .catch(err => console.error(err));
      })
      .catch(err => console.error(err));
  }

  toggleLike() {
    const { userId, postId, userLiked } = this.state.post;
    const jwtToken = localStorage.getItem('jwt-token');
    const newLike = {
      postId: postId,
      userId: userId
    };

    if (userLiked) {
      const req = {
        method: 'DELETE',
        headers: {
          'x-access-token': jwtToken
        }
      };
      fetch(`/api/likes/${postId}`, req)
        .catch(err => console.error(err));

      this.props.user && this.setState(prevState => ({
        post: { ...prevState.post, userLiked: false, totalLikes: this.state.post.totalLikes - 1 }
      }));
    } else {
      const req = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': jwtToken
        },
        body: JSON.stringify(newLike)
      };
      fetch('/api/likes', req)
        .then(res => res.json())
        .catch(err => console.error(err));
      this.props.user && this.setState(prevState => ({
        post: { ...prevState.post, userLiked: true, totalLikes: this.state.post.totalLikes + 1 }
      }));
    }
  }

  copyPageUrl() {
    navigator.clipboard.writeText(window.location.href)
      .catch(err => console.error('Failed to copy:', err));
  }

  emailPost() {
    this.setState({ emailBtnClicked: true });
    const { title, summary, body, username, totalLikes, totalComments } = this.state.post;
    const { viewerEmail: email } = this.state;
    const sharePost = {
      title: title,
      summary: summary,
      body: body,
      email: email,
      username: username,
      totalLikes: totalLikes,
      totalComments: totalComments
    };

    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sharePost)
    };

    fetch('/api/email-share', req)
      .then(res => res.json())
      .catch(err => console.error(err));
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
              <div className="col s6 l6 share-btn pr-half-rem mt-one-rem">
                {!this.state.emailBtnClicked
                  ? <a onClick={this.emailPost} className='waves-effect waves-light btn-large grey lighten-1 width-100'>
                    <i className="fas fa-envelope share-icon"></i>
                    </a>
                  : <>
                    {this.props.user
                      ? <a onClick={this.emailPost} className='waves-effect waves-light btn-large width-100'>
                      <i className="fas fa-envelope-open share-icon"></i>
                    </a>
                      : <a onClick={this.emailPost} className='waves-effect waves-light btn-large width-100 red lighten-1'>
                      <i className="fas fa-envelope share-icon"></i>
                    </a>
                    }
                    </>
                  }
              </div>
              <div onClick={this.copyPageUrl} className="col s6 l6 share-btn pl-half-rem mt-one-rem">
                <a className="waves-effect waves-light btn-large width-100 share-btn grey darken-4">
                  <i className="fas fa-link share-icon"></i>
                </a>
              </div>
            </div>
            <div className="col s12 flex-wrap mt-one-rem">
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
            <div className="bold">
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
