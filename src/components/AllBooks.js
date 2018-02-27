import React, { Component } from 'react';
import firebase from './../api.js';

class Home extends Component {
  constructor() {
    super();
    this.state = {
      author: '',
      description:'',
      rating: '',
      ratingType: '',
      synopsis: '',
      title: '',
      colors: ['pink', 'blue', 'teal', 'gold', 'purple'],
      books: []
    }
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
        books: newState
      });
    });
  }
  render() {
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
                <div className='cards'>
                  {this.state.books.map((book, index) => {
                    return (
                      <div className='card' key={book.id}>
                        <p className={'rating ' + this.state.colors[index%5]}>{book.rating} <span>{book.ratingType}</span></p>
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