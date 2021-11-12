import React from 'react';

export default function NotFound(props) {
  return (
      <div className="container not-found">
        <div className="row flex-wrap" >
          <div className="col s12 l12 flex-center">
            <img src="images/404-image-cropped.png" alt="not-found-image" className="flex-center"/>
          </div>
          <div className="col s12 l12 text-center">
            <h1 className="font-two-rem">
              No pages here, just this kitty.
            </h1>
            <a href="#" className="btn-large grey darken-4">Return Home</a>
          </div>
        </div>
      </div>
  );
}
