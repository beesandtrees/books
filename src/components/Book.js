import React, { Component } from 'react';
import firebase from './../api.js';

// const BookImage = props => {
//   if(props.imageURL) {
//     return (
//       <img src={props.imageURL} alt={props.title} />
//     )
//   } else {
//     return (
//       <span></span>
//     )    
//   }
// }

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.bookid,
      author: '',
      backgroundColor: this.randomColor(),
      color: this.props.match.params.color,
      description: '',
      rating: '1/1',
      ratingType: '',
      title: '',
      imageURL: ''
    }
  }
  randomColor() {
    let colors = ['blue', 'teal', 'gold', 'purple'];
    let rand = colors[Math.floor(Math.random() * colors.length)];
    return rand;
  }  
  componentDidMount() {
    const booksRef = firebase.database().ref('books/' + this.state.id);
    booksRef.on('value', (snapshot) => {
      let book = snapshot.val();
      this.setState({
        id: book.id,
        author: book.author,
        description: book.description,
        imageURL: book.image,
        rating: book.rating,
        ratingType: book.ratingType,
        title: book.title
      });
    });
  }
  render() {
    return (
      <div className='app'>
        <header className={'hero hero--mini ' + this.state.color}>
            <div className='wrapper'>
              <h1>A Book I Read</h1> 
              <h2>{this.state.title}</h2>              
            </div>
        </header>
        <div className='container'>
          <section className='display-book'>
              <div className='wrapper'>
                <div className='books'>
                  <div className='book' key={this.state.id}>
                    <div className={'rating ' + this.state.color}>
                      <p>{this.state.rating}</p>
                      <span>{this.state.ratingType}</span>
                    </div>
                    <div>
                      <p className='author'>{this.state.author}</p>
                      <p className='description'>{this.state.description}</p>
                    </div>
                  </div>
                </div>
                <a className='see-all' href="/">Back to Book List</a>                
              </div>
          </section>
        </div>
      </div>
    );
  }
}
export default Home;