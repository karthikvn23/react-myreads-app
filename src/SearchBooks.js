import React, { Component } from 'react'
import * as BooksAPI from "./BooksAPI";

class SearchBooks extends  Component{

    state = {
        searchBookResults: []
    }

    performSearch = (query) => {
        if( query !== '')
            BooksAPI.search(query)
                .then((searchBookResults) => {
                        console.log('searchBookResults.length', searchBookResults.length)
                        if(searchBookResults !== 'undefined')
                            this.setState(({searchBookResults}) )
                    }
                )
    }

    render(){
        return(
            <div className="search-books">
                <div className="search-books-bar">
                    <button className="close-search">Close</button>
                    <div className="search-books-input-wrapper">
                        <input type="text" placeholder="Search by title or author"
                               onChange={ (event) => {this.performSearch(event.target.value)} }/>
                    </div>
                </div>

                {
                    typeof(this.state.searchBookResults['items']) === 'undefined' &&
                    <div className="search-books-results">
                        <ol className="books-grid">
                            {
                                this.state.searchBookResults.map(
                                    (book) => (
                                        <li key={book.id}>
                                            <div className="book">
                                                <div className="book-top">
                                                    <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks.thumbnail})` }}></div>
                                                    <div className="book-shelf-changer">
                                                        <select onChange={
                                                            (event) => {
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
                                                <div className="book-authors">{book.authors}</div>
                                            </div>
                                        </li>
                                    )
                                )
                            }
                        </ol>
                    </div>
                }
            </div>
        )
    }

}

export default SearchBooks