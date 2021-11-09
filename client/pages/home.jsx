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
      <div className="row width-100">
        <div className="col s12 l12">
          <h1 className="flex-center">Your Feed</h1>
        </div>
      </div>
    </div>;
    <div className="container">
      {!this.state.posts.length
        ? NoResults()
        : <>
        <div className="row width-100">
          <div className="col s6 l6">
              <a href="#form" className="mb-one-rem btn-large blue width-100">CREATE A POST</a>
          </div>
        </div>
        <div className="row flex-wrap">
          {this.state.posts.map(post => (
            <div key={post.postId} className="col s12 l6">
              <Post post={post} />
            </div>
          ))
          }
        </div>
        </>
      }
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

function NoResults() {
  return <>
    <div className="row width-100">
      <div className="col s12 l12">
        <a href="#form" className="btn-large blue width-100">CREATE A POST</a>
      </div>
    </div>
    <div className="row text-center">
      <img className="no-results-icon" src="images/sad-cry-solid.svg" alt="no-results-image" />
      <h1 className="no-results-text">Sorry, we couldn&apos;t find any results!</h1>
    </div>
  </>;
}

export default Home;
