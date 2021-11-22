import React from 'react';
import NoResults from './no-results';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      userPosts: [],
      showUserPosts: false,
      loading: false
    };
    this.togglePosts = this.togglePosts.bind(this);
  }

  componentDidMount() {
    this.setState({ loading: true });
    fetch('/api/posts')
      .then(res => res.json())
      .then(posts => {
        this.setState({ posts });
        this.setState({ loading: false });
      })
      .catch(err => console.error(err));

    const jwtToken = localStorage.getItem('jwt-token');
    const req = {
      method: 'GET',
      headers: {
        'x-access-token': jwtToken
      }
    };
    fetch('/api/my-posts', req)
      .then(res => res.json())
      .then(userPosts => {
        this.setState({ userPosts });
      })
      .catch(err => console.error(err));
  }

  togglePosts() {
    this.setState({ showUserPosts: !this.state.showUserPosts });
  }

  render() {
    const { showUserPosts, loading } = this.state;
    const btnText = showUserPosts === false
      ? 'My Posts'
      : 'Your Feed';
    const headerText = showUserPosts === false
      ? 'Your Feed'
      : 'My Posts';

    return (
      <>
      {loading
        ? (
          <div className="container">
            <div className="row">
              <div className="col s12 l12">
                <div className="progress">
                  <div className="indeterminate"></div>
                </div>
              </div>
            </div>
          </div>
          )
        : (
        <>
          <div className="container feed flex-center flex-wrap">
            <div className="row width-100">
              <div className="col s12 l12">
                <h1 className="flex-center font-two-rem">{headerText}</h1>
              </div>
            </div>
          </div>
          <div className="container">
            {!this.state.posts.length
              ? <NoResults user={this.props.user} />
              : (
                <>
                {this.props.user && <div className="row width-100">
                  <div className="col s6 l6">
                    <a href="#form" className="mb-one-rem btn-large blue width-100">NEW POST</a>
                  </div>
                  <div className="col s6 s6">
                    <a onClick={this.togglePosts} className="mb-one-rem btn-large grey darken-4 width-100">{btnText}</a>
                  </div>
                </div>
                }
                <div className="row flex-wrap">
                  {!this.state.showUserPosts
                    ? this.state.posts.map(post => (
                      <div key={post.postId} className="col s12 l6 m-0">
                        <Post post={post} />
                      </div>
                    ))
                    : this.state.userPosts.map(userPost => (
                      <div key={userPost.postId} className="col s12 l6 m-0">
                        <MyPost userPost={userPost} />
                      </div>
                    ))
                  }
                </div>
                </>
                )
            }
          </div>
        </>
          )}
    </>
    );
  }
}

function Post(props) {
  const { postId, imageUrl, summary, title, username } = props.post;
  return (
  <>
    <div className="card large">
      <div className="card-image">
        <a href={`#post?postId=${postId}`}>
          <img src={imageUrl} alt="card-image" />
        </a>
      </div>
      <div className="card-content">
        <span className="card-title">{title}</span>
        <p className="card-username">by {username}</p>
        <p>{summary}</p>
      </div>
    </div>
    </>
  );
}

function MyPost(props) {
  const { postId, imageUrl, summary, title, username } = props.userPost;
  return (
  <>
    <div className="card large">
      <div className="card-image">
        <a href={`#post?postId=${postId}`}>
          <img src={imageUrl} alt="card-image" />
        </a>
        <a href={`#edit-post?postId=${postId}`} className="btn-floating btn-large halfway-fab waves-effect waves-light blue">
          <i className="material-icons">edit</i>
        </a>
      </div>
      <div className="card-content">
        <span className="card-title">{title}</span>
        <p className="card-username">{username}</p>
        <p>{summary}</p>
      </div>
    </div>
  </>
  );
}

export default Home;
