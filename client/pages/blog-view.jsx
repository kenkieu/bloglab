import React from 'react';
import { format } from 'date-fns';
import NotFound from './not-found';
import ConnectionError from './connection-error';

class BlogView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailBtnClicked: false,
      linkBtnClicked: false,
      post: {},
      viewerEmail: '',
      loading: false,
      error: false
    };
    this.toggleLike = this.toggleLike.bind(this);
    this.copyPageUrl = this.copyPageUrl.bind(this);
    this.emailPost = this.emailPost.bind(this);
  }

  componentDidMount() {
    const jwt = localStorage.getItem('jwt-token');
    const firstReq = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': jwt
      }
    };
    fetch('/api/email-share', firstReq)
      .then(res => res.json())
      .then(data => {
        this.setState({ viewerEmail: data.email });
      })
      .catch(err => console.error(err));

    this.setState({ loading: true });
    this.setState({ error: false });
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
                'x-access-token': jwt
              }
            };
            fetch(`/api/liked/${this.props.postId}`, req)
              .then(res => res.json())
              .then(data => {
                const { userLiked } = data;
                const post = { ...postInfo, userLiked, totalLikes };
                this.setState({ post });
                this.setState({ loading: false });
              })
              .catch(err => console.error(err));
          })
          .catch(err => console.error(err));
      })
      .catch(err => {
        this.setState({ loading: false });
        this.setState({ error: true });
        console.error(err);
      });
  }

  toggleLike() {
    const { userId, postId, userLiked } = this.state.post;
    const jwt = localStorage.getItem('jwt-token');
    const newLike = {
      postId: postId,
      userId: userId
    };

    if (userLiked) {
      const req = {
        method: 'DELETE',
        headers: {
          'x-access-token': jwt
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
          'x-access-token': jwt
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
    this.setState({ linkBtnClicked: true });
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
    const { imageUrl, summary, title, username, createdAt, body, totalComments, totalLikes } = this.state.post;
    const { loading, error } = this.state;
    let formattedDate;
    if (createdAt) {
      formattedDate = format(new Date(createdAt), 'MMMM dd, yyyy');
    }
    return (
      <>
      <div className="container blogpost">
        {loading
          ? <div className="row">
              <div className="col s12 l12">
                <div className="progress">
                  <div className="indeterminate"></div>
                </div>
              </div>
            </div>
          : error
            ? <ConnectionError />
            : <>
          {this.state.post.error
            ? <NotFound />
            : (
              <>
              <div className="row">
                <div className="col s12 l6 flex-wrap">
                  <img src={imageUrl} alt="image" className="width-100" />
                </div>
                <div className="col s12 l6 flex-wrap">
                  <blockquote className="blockquote-color width-100"><em>{summary}</em></blockquote>
                  <h2 className="width-100">{title}</h2>
                  <h3 className="blue-grey-text text-lighten-2 width-100">by {username}</h3>
                  <h3 className="blue-grey-text text-lighten-2 width-100">posted on {formattedDate}</h3>
                  <div className="col s6 l6 share-btn pr-half-rem mt-one-rem">
                    {!this.state.emailBtnClicked
                      ? (
                        <a onClick={this.emailPost} className='waves-effect waves-light btn-large grey lighten-1 width-100'>
                          <i className="fas fa-envelope share-icon"></i>
                        </a>
                        )
                      : <>
                        {this.props.user
                          ? (
                            <a onClick={this.emailPost} className='teal waves-effect waves-light btn-large width-100'>
                              Email Sent
                              {/* <i className="fas fa-envelope-open share-icon"></i> */}
                            </a>
                            )
                          : (
                            <a onClick={this.emailPost} className='waves-effect waves-light btn-large width-100 red darken-2'>
                              <i className="fas fa-envelope share-icon"></i>
                            </a>
                            )
                        }
                      </>
                    }
                  </div>
                  <div onClick={this.copyPageUrl} className="col s6 l6 share-btn pl-half-rem mt-one-rem">
                    <a className="waves-effect waves-light btn-large width-100 share-btn grey darken-4">
                      {!this.state.linkBtnClicked
                        ? <i className="fas fa-link share-icon"></i>
                        : <span>Link Copied</span>
                     }
                    </a>
                  </div>
                </div>
                <div className="col s12 flex-wrap mt-one-rem">
                  <p>{body}</p>
                </div>
              </div>
              <hr className="mb-one-half" />
              <div className="row">
                <div className="justify-between align-center plr-three-fourth">
                  <div>
                      {this.props.user
                        ? (!this.state.post.userLiked
                            ? <a onClick={this.toggleLike} className="font-two-rem mr-third-rem click-target">
                              <i className="far fa-heart"></i>
                              </a>
                            : <a onClick={this.toggleLike} className="font-two-rem mr-third-rem click-target">
                              <i className="fas fa-heart red-text text-darken-2"></i>
                              </a>
                          )
                        : <i className="fas fa-heart-broken grey-text mr-third-rem font-two-rem"></i>
                      }
                    <a className="font-two-rem ml-third-rem" href={`#comments?postId=${this.props.postId}`}>
                      {this.props.user
                        ? <i className="far fa-comment"></i>
                        : <i className="fas fa-comment grey-text"></i>}
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
            </>
              )
          }
          </>
        }
      </div>
      </>
    );
  }
}

export default BlogView;
