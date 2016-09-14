import React, { Component } from 'react';

import SignIn from '../components/signin/SignIn';

class SignInContainer extends Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    return (
      <div>
        <SignIn />
      </div>
    );
  }
}

export default SignInContainer;
