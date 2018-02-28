import React, { Component } from 'react';
import firebase from './../api.js';

class Home extends Component {
  constructor() {
    super();
    this.state = {
      colors: ['pink', 'blue', 'teal', 'gold', 'purple'],
      sortType: 'title',
      listFilter: '',
      reversed: 'ascending',
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
    const booksRef = firebase.database().ref('books').orderByChild('title');
    booksRef.on('value', (snapshot) => {
      // let books = snapshot.val();
      let newState = [];
      snapshot.forEach(function(childSnapshot) {
        var key = childSnapshot.key;
        var childData = childSnapshot.val();
        childData.id = key;
        newState.push(childData);
      });
      this.setState({
        books: newState,
        allBooks: newState
      });
    });
  }
  reorderBooks(type, value) {
    let booksRef = firebase.database().ref('books').orderByChild(value);
    // booksRef = JSON.parse(booksRef);
    // Object.keys(booksRef).reverse();
    booksRef.on('value', (snapshot) => {
      // let books = snapshot.val();
      let newState = [];
      snapshot.forEach(function(childSnapshot) {
        var key = childSnapshot.key;
        var childData = childSnapshot.val();
        childData.id = key;
        newState.push(childData);
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
        <header className='hero hero--mini purple'>
            <div className='wrapper'>
              <h1>Some Books I've Read</h1> 
              <h2>Super Short Book Reviews</h2>              
            </div>
        </header>
        <div className='container'>
          <section className='display-book'>
              <div className='wrapper'>
                <div className='row'>
                  <div className='col-25'>
                    <div className='row'>
                      <div className='col-50'>
                        <label>Sort by:</label>
                        <select name='sortType' value={this.state.sortType} onChange={this.handleSelect}>
                          <option value="authorLast">Author</option>
                          <option value="id">Posted</option>
                          <option value="rating">Rating</option>
                          <option value="title">Title</option>
                        </select>
                      </div>
                      <div className='col-50'>
                        <label>Sort order:</label>
                        <select name='reversed' value={this.state.reversed} onChange={this.handleSelect}>
                          <option value="ascending">Ascending</option>
                          <option value="descending">Descending</option>
                        </select>
                      </div>     
                    </div>               
                  </div>
                  <div className='col-75'>
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
                          <h3><a href={"books/" + book.id}>{book.title}</a></h3>
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