import React from 'react';
import Nav from './components/navbar';
import Home from './pages/home';
import Form from './pages/form';
import BlogView from './pages/blogview';
import parseRoute from './lib/parse-route';
import CommentPage from './pages/commentpage';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { route: parseRoute(window.location.hash) };
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({ route: parseRoute(window.location.hash) });
    });
  }

  renderPage() {
    const { route } = this.state;
    if (route.path === '') {
      return <Home />;
    }
    if (route.path === 'form') {
      return <Form />;
    }
    if (route.path === 'post') {
      const postId = route.params.get('postId');
      return <BlogView postId={ postId }/>;
    }
    if (route.path === 'comments') {
      const postId = route.params.get('postId');
      return <CommentPage postId={postId}/>;
    }
  }

  render() {
    return (
      <>
        <Nav />
        { this.renderPage() }
      </>
    );
  }
}
