import React from 'react';

class EditForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: '',
      summary: '',
      title: '',
      body: '',
      modalOpen: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  render() {
    const { imageUrl, summary, title, body, modalOpen } = this.state;
    const { handleChange, handleSubmit, handleDelete, closeModal, openModal } = this;
    return <>
      {modalOpen &&
      <div className="container">
        <div className="row modal-bg flex-center align-center">
          <div className="custom-modal">
            <div className="body">
              <h4>Are you sure?</h4>
              <p>Do you really want to delete this post? This action cannot be undone.</p>
            </div>
            <div className="justify-between footer">
              <a onClick={closeModal} className="modal-close waves-effect waves-gray btn-flat">Cancel</a>
              <a onClick={handleDelete} href="#" className="modal-close waves-effect waves-red btn-flat red-text text-darken-2">Delete</a>
            </div>
          </div>
        </div>
      </div>
      }
      <div className="container edit-form">
        <div className="row">
          <div className="col s12 justify-between align-center mt-half-rem">
            <h1 className="m-0">Edit Blog</h1>
            <a onClick={openModal} className="waves-effect waves-light btn modal-trigger red darken-2 trash-btn flex-center align-center">
              <i className="material-icons trash-icon">delete</i>
            </a>
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
                <a href="#" className="btn teal waves-effect waves-light grey darken-2">Cancel
                  <i className="material-icons right">cancel</i>
                </a>
              </div>
              <div className="col s6 flex-end">
                <button className="btn teal waves-effect waves-light" type="submit">Save
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
        }, () => {
          M.updateTextFields();
        });
      })
      .catch(err => console.error(err));
  }

  openModal() {
    this.setState({ modalOpen: true });
  }

  closeModal() {
    this.setState({ modalOpen: false });
  }

  handleChange(event) {
    const value = event.target.value;
    this.setState({ [event.target.name]: value });
  }

  handleSubmit() {
    event.preventDefault();
    const jwt = localStorage.getItem('jwt-token');
    const editedPost = this.state;
    const req = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': jwt
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

  handleDelete() {
    const jwt = localStorage.getItem('jwt-token');
    const req = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': jwt
      }
    };
    fetch(`/api/posts/${this.props.postId}`, req)
      .catch(err => console.error(err));
  }
}

export default EditForm;
