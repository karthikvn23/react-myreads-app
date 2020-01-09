import React from 'react'
import './App.css'
import * as BooksAPI from './BooksAPI'
import ListBooks from './ListBooks'

class BooksApp extends React.Component {

  bookShelves = ['currentlyReading', 'wantToRead', 'read']

  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    showSearchPage: false,
    books: []
  }

  componentDidMount() {
      BooksAPI.getAll()
          .then((books) => {
                        console.log(books)
                      this.setState(({books}) )
                    }
                  )
  }

  changeBookShelf(book, shelf){
      let updatedBooks = []
      BooksAPI.update(book, shelf)
          .then(
              (updateResponse) => {
                  this.bookShelves.forEach((shelfName) => {
                                  updateResponse[shelfName].forEach(
                                      (bookId) => {
                                          const index = this.state.books.findIndex(book => book.id === bookId)
                                          let tempBook = this.state.books[index]
                                          tempBook['shelf'] = shelfName
                                          updatedBooks.push(tempBook);
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
        {this.state.showSearchPage ? (
          <div className="search-books">
            <div className="search-books-bar">
              <button className="close-search" onClick={() => this.setState({ showSearchPage: false })}>Close</button>
              <div className="search-books-input-wrapper">
                {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
                <input type="text" placeholder="Search by title or author"/>

              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid"></ol>
            </div>
          </div>
        ) : (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                  <ListBooks books={this.state.books} heading='Currently Reading' type='currentlyReading'
                            shelfUpdateHandler={
                                (book, shelf) => {
                                    this.changeBookShelf(book, shelf)
                                }
                            }/>
                  <ListBooks books={this.state.books} heading='Want to Read' type='wantToRead'
                             shelfUpdateHandler={
                                 (book, shelf) => {
                                     this.changeBookShelf(book, shelf)
                                 }
                             }/>
                  <ListBooks books={this.state.books} heading='Read' type='read'
                             shelfUpdateHandler={
                                 (book, shelf) => {
                                     this.changeBookShelf(book, shelf)
                                 }
                             }/>
              </div>
            </div>
            <div className="open-search">
              <button onClick={() => this.setState({ showSearchPage: true })}>Add a book</button>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default BooksApp
