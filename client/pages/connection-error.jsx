import React from 'react';

function reloadPage() {
  window.location.reload(true);
}

export default function ConnectionError(props) {
  return (
    <div className="container no-connection align-center">
      <div className="row text-center align-items blue-grey-text text-lighten-2 width-100">
        <div className='mb-one-rem '>
          <i className="material-icons medium">signal_wifi_off</i>
        </div>
        <h2 className=''>
          Oops, looks like your internet is out.
        </h2>
        <p>Try reloading the page!</p>
        <button onClick={reloadPage} className="btn teal btn-large width-100 mt-two-rem">Reload</button>
      </div>
    </div>
  );
}
