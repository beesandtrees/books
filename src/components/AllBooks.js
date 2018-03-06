import React, { Component } from 'react';
import firebase from './../api.js';

import Hero from './parts/Hero';

class Home extends Component {
  constructor() {
    super();
    this.state = {
      colors: ['pink', 'blue', 'teal', 'gold', 'purple'],
      sortType: 'id',
      listFilter: '',
      reversed: 'descending',
      booksCount: 0,
      books: [],
      allBooks: []
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.filterBooks = this.filterBooks.bind(this);
  }
  randomColor() {
    let colors = this.state.colors.slice();
    let rand = colors[Math.floor(Math.random() * colors.length)];
    return rand;
  }
  componentDidMount() {
    const booksRef = firebase.database().ref('books').orderByChild('id');
    let booksCount = 0;
    booksRef.on('value', (snapshot) => {
      // let books = snapshot.val();
      let newState = [];
      snapshot.forEach(function(childSnapshot) {
        var key = childSnapshot.key;
        var childData = childSnapshot.val();
        childData.id = key;
        if(key === 'bookcount') {
          booksCount = childData.value;
        } else {
          newState.push(childData);          
        }
      });
      newState.reverse();
      this.setState({
        booksCount: booksCount,
        books: newState,
        allBooks: newState
      });
    });
  }
  reorderBooks(type, value) {
    let booksRef = firebase.database().ref('books').orderByChild(value);
    // booksRef = JSON.parse(booksRef); .limitToLast(16)
    // Object.keys(booksRef).reverse();
    booksRef.on('value', (snapshot) => {
      // let books = snapshot.val();
      let newState = [];
      snapshot.forEach(function(childSnapshot) {
        var key = childSnapshot.key;
        var childData = childSnapshot.val();
        childData.id = key;
        if(key !== 'bookcount') {
          newState.push(childData);          
        }
      });

      if(value === 'rating') {
        newState.sort(function (a, b) {
          return ((a.rating/a.rated)*10) - ((b.rating/b.rated)*10);
        });
      }

      if(type === 'descending') {
        newState.reverse();
      }      

      this.setState({
        books: newState,
        allBooks: newState
      });
    });    
  }
  filterBooks(letters, sort) {
    let bookList = this.state.allBooks.slice();
    let filtered = '';

    function doesInclude(value) {
      let lowerValue = value[sort].toLowerCase();
      let lowerFilter = letters.toLowerCase()
      return lowerValue.includes(lowerFilter);
    } 

    function sortRating(value) {
      return value[sort] >= letters;
    }
    if(sort === 'rating') {
      filtered = bookList.filter(sortRating);
    } else {
      filtered = bookList.filter(doesInclude);
    }
    
    this.setState({
      books: filtered
    });    
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });

    if(e.target.name === 'listFilter') {
      this.filterBooks(e.target.value, this.state.sortType);
    }
  }
  handleSelect(e) {
    this.setState({[e.target.name]: e.target.value});
    if(e.target.name === 'sortType') {
      this.reorderBooks(this.state.reversed, e.target.value);
    } else {
      this.reorderBooks(e.target.value, this.state.sortType);      
    }
  }  
  render() {
    let SortOptions = {title: 'Title', authorLast: 'Author', rating: 'Rating', id: 'Posted'}
    let filterlabel = SortOptions[this.state.sortType];
    return (
      <div className='app'>
        <Hero color="purple" h1="Some Books I've Read" h2="Super Short Book Reviews" />
        <div className='container'>
          <section className='display-book'>
              <div className='wrapper'>
                <p>{this.state.booksCount} (added to the list so far)</p>
                <div className='row'>
                  <div className='col-33'>
                    <div className='row'>
                      <div className='col'>
                        <label>Sort by:</label>
                        <select name='sortType' value={this.state.sortType} onChange={this.handleSelect}>
                          <option value="authorLast">Author</option>
                          <option value="id">Posted</option>
                          <option value="rating">Rating</option>
                          <option value="title">Title</option>
                        </select>
                      </div>
                      <div className='col'>
                        <label>Sort order:</label>
                        <select name='reversed' value={this.state.reversed} onChange={this.handleSelect}>
                          <option value="ascending">A-Z 0-9 &uarr;</option>
                          <option value="descending">Z-A 9-0 &darr;</option>
                        </select>
                      </div>     
                    </div>               
                  </div>
                  <div className='col-66'>
                    <label htmlFor='filterby'>Filter Results by {filterlabel}:</label>
                    <input type="text" name="listFilter" placeholder="In Sear..." onChange={this.handleChange} value={this.state.listFilter} />
                  </div>                  
                </div>
                <div className='cards'>
                  {this.state.books.map((book, index) => {
                    return (
                      <div className='card' key={book.id}>
                        <p className={'rating ' + this.state.colors[index%5]}>{book.rating}/{book.rated} <span>{book.ratingType}</span></p>
                        <div className='content'>
                          <h3><a href={'books/' + book.id + '/' + this.state.colors[index%5]}>{book.title}</a></h3>
                          <p className='author'>by: {book.author}</p>
                          <p className='synopsis'>{book.synopsis}</p>
                        </div>
                        <a className='read-more' href={'books/' + book.id + '/' + this.state.colors[index%5]}>Read More</a>                      
                      </div>
                    )
                  })}
                </div>
              </div>
          </section>
        </div>
      </div>
    );
  }
}
export default Home;