import React from 'react';
import AppContext from '../lib/app-context';

export default class Navbar extends React.Component {
  render() {
    const { user, handleSignOut } = this.context;
    const { path } = this.context.route;
    return <>
        <nav className="grey darken-4">
          <div className="nav-wrapper">
            <a href="#" className="brand-logo center grey-text text-lighten-5">bloglab</a>
            {user !== null
              ? <a href="#sign-in" onClick={handleSignOut}>
                <i className="fas fa-sign-out-alt right nav-icon align-center grey-text text-lighten-5"></i>
               </a>
              : path === 'sign-in'
                ? (
                  <a className="right align-center nav-link grey-text text-lighten-5" href="#sign-up">
                    Sign Up
                  </a>
                  )
                : <a className="right align-center nav-link grey-text text-lighten-5" href="#sign-in">
                Log In
              </a>
            }
          </div>
        </nav>
      </>;
  }
}

Navbar.contextType = AppContext;
