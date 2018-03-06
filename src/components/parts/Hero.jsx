import React from 'react'

// The Header creates links that can be used to navigate
// between routes.
const Hero = (props) => (
	<header className={'hero hero--mini ' + props.color}>
		<div className='wrapper'>
		  <h1>{props.h1}</h1> 
		  <h2>{props.h2}</h2>              
		</div>
	</header>
)

export default Hero;	