import React from 'react';

class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      authorized: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDemo = this.handleDemo.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { action } = this.props;
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    };
    fetch(`/api/auth/${action}`, req)
      .then(res => res.json())
      .then(result => {
        if (action === 'sign-up') {
          window.location.hash = 'sign-in';
        } else if (result.user && result.token) {
          this.setState({ authorized: true });
          this.props.onSignIn(result);
        } else if (!result.token) {
          this.setState({ authorized: false });
        }
      });
  }

  handleDemo(event) {
    event.preventDefault();
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: 'guest', password: 'guest' })
    };
    fetch('/api/auth/sign-in', req)
      .then(res => res.json())
      .then(result => {
        if (result.user && result.token) {
          this.props.onSignIn(result);
        }
      });
  }

  render() {
    const { action } = this.props;
    const { handleChange, handleSubmit } = this;
    const alternateActionHref = action === 'sign-up'
      ? '#sign-in'
      : '#sign-up';
    const alternateActionText = action === 'sign-up'
      ? 'Already have an account?'
      : 'Create a new account';
    const submitButtonText = action === 'sign-up'
      ? 'Register'
      : 'Log In';
    const authFormHeading = action === 'sign-up'
      ? <>
        <i className="fas fa-user-alt blue-text text-darken-2 pr-half-rem" />
        Sign Up
      </>
      : <>
        <i className="fas fa-user-alt teal-text pr-half-rem" />
        Log In
      </>;

    const demoIcon = action === 'sign-up'
      ? <>
        <i className="material-icons tiny blue-text text-darken-2">flash_on</i>
              Live Demo
      </>

      : <>
          <i className="material-icons tiny teal-text">flash_on</i>
          Live Demo
        </>;

    const alternativeButtonColor = action === 'sign-up'
      ? 'btn-large btn-primary width-100 blue darken-2'
      : 'btn-large btn-primary width-100 teal';

    return (
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="row width-100 center">
          <h1 className="text-center">
            {authFormHeading}
          </h1>
          <div className='col s12 l12'>
            {this.state.authorized === false && (
              <div className='inc-pass red lighten-4 red-text text-darken-2 col s12 l12'>
                <p>
                Your password or username is incorrect. Please try again or {' '}
                <a className="red-text text-darken-2" href="#sign-up">
                  create a new account.
                </a>
                </p>
              </div>
            )}
          </div>
          <div className="input-field col s12 l12">
            <input required onChange={handleChange} name="username" id="username" type="text"/>
            <label htmlFor="username">Username</label>
          </div>
          <div className="input-field col s12 l12">
            <input required onChange={handleChange} name="password" id="password" type="password"/>
            <label htmlFor="password">Password</label>
          </div>
          {action === 'sign-up' &&
          <div className="input-field col s12 l12">
            <input required onChange={handleChange} name="email" id="email" type="email"/>
            <label htmlFor="email">Email</label>
          </div>
          }
          <div className="col s12 l12 mb-two-rem mt-one-rem justify-between align-center">
            <a href={alternateActionHref} className="bold underline">
              {alternateActionText}
            </a>
            <a onClick={this.handleDemo} className="click-target bold underline">
              {demoIcon}
            </a>
          </div>
          <div className="col s12 l12">
            <button type="submit" className={alternativeButtonColor}>
              {submitButtonText}
            </button>
          </div>
        </div>
      </form>
    );
  }
}

export default AuthForm;
