import React, { Component } from 'react';
import firebase, { auth, provider } from './../api.js';
import FileUploader from 'react-firebase-file-uploader';

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
      image: '',
      isUploading: false,
      progress: 0,
      imageURL: '',
      user: null      
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleUploadStart = this.handleUploadStart.bind(this);
    this.handleProgress = this.handleProgress.bind(this);  
    this.handleUploadError = this.handleUploadError.bind(this);
    this.handleUploadSuccess = this.handleUploadSuccess.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
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
      description: this.state.description,
      rating: this.state.rating,
      ratingType: this.state.ratingType,
      synopsis: this.state.synopsis,
      title: this.state.title,
      image: ''
    }    
    firebase.storage().ref().child(this.state.image)
      .getDownloadURL()
      .then((url) => {
          // URL of the image uploaded on Firebase storage
          alert(url);
          book.image = url;
          this.setState({ imageURL: url });
          booksRef.push(book);
      });
    
    this.setState({
      author: '',
      description:'',
      rating: '',
      ratingType: '',
      synopsis: '',
      title: '',
      image: ''
    });
  }
  logout() {
    auth.signOut()
      .then(() => {
        this.setState({
          user: null
        });
      });
  }
  login() {
    auth.signInWithPopup(provider) 
      .then((result) => {
        const user = result.user;
        this.setState({
          user
        });
      });
  }
  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
      } 
    });
  }
  render() {
    let username = this.state.user;
    return (
      <div className='app'>
        <header className='hero hero--mini teal'>
            <div className='wrapper'>
              <h1>A Book I'm Adding</h1>               
             {this.state.user ?
                <button onClick={this.logout}>Log Out</button>                
                :
                <button onClick={this.login}>Log In</button>              
              }
            </div>
        </header>
        {this.state.user && username.email === 'mcmurtrie37@gmail.com' ?
          <div className='container'>
            <section className='add-book wrapper'>
              <div className='row'>
                <div className='col-50'>
                  <form onSubmit={this.handleSubmit}>
                    <input type="text" name="title" placeholder="Book Title" onChange={this.handleChange} value={this.state.title} />
                    <input type="text" name="author" placeholder="Author" onChange={this.handleChange} value={this.state.author} />
                    <input type="text" name="rating" placeholder="Rating" onChange={this.handleChange} value={this.state.rating} />
                    <input type="text" name="ratingType" placeholder="Rating Type" onChange={this.handleChange} value={this.state.ratingType} />
                    <input type="text" name="synopsis" placeholder="Synopsis" onChange={this.handleChange} value={this.state.synopsis} />
                    <textarea name="description" placeholder="Description" onChange={this.handleChange} value={this.state.description} />
                    <FileUploader
                      accept="image/*"
                      name="image"
                      filename={file => this.state.title.split(' ')
                        .join('').replace(/[.,/#!$%^&*;:{}=\-_~()]/g,"")
                        .replace(/\s{2,}/g," ")
                        .toLowerCase() + file.name.split('.')[1]}
                      storageRef={firebase.storage().ref()}
                      onUploadStart={this.handleUploadStart}
                      onUploadError={this.handleUploadError}
                      onUploadSuccess={this.handleUploadSuccess}
                      onProgress={this.handleProgress}
                    />               
                    <button>Add book</button>
                  </form>
                  {this.state.isUploading &&
                    <p>Progress: {this.state.progress}</p>
                  }
                  {this.state.imageURL &&
                    <img src={this.state.imageURL} alt={this.state.title} />
                  }    
                </div>
                <div className='col-50'>                               
                  <a className='see-all' href="/">Back to Book List</a>                            
                </div>
              </div>
            </section>
          </div>
        :
          <div></div>
        }
      </div>
    );
  }
}
export default Home;