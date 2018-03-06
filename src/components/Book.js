import React, { Component } from 'react';
import firebase, { auth } from './../api.js';

import Hero from './parts/Hero';

class Book extends Component {
  constructor(props) {
    super(props);
    console.log(this.props.match.params.bookid);
    this.state = {
      id: this.props.match.params.bookid,
      author: '',
      backgroundColor: this.randomColor(),
      color: this.props.match.params.color,
      description: '',
      synopsis: '',
      rating: 1,
      rated: 1,
      ratingType: '',
      title: '',
      imageURL: '',
      loggedin: ''
    }
  }
  randomColor() {
    let colors = ['blue', 'teal', 'gold', 'purple'];
    let rand = colors[Math.floor(Math.random() * colors.length)];
    return rand;
  }  
  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ 
          user: user,
          loggedin: true 
        });
      } 
    });    
    const booksRef = firebase.database().ref('books/' + this.state.id);
    booksRef.once('value', (snapshot) => {
      let book = snapshot.val();
      this.setState({
        author: book.author,
        description: book.description,
        synopsis: book.synopsis,
        imageURL: book.image,
        rating: book.rating,
        rated: book.rated,
        ratingType: book.ratingType,
        title: book.title
      });
    });
  }
  render() {
    return (
      <div className='app'>
        <Hero color={this.state.color} h1="A Book I Read" h2={this.state.title} />
        <div className='container'>
          <section className='display-book'>
              <div className='wrapper'>
                <div className='books'>
                  <div className='book' key={this.state.id}>
                    <div className={'rating ' + this.state.color}>
                      <p>{this.state.rating}/{this.state.rated}</p>
                      <span>{this.state.ratingType}</span>
                    </div>
                    <div>
                      <p className='author'>{this.state.author}</p>
                      {this.state.description ?
                      <p className='description'>{this.state.description}</p>
                      :
                      <p className='description'>{this.state.synopsis}</p>
                      }                      
                    </div>
                  </div>
                </div>
                <a className='see-all' href="/">Back to Book List</a>  
                {this.state.user && this.state.user.email === 'mcmurtrie37@gmail.com' ?
                  <a className='see-all' href={"/edit-book/" + this.state.id}>Edit Book</a>
                :
                  <span></span>
                }              
              </div>
          </section>
        </div>
      </div>
    );
  }
}
export default Book;