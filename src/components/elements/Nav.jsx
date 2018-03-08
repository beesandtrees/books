import React from 'react'
import { Link } from 'react-router-dom'

// The Header creates links that can be used to navigate
// between routes.
// "/"
// "/add-book"
// "/edit-book/:bookid"
// "/books/:bookid/:color"

const Nav = (props) => (
  <nav className='nav-main'>
    <ul className='nav-items'>
      <li className='nav-item'>
      	<Link to='/'>Book List</Link>
      </li>
      <li className='nav-item'>
      	<Link to='/add-book'>Add Book</Link>
      </li>	      
    </ul>
  </nav>
)

export default Nav;	      