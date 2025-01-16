import React from 'react';
import NoResults from './no-results';
import ConnectionError from './connection-error';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      userPosts: [],
      showUserPosts: false,
      loading: false,
      error: false
    };
    this.togglePosts = this.togglePosts.bind(this);
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.setState({ error: false });
    fetch('/api/posts')
      .then(res => res.json())
      .then(posts => {
        this.setState({ posts });
        this.setState({ loading: false });
      })
      .catch(err => {
        this.setState({ loading: false });
        this.setState({ error: true });
        console.error(err);
      });

    const jwt = localStorage.getItem('jwt-token');
    const req = {
      method: 'GET',
      headers: {
        'x-access-token': jwt
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
    const { showUserPosts, loading, error } = this.state;
    const btnText = showUserPosts === false ? 'My Posts' : 'Your Feed';
    const headerText = showUserPosts === false ? 'Your Feed' : 'My Posts';

    return (
      <>
        {loading
          ? (
          <div className="container">
            <div className="row">
              <div className="col s12 l12">
                <div className="progress light-blue darken-2">
                  <div className="indeterminate blue darken-4"></div>
                </div>
              </div>
            </div>
          </div>
            )
          : error
            ? (
          <ConnectionError />
              )
            : (
          <>
            <div className="container feed flex-center flex-wrap">
              <div className="row width-100">
                <div className="col s12 l12">
                  <h1 className="flex-center">{headerText}</h1>
                </div>
              </div>
            </div>
            <div className="container">
              {!this.state.posts.length
                ? (
                <NoResults user={this.props.user} />
                  )
                : (
                <>
                  {this.props.user && (
                    <div className="row width-100 mb-two-rem">
                      <div className="col s6 l6">
                        <a
                          href="#form"
                          className="btn-large blue darken-2 width-100 waves-effect waves-light align-center flex-center gap-half"
                        >
                          NEW POST
                          <i className="material-icons">add</i>
                        </a>
                      </div>
                      <div className="col s6 s6">
                        <a
                          onClick={this.togglePosts}
                          className="btn-large grey darken-4 width-100 waves-effect waves-light align-center flex-center gap-half"
                        >
                          {btnText}
                          <i className="material-icons">library_books</i>
                        </a>
                      </div>
                    </div>
                  )}
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
                      ))}
                  </div>
                </>
                  )}
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
      <a href={`#post?postId=${postId}`}>
        <div className="card medium hoverable">
          <div className="card-image">
            <img src={imageUrl} alt="card-image" />
          </div>
          <div className="card-content">
            <span className="card-title">{title}</span>
            <p className="card-username blue-grey-text text-lighten-2">
              by {username}
            </p>
            <p className="card-summary">{summary}</p>
          </div>
        </div>
      </a>
    </>
  );
}

function MyPost(props) {
  const { postId, imageUrl, summary, title, username } = props.userPost;
  return (
    <>
      <div className="card medium hoverable">
        <div className="card-image">
          <a href={`#post?postId=${postId}`}>
            <img src={imageUrl} alt="card-image" />
          </a>
          <a
            href={`#edit-post?postId=${postId}`}
            className="btn-floating pulse btn halfway-fab waves-effect waves-light grey darken-4"
          >
            <i className="material-icons">edit</i>
          </a>
        </div>
        <div className="card-content">
          <span className="card-title">{title}</span>
          <p className="card-username">{username}</p>
          <p className="card-summary">{summary}</p>
        </div>
      </div>
    </>
  );
}

export default Home;
