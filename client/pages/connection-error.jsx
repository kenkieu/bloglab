import React from 'react';

export default function ConnectionError(props) {
  return (
    <div className="container no-connection">
      <div className="row flex-wrap" >
        <div className="col s12 l12 text-center">
          <h1 className="font-two-rem">
            Oops, looks like your internet is out. Please try again later!
          </h1>
        </div>
      </div>
    </div>
  );
}
