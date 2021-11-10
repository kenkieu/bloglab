import React from 'react';
import Redirect from '../components/redirect';
import AuthForm from '../components/auth-form';
import AppContext from '../lib/app-context';

class AuthPage extends React.Component {
  render() {
    const { user, route, handleSignIn } = this.context;

    if (user) return <Redirect to="" />;

    return (
      <div className="container">
        <AuthForm
          key={route.path}
          action={route.path}
          onSignIn={handleSignIn} />
      </div>
    );
  }
}

export default AuthPage;

AuthPage.contextType = AppContext;
