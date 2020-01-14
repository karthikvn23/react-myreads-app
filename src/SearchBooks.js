import React, { Component } from 'react'
import * as BooksAPI from "./BooksAPI";
import { Link } from 'react-router-dom';
import {debounce} from 'lodash';

class SearchBooks extends  Component{

    /** Making use of _isMounted not to perform setState if the component is unmounted.
     * This will happen when a user has typed a query in search page and returns to main page even before Search API call has completed
     * Variable is set to false in 'componentWillUnmount' and setState will be called only if _isMounted is true
     **/
    _isMounted = false

    state = {
        searchBookResults: []
    }

    performSearch = debounce(
        (query) => {
        if( query !== '')
            BooksAPI.search(query)
                .then((searchBookResults) => {
                        if(searchBookResults !== 'undefined')
                            if(this._isMounted)
                                this.setState(({searchBookResults}) )
                    }
                )
        else if (query === '' && this._isMounted)
            this.setState(({searchBookResults: []}) )
    }, 250)

    /**
     * Debouncing
     * The function will be called after it stops being called for 250 milliseconds, this is to improve application performance
     * Detailed explanation can be found here: https://davidwalsh.name/javascript-debounce-function
     *
     * @param func
     * @param wait
     * @param immediate
     * @returns {Function}
     */
    debounce(func, wait, immediate) {
        var timeout
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        }
    }

    componentDidMount(){
        this._isMounted = true
    }

    componentWillUnmount(){
        this._isMounted = false
    }

    render(){
        const { currentBooks } = this.props

        // Adds imageLinks property if it's not present
        let showBooks
        if(typeof(this.state.searchBookResults['items']) === 'undefined'){
            showBooks = this.state.searchBookResults.map(
                (book) => {
                    if( ! book.hasOwnProperty('imageLinks'))
                        book['imageLinks']=[]
                    return book
                }
            )
        }

        return(
            <div className="search-books">
                <div className="search-books-bar">
                    <Link
                        className='close-search'
                        to='/'>
                        Close
                    </Link>
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
                                showBooks.map(
                                    (book) => {

                                                const index = currentBooks.findIndex( (currentBook) => currentBook.id === book.id)
                                                index !== -1 ? book['shelf'] = currentBooks[index]['shelf']: book['shelf'] = 'none'

                                                return(
                                                <li key={book.id}>
                                                    <div className="book">
                                                        <div className="book-top">

                                                            <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks.thumbnail})` }}></div>
                                                            <div className="book-shelf-changer">
                                                                <select onChange={
                                                                    (event) => {
                                                                        this.props.addBookFromSearch(book, event.target.value)
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
                                                </li>)
                                    }
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