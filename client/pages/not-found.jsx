import React from 'react';

export default function NotFound(props) {
  return (
      <div className="container not-found">
      <div className="row flex-wrap" >
        <div className="col s12 l12 flex-center">
          <img src="images/404-image.png" alt="not-found-image" className="flex-center"/>
        </div>
        <div className="col s12 l12 text-center">
          <h3>
            Uh oh, we could not find the page you were looking for!
          </h3>
          <a href="#" className="btn-large grey darken-4">Return Home</a>
        </div>
        </div>
      </div>
  // </div>
  );
}
