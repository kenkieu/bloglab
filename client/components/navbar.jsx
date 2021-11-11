import React from 'react';
import AppContext from '../lib/app-context';
import Redirect from '../components/redirect';

export default class Navbar extends React.Component {
  render() {
    const { user, handleSignOut } = this.context;

    return <>
        <nav className="grey darken-4 mb-two-rem">
          <div className="nav-wrapper">
            <a href="#" className="brand-logo center">bloglab</a>

            {/* {user === null &&
              <Redirect to="" />
            } */}
            {user !== null &&
            < a href="" onClick={handleSignOut}>
              <i className="fas fa-sign-out-alt right nav-icon"></i>
            </a>
            }
          </div>
        </nav>
      </>;
  }
}

Navbar.contextType = AppContext;
