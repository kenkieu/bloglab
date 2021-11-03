import React from 'react';
import Form from './components/form';
import Nav from './components/navbar';

export default class App extends React.Component {
  render() {
    return (
      <>
      <Nav />
      <Form />
      </>
    );
  }
}
