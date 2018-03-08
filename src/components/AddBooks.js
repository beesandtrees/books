import React, { Component } from 'react';
import firebase, { auth, provider } from './../api.js';
import Hero from './elements/Hero';

/* THIS IS ALL FILE UPLOAD STUFF */
// import FileUploader from 'react-firebase-file-uploader';

/* INCLUDE THIS IN THE COMPONENNT */
// <FileUploader
//   accept="image/*"
//   name="image"
//   filename={file => this.state.title.split(' ')
//     .join('').replace(/[.,/#!$%^&*;:{}=\-_~()]/g,"")
//     .replace(/\s{2,}/g," ")
//     .toLowerCase() + file.name.split('.')[1]}
//   storageRef={firebase.storage().ref()}
//   onUploadStart={this.handleUploadStart}
//   onUploadError={this.handleUploadError}
//   onUploadSuccess={this.handleUploadSuccess}
//   onProgress={this.handleProgress}
// /> 
// {this.state.isUploading &&
//   <p>Progress: {this.state.progress}</p>
// }
// {this.state.imageURL &&
//   <img src={this.state.imageURL} alt={this.state.title} />
// } 

class AddBook extends Component {
  constructor() {
    super();
    this.state = {
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
    this.handleUploadStart = this.handleUploadStart.bind(this);
    this.handleProgress = this.handleProgress.bind(this);  
    this.handleUploadError = this.handleUploadError.bind(this);
    this.handleUploadSuccess = this.handleUploadSuccess.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  handleUploadStart() {
    this.setState({ 
        isUploading: true, 
        progress: 0 
    });
  }
  handleProgress(progress) {
    this.setState({ progress });
  }
  handleUploadError(error) {
    this.setState({ 
      isUploading: false 
    });
    console.error(error);
  }
  handleUploadSuccess(filename) {
    this.setState({ image: filename, progress: 100, isUploading: false });
  }  
  handleSubmit(e) {
    e.preventDefault();
    const booksRef = firebase.database().ref('books');

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

    if(!book.rating) {
      book.ratingType = 'Not Yet Rated';
    }
    /* FILE UPLOAD */
    // firebase.storage().ref().child(this.state.image)
    //   .getDownloadURL()
    //   .then((url) => {
    //       // URL of the image uploaded on Firebase storage
    //       alert(url);
    //       book.image = url;
    //       this.setState({ imageURL: url });
    //       booksRef.push(book);
    //   });
    // This should be moved into the Image upload if 
    // image upload is turned back on

    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates['/bookcount/value'] = this.state.uppercount + 1;

    booksRef.update(updates);

    booksRef.push(book);
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
  }
  render() {
    let username = this.state.user;
    return (
      <div className='app'>
        <Hero 
          color="teal" 
          h1="A Book I'm Adding" 
          h2="I Just Read This" />
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
                  <button>Add book</button>
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
export default AddBook;