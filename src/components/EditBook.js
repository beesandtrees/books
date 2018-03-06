import React, { Component } from 'react';
import firebase, { auth } from './../api.js';

class EditBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.bookid,
      author: '',
      authorLast: '',
      description:'',
      rating: '',
      rated: '',
      ratingType: '',
      synopsis: '',
      title: '',
      image: '',
      isUploading: false,
      progress: 0,
      imageURL: '',
      uppercount: 0,
      user: null      
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  } 
  handleSubmit(e) {
    e.preventDefault();
    const booksRef = firebase.database().ref('books/' + this.state.id);

    let book = {
      author: this.state.author,
      authorLast: this.state.authorLast,
      description: this.state.description,
      rating: this.state.rating,
      rated: this.state.rated,
      ratingType: this.state.ratingType,
      synopsis: this.state.synopsis,
      title: this.state.title,
      image: ''
    }

    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates['/bookcount/value'] = this.state.uppercount + 1;

    booksRef.update(updates);

    booksRef.update(book);
    this.setState({
      author: '',
      authorLast: '',
      description:'',
      rating: '',
      rated: '',
      ratingType: '',
      synopsis: '',
      title: '',
      image: '',
      uppercount: this.state.uppercount + 1
    });
  }
  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
      } 
    });
    const bookCount = firebase.database().ref('books/bookcount');
    let uppercount = 0;

    bookCount.once('value', (snapshot) => {
      uppercount = snapshot.val().value;

      this.setState({
        uppercount: uppercount
      });
    }); 
    const booksRef = firebase.database().ref('books/' + this.state.id);
    booksRef.once('value', (snapshot) => {
      let book = snapshot.val();
      this.setState({
        author: book.author,
        authorLast: book.authorLast,
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
    let username = this.state.user;
    return (
      <div className='app'>
        <header className='hero hero--mini teal'>
            <div className='wrapper'>
              <h1>A Book I'm Editing</h1>               
              <h2>{this.state.title} </h2>              
            </div>
        </header>
        {this.state.user && username.email === 'mcmurtrie37@gmail.com' ?
          <section className='add-book wrapper text_right'>
            <form onSubmit={this.handleSubmit}>
              <div className='row'>
                <div className='col-50'>
                  <input type="text" name="title" placeholder="Book Title" onChange={this.handleChange} value={this.state.title} />
                  <input type="text" name="author" placeholder="Author" onChange={this.handleChange} value={this.state.author} />
                  <input type="text" name="authorLast" placeholder="Author Last Name" onChange={this.handleChange} value={this.state.authorLast} />
                  <input type="text" name="rating" placeholder="Rating" onChange={this.handleChange} value={this.state.rating} />
                  <input type="text" name="rated" placeholder="Rating Out Of..." onChange={this.handleChange} value={this.state.rated} />
                  <input type="text" name="ratingType" placeholder="Rating Type" onChange={this.handleChange} value={this.state.ratingType} />   
                </div>
                <div className='col-50'> 
                  <input type="text" name="synopsis" placeholder="Synopsis" onChange={this.handleChange} value={this.state.synopsis} />
                  <textarea name="description" placeholder="Description" onChange={this.handleChange} value={this.state.description} />              
                  <button>Update book</button>
                </div>
              </div>
            </form>
            <a className='see-all' href="/">Back to Book List</a>                            
          </section>
        :
          <div></div>
        }
      </div>
    );
  }
}
export default EditBook;