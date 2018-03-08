import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from './AllBooks'
import Login from './Login'
import AddBooks from './AddBooks'
import EditBook from './EditBook'
import Book from './Book'

// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"
const Routes = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route exact path='/login' component={Login}/>
      <Route exact path='/add-book' component={AddBooks}/>
      <Route path='/edit-book/:bookid' component={EditBook}/>
      <Route path='/books/:bookid/:color' component={Book}/>
    </Switch>
  </main>
)

export default Routes
