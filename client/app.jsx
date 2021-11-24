import React from 'react';
import AppContext from './lib/app-context';
import parseRoute from './lib/parse-route';
import decodeToken from './lib/decode-token';
import Navbar from './components/navbar';
import Home from './pages/home';
import Form from './pages/form';
import BlogView from './pages/blog-view';
import EditForm from './pages/edit-form';
import CommentPage from './pages/comment-page';
import AuthPage from './pages/auth-page';
import NotFound from './pages/not-found';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isAuthorizing: true,
      route: parseRoute(window.location.hash)
    };
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({ route: parseRoute(window.location.hash) });
    });
    const token = window.localStorage.getItem('jwt-token');
    const user = token ? decodeToken(token) : null;
    this.setState({ user, isAuthorizing: false });
  }

  handleSignIn(result) {
    const { user, token } = result;
    window.localStorage.setItem('jwt-token', token);
    this.setState({ user });
  }

  handleSignOut() {
    window.localStorage.removeItem('jwt-token');
    this.setState({ user: null });
  }

  renderPage() {
    const { path, params } = this.state.route;

    if (path === '') {
      return <Home user={this.state.user}/>;
    }
    if (path === 'sign-in' || path === 'sign-up') {
      return <AuthPage />;
    }
    if (path === 'form') {

      return <Form />;
    }
    if (path === 'post') {
      const postId = params.get('postId');
      return <BlogView postId={postId} user={this.state.user}/>;
    }
    if (path === 'edit-post') {
      const postId = params.get('postId');
      return <EditForm postId={postId} />;
    }
    if (path === 'comments') {
      const postId = params.get('postId');
      return <CommentPage user={this.state.user} postId={postId}/>;
    }
    return <NotFound />;
  }

  render() {
    if (this.state.isAuthorizing) return null;
    const { user, route } = this.state;
    const { handleSignIn, handleSignOut } = this;
    const contextValue = { user, route, handleSignIn, handleSignOut };
    return (
      <AppContext.Provider value={contextValue}>
        <>
          <Navbar />
          { this.renderPage() }
        </>
      </AppContext.Provider>
    );
  }
}
