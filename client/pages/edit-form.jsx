import React from 'react';

class EditForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: '',
      summary: '',
      title: '',
      body: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    const { imageUrl, summary, title, body } = this.state;
    const { handleChange, handleSubmit } = this;
    return <>
      <div className="container">
        <div className="row">
          <div className="col s12">
            <h1 className="font-two-rem">Edit Blog</h1>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="mt-two-rem">
          <div className="row">
            <div className="col s12 l6">
              <img className="width-100" src={!imageUrl ? 'images/placeholder.png' : imageUrl} alt="image" />
            </div>
            <div className="input-field col s12 l6 mb-two-rem">
              <input required onChange={handleChange} id="image-url" type="text" name="imageUrl" value={imageUrl}/>
              <label htmlFor="image-url">Image URL</label>
            </div>
            <div className="input-field col s12 l6 mb-two-rem">
              <input required onChange={handleChange} id="title" type="text" name="title" value={title}/>
              <label htmlFor="title">Title</label>
            </div>
            <div className="input-field col s12 l6 mb-two-rem">
              <input required onChange={handleChange} id="summary" type="text" name="summary" value={summary}/>
              <label htmlFor="summary">Summary</label>
            </div>
            <div className="row">
              <div className="input-field col s12 l12 mb-two-rem">
                <textarea required onChange={handleChange} id="body" name="body" className="materialize-textarea" value={body}></textarea>
                <label htmlFor="body">Body</label>
              </div>
            </div>
            <div className="row">
              <div className="col s6">
                <a href="#" className="btn waves-effect waves-light grey darken-2">Cancel
                  <i className="material-icons right">cancel</i>
                </a>
              </div>
              <div className="col s6 flex-end">
                <button className="btn waves-effect waves-light" type="submit">Save
                  <i className="material-icons right">save</i>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>;
  }

  componentDidMount() {
    fetch(`/api/posts/${this.props.postId}`)
      .then(res => res.json())
      .then(post => {
        const { imageUrl, summary, title, body } = post;
        this.setState({
          imageUrl: imageUrl,
          summary: summary,
          title: title,
          body: body
        });
      });
  }

  handleChange(event) {
    const value = event.target.value;
    this.setState({ [event.target.name]: value });
  }

  handleSubmit() {
    event.preventDefault();
    const jwtToken = localStorage.getItem('jwt-token');
    const editedPost = this.state;
    const req = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': jwtToken
      },
      body: JSON.stringify(editedPost)
    };
    fetch(`/api/posts/${this.props.postId}`, req)
      .then(res => res.json())
      .then(data => {
        window.location.hash = `post?postId=${data.postId}`;
      })
      .catch(err => console.error(err));
  }
}

export default EditForm;
