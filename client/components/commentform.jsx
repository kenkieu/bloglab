import React from 'react';
import parseRoute from '../lib/parse-route';

export default class CommentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash),
      user: 1,
      postId: '',
      content: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({ route: parseRoute(window.location.hash) });
    });
  }

  render() {
    return (
    <>
    <div className="container">
      <form>
        <div className="input-field col s12 l12 mb-two-rem">
          <input required onChange={this.handleChange} id="comment" type="text" name="content" />
          <label htmlFor="comment">Leave a comment if you&apos;d like...</label>
        </div>
        <div className="col s12 l12 width-100">
          <button onClick={this.handleSubmit} className="btn-large blue width-100" type="submit" name="action">Submit</button>
        </div>
      </form>
    </div>
    </>
    );
  }

  handleChange(event) {
    const value = event.target.value;
    this.setState({ [event.target.name]: value });
  }

  handleSubmit() {
    event.preventDefault();
    const { route } = this.state;
    console.log(window.location.hash);
    const postPath = parseRoute(route.params.get('postId'));
    const postId = postPath.path;
    this.setState({ postId: Number(postId) });
    const newComment = this.state.postId;
    console.log(newComment);
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newComment)
    };
    fetch('/api/comments', req)
      .then(res => res.json())
      .then(data => {
        console.log(data);
      })
      .catch(err => console.error(err));
  }
}
