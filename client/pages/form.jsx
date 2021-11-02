import React from 'react';

export default function Form(props) {
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col s12">
            <h3>Create Blog</h3>
          </div>
        </div>
        <form className="mt-two-rem">
          <div className="row">
            <div className="col s12 l6">
              <img src="images/placeholder.png" alt="" />
            </div>
            <div className="input-field col s12 l6 mb-two-rem">
              <input id="image-url" type="text" className="validate" />
              <label htmlFor="image-url">Image URL</label>
            </div>
            <div className="input-field col s12 l6 mb-two-rem">
              <input id="summary" type="text" className="validate" />
              <label htmlFor="summary">Summary</label>
            </div>
            <div className="input-field col s12 l6 mb-two-rem">
              <input id="title" type="text" className="validate" />
              <label htmlFor="title">Title</label>
            </div>
          <div className="row">
            <div className="input-field col s12 l12 mb-two-rem">
              <textarea id="body" className="materialize-textarea"></textarea>
              <label htmlFor="body">Body</label>
            </div>
          </div>
          <div className="row">
              <div className="col s6">
                <button className="btn waves-effect waves-light grey darken-2">Cancel
                  <i className="material-icons right">cancel</i>
                </button>
              </div>
            <div className="col s6 flex-end">
              <button className="btn waves-effect waves-light" type="submit" name="action">Submit
                <i className="material-icons right">send</i>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
    </>
  );
}
