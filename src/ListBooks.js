import React, { Component } from 'react'
import { Link} from 'react-router-dom';

class ListBooks extends Component{
    render(){

        const { books, shelfName, type } = this.props

        return(
            <div>
                <div className="bookshelf">
                    <h2 className="bookshelf-title">{shelfName}</h2>
                    <div className="bookshelf-books">
                        <ol className="books-grid">
                            {
                                books.filter( (book) => (book.shelf === type) ).map(
                                    (book) => (
                                        <li key={book.id}>
                                            <div className="book">
                                                <div className="book-top">
                                                    <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks.thumbnail})` }}></div>
                                                    <div className="book-shelf-changer">
                                                        <select onChange={
                                                            (event) => {
                                                                this.props.shelfUpdateHandler(book, event.target.value)
                                                            }
                                                        }
                                                        value={book.shelf}
                                                        >
                                                            <option value="move" disabled>Move to...</option>
                                                            <option value="wantToRead">Want to Read</option>
                                                            <option value="currentlyReading">Currently Reading</option>
                                                            <option value="read">Read</option>
                                                            <option value="none">None</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="book-title">{book.title}</div>
                                                <div className="book-authors">{book.authors.join(', ')}</div>
                                            </div>
                                        </li>
                                    )
                                )
                            }
                        </ol>
                    </div>
                    <Link to="/search" className="open-search">
                        <button>Add a book</button>
                    </Link>
                </div>
            </div>
        )
    }
}

export default ListBooks