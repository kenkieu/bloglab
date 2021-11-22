import React from 'react';

export default function ConnectionError(props) {
  return (
    <div className="container not-found">
      <div className="row flex-wrap" >
        <div className="col s12 l12 flex-center">
          <img src="images/no-connection.png" alt="no-connection-image" className="flex-center" />
        </div>
        <div className="col s12 l12 text-center">
          <h1 className="font-two-rem">
            Oops, looks like your internet is out. Please try again later!
          </h1>
          <a href={window.location.reload()} className="btn-large grey darken-4">Reload</a>
        </div>
      </div>
    </div>
  );
}
