import React from 'react';

class NoResults extends React.Component {
  render(props) {
    return <>
    <div className="row flex-wrap no-results align-center" >
      <div className="col s12 l12 flex-center">
        <img src="images/magnifying-glass.png" alt="no-results-image" className="flex-center" />
      </div>
      <div className="col s12 l12 text-center">
        <h1>
          Sorry, we couldn&apos;t find any results!
        </h1>
        {this.props.user
          ? <a href="#form" className="btn-large blue darken-2 waves-effect waves-light">NEW POST</a>
          : <a className="disabled btn-large blue darken-2 waves-effect waves-light">NEW POST</a>
        }
      </div>
    </div>
  </>;
  }
}

export default NoResults;
