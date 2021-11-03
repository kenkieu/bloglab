import React from 'react';
import Form from './components/form';
import Nav from './components/navbar';
import parseRoute from './lib/parse-route';

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
    console.log(route);
    // if (route.path === '') {
    return <Form />;
    // }
    // if (route.path === 'post') {
    //   const postId = route.params.get('postId');
    //   return <Blog postId={postId} />;
    // }
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
