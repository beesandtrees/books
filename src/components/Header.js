import React from 'react'
import { Link } from 'react-router-dom'

// The Header creates links that can be used to navigate
// between routes.
const Header = () => (
  <header className='site-header'>
    <div className='wrapper'>
      <nav className='nav-main'>
        <ul className='nav-items'>
          <li className='nav-item'><Link to='/'>See Almost All Books</Link></li>
        </ul>
      </nav>
    </div>
  </header>
)

export default Header
