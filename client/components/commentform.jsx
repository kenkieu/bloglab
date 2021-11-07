import React from 'react';

class CommentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: 1,
      postId: null,
      content: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    return <>
    <div className="container">
        <form onSubmit={this.handleSubmit} >
        <div className="input-field col s12 l12">
          <input required onChange={this.handleChange} id="comment" type="text" name="content" value={this.state.content} />
          <label htmlFor="comment">Leave a comment if you&apos;d like...</label>
        </div>
        <div className="col s12 l12 width-100">
          <button className="btn-large blue width-100 mb-two-rem" type="submit" name="action">Submit</button>
        </div>
      </form>
    </div>
    </>;
  }

  componentDidMount() {
    this.setState({ postId: this.props.postId });
  }

  handleChange(event) {
    const value = event.target.value;
    this.setState({ [event.target.name]: value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const newComment = this.state;
    this.props.onSubmit(newComment);
    this.setState({ content: '' });
  }
}

export default CommentForm;
