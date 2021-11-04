import React from 'react';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: []
    };
  }

  componentDidMount() {
    fetch('/api/posts')
      .then(res => res.json())
      .then(posts => this.setState({ posts }));
  }

  render() {
    return <>
      <div className="container feed flex-center flex-wrap">
        <div className="row">
          <div>
            <h1 className="flex-center">Your Feed</h1>
          </div>
          <div className="col s6 l6">
            <a href="#form" className="btn blue width-100">CREATE A POST</a>
          </div>
          <div className="col s6 l6">
            <a className="btn grey darken-4 width-100">MY POSTS</a>
          </div>
        </div>
        <div className="row">
          {this.state.posts.map(post => (
            <div key={post.postId} className="col s12 l6">
              <Post post={post} />
            </div>
          ))}
        </div>
      </div>
    </>;
  }
}

function Post(props) {
  const { postId, imageUrl, summary, title } = props.post;

  return <>
    <div className="card large">
      <div className="card-image">
        <a href={`#post?postId=${postId}`}>
          <img src={imageUrl} alt="card-image" />
        </a>
      </div>
      <div className="card-content">
        <span className="card-title">{title}</span>
        <p>{summary}</p>
      </div>
    </div>
    </>;
}

export default Home;
