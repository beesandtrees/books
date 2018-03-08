import React, { Component } from 'react';
import firebase, { auth, provider } from './../api.js';

import Nav from './elements/Nav';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      user: null      
    }

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }
  logout() {
    auth.signOut()
      .then(() => {
        this.setState({
          user: null
        });
      });
  }
  login() {
    auth.signInWithPopup(provider) 
      .then((result) => {
        const user = result.user;
        this.setState({
          user
        });
      });
  }
  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
      } 
    });    
  }
  render() {
    let username = this.state.user;
    return (
      <div className='app'>
        <header className='hero hero--mini teal'>
            <div className='wrapper'>
              <h1>A Book I'm Adding</h1>               
             {this.state.user ?
                <button onClick={this.logout}>Log Out</button>                
                :
                <button onClick={this.login}>Log In</button>              
              }
            </div>
        </header>
        {this.state.user && username.email === 'mcmurtrie37@gmail.com' ?
          <section className='add-book wrapper text_right'>
            <Nav />                       
          </section>
        :
          <div></div>
        }
      </div>
    );
  }
}
export default Login;