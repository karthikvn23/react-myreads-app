import React from 'react'
import './App.css'
import * as BooksAPI from './BooksAPI'
import ListBooks from './ListBooks'
import SearchBooks from './SearchBooks'
import { BrowserRouter, Route } from 'react-router-dom';

class BooksApp extends React.Component {

  bookShelves = {
                  currentlyReading: {shelfName: 'Currently Reading'},
                  wantToRead: {shelfName: 'Want to Read'},
                  read: {shelfName:'Read'}
                }

  state = {
    books: []
  }

    /**
     * Performs the intial call to display books as per the shelves
     */
  componentDidMount() {
      BooksAPI.getAll()
          .then((books) => {
                      this.setState(({books}) )
                    }
                  )
  }

    /**
     * Updates the shelf for a book in My Reads page
     * Function is also used to add a book from search page to a shelf
     *
     * @param book
     * @param shelf
     */
  changeBookShelf(book, shelf){
      let updatedBooks = []
      BooksAPI.update(book, shelf)
          .then(
              (updateResponse) => {
                  Object.keys(this.bookShelves).forEach((shelfName) => {
                                  updateResponse[shelfName].forEach(
                                      (bookId) => {
                                          const index = this.state.books.findIndex((searchBook) => searchBook.id === bookId)
                                          if(index === -1){ // Indicates that book from search result is being added to shelf, hence index is -1
                                              book['shelf'] = shelf
                                              updatedBooks.push(book)
                                          }else{
                                              let tempBook = this.state.books[index]
                                              tempBook['shelf'] = shelfName
                                              updatedBooks.push(tempBook);
                                          }
                                      }
                                  )
                      }
                  )
                  this.setState({books: updatedBooks} )
              }
       )
  }

  render() {
    return (
      <div className="app">
          <BrowserRouter>
              <Route exact path='/' render={
                  () =>  (
                      <div className="list-books">
                          <div className="list-books-title">
                              <h1>MyReads</h1>
                          </div>
                          <div className="list-books-content">
                              <div>
                                  <ListBooks books={this.state.books} shelfName='Currently Reading' type='currentlyReading'
                                             shelfUpdateHandler={
                                                 (book, shelf) => {
                                                     this.changeBookShelf(book, shelf)
                                                 }
                                             }/>
                                  <ListBooks books={this.state.books} shelfName='Want to Read' type='wantToRead'
                                             shelfUpdateHandler={
                                                 (book, shelf) => {
                                                     this.changeBookShelf(book, shelf)
                                                 }
                                             }/>
                                  <ListBooks books={this.state.books} shelfName='Read' type='read'
                                             shelfUpdateHandler={
                                                 (book, shelf) => {
                                                     this.changeBookShelf(book, shelf)
                                                 }
                                             }/>
                              </div>
                          </div>
                      </div>
                  )
              }
              />
                  <Route
                      path='/search' render={
                      ({history}) => (
                        <SearchBooks addBookFromSearch={
                                (book, shelf) => {
                                        this.changeBookShelf(book, shelf)
                                        // history.push('/')
                                    }
                                }
                                     currentBooks={
                                         this.state.books
                                     }
                        />
                      )
                      }
                  />
          </BrowserRouter>
      </div>
    );
  }
}

export default BooksApp
