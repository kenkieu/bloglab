import React from 'react';

class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
    const alternatActionText = action === 'sign-up'
      ? 'Already have an account?'
      : 'Create a new account';
    const submitButtonText = action === 'sign-up'
      ? 'Register'
      : 'Log In';
    const authFormHeading = action === 'sign-up'
      ? <>
        <i className="fas fa-user-alt blue-icon pr-half-rem" />
          Sign Up
        </>
      : <>
        <i className="fas fa-user-alt green-icon pr-half-rem" />
          Log In
        </>;

    const alternativeButtonColor = action === 'sign-up'
      ? 'btn btn-primary width-100 blue'
      : 'btn btn-primary width-100';

    return (
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="row">
          <h2 className="text-center ">
            {authFormHeading}
          </h2>
        </div>
        <div className="row">
          <div className="input-field col s12 l12">
            <input required onChange={handleChange} name="username" id="username" type="text"/>
            <label htmlFor="username">Username</label>
          </div>
          <div className="input-field col s12 l12">
            <input required onChange={handleChange} name="password" id="password" type="password" />
            <label htmlFor="password">Password</label>
          </div>
          {action === 'sign-up' &&
          <div className="input-field col s12 l12">
            <input required onChange={handleChange} name="email" id="email" type="email" />
            <label htmlFor="email">Email</label>
          </div>
          }
          <div className="col s12 l12 mb-two-rem mt-one-rem underline">
            <a href={alternateActionHref}>
              {alternatActionText}
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
