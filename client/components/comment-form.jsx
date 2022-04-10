import React from 'react';

class CommentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postId: '',
      content: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    return (
      <>
      {!this.props.user
        ? <form onSubmit={this.handleSubmit} >
          <div className="input-field col s12 l12">
            <input required onChange={this.handleChange} id="comment" type="text" name="content" value={this.state.content} />
            <label className="blue-grey-text text-lighten-2" htmlFor="comment">Log in to leave a comment...</label>
          </div>
          <div className="col s12 l12 width-100">
            <button className="btn-large disabled width-100 mb-two-rem" name="action">Submit</button>
          </div>
        </form>

        : <form onSubmit={this.handleSubmit} >
          <div className="input-field col s12 l12">
            <input required onChange={this.handleChange} id="comment" type="text" name="content" value={this.state.content} />
            <label className="blue-grey-text text-lighten-2" htmlFor="comment">Leave a comment if you&apos;d like...</label>
          </div>
          <div className="col s12 l12 width-100">
            <button className="btn-large blue darken-2 width-100 mb-two-rem" type="submit" name="action">Submit</button>
          </div>
        </form>
      }
      </>
    );
  }

  componentDidMount() {
    this.setState({ postId: this.props.postId });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const newComment = this.state;
    this.props.onSubmit(newComment);
    this.setState({ content: '' });
  }
}

export default CommentForm;
