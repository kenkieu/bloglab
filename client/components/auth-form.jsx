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
      .then(res => res.json());
  }

  render() {
    const { handleChange, handleSubmit } = this;
    return (
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="row">
          <h2 className="text-center ">Sign Up</h2>
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
          <div className="input-field col s12 l12">
            <input required onChange={handleChange} name="email" id="email" type="email"/>
            <label htmlFor="email">Email</label>
          </div>
          <div className="col s12 l12 mb-two-rem mt-one-rem underline">
            <a href='#sign-in'>
              Already have an account?
            </a>
          </div>
          <div className="col s12 l12">
            <button type="submit" className="btn btn-primary width-100">
              Register
            </button>
          </div>
        </div>
      </form>
    );
  }
}

export default AuthForm;
