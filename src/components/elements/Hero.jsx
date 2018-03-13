import React, { Component } from 'react';

// The Header creates links that can be used to navigate
// between routes.

class Hero extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: this.props.color,
      headerOne: this.props.h1,
      headerTwo: this.props.h2,
      heroClasses: 'hero hero--mini ' + this.props.color
    }

    this.handleScroll = this.handleScroll.bind(this);
  } 
  componentDidMount() {
	  window.addEventListener('scroll', this.handleScroll);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }
  handleScroll(event) {
    if (window.scrollY > 100) {
		this.setState({
			heroClasses: 'hero scrolled ' + this.state.color
		});
    } else {
		this.setState({
			heroClasses: 'hero ' + this.state.color
		});    
	}    
  }  
  render() {
    return (
	  <header className={this.state.heroClasses}>
	    <div className='wrapper'>
		    <h1>{this.state.headerOne}</h1> 
		    <h2>{this.state.headerTwo}</h2>       
	    </div>
	  </header>	
    );
  }
}
export default Hero;