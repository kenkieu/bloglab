import React from 'react';
import AppContext from '../lib/app-context';

export default class Navbar extends React.Component {
  render() {
    const { user, handleSignOut } = this.context;
    const { path } = this.context.route;

    return <>
        <nav className="grey darken-4 mb-two-rem">
          <div className="nav-wrapper">
            <a href="#" className="brand-logo center">bloglab</a>
            {user === null && path === 'sign-up'
              ? <a href="#sign-in">
              <i className="fas fa-user-alt blue-icon right nav-icon" />
              </a>
              : <a href="#sign-up">
              <i className="fas fa-user-alt green-icon right nav-icon" />
             </a>
            }
            {user !== null &&
            < a href="#sign-in" onClick={handleSignOut}>
              <i className="fas fa-sign-out-alt right nav-icon"></i>
            </a>
            }
          </div>
        </nav>
      </>;
  }
}

Navbar.contextType = AppContext;
