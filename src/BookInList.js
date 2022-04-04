import edit from './images/edit.png';
import del from './images/delete.png'
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { postServiceData } from './util';

class BookInList extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            canEdit: false,
            canDelete: false
        }

        this.editBook = this.editBook.bind(this);
        this.deleteBook = this.deleteBook.bind(this);
    }

    // handle edit click bouton
    editBook(event) {
        event.preventDefault();
        this.setState({canEdit: true});
        
    }

    // handle delete click bouton
    deleteBook(event) {
        event.preventDefault();
        this.setState({canDelete: true});
        const params = {book_id: this.props.book.book_id};
        postServiceData("deleteBook", params).then((data) => {
            
        });
    }

    render() {
        let book = this.props.book;
        if (this.state.canEdit) {
            return <Redirect to={{
                pathname: "/book",
                state: {
                    book_id: book.book_id,
                    book_title: book.book_title,
                    book_authors: book.book_authors,
                }
            }} />;
            
        }
        if (this.state.canDelete) {
            return <Redirect push to="/books" />;
        }
        return (
            <tr>
                <td>{book.book_id}</td>
                <td>{book.book_title}</td>
                <td>{book.book_authors}</td>
                <td>
                    <form class="iconForm" method="POST" onSubmit={this.editBook}>
                        <button>
                            <img src={edit} alt="edit" class="icon" />
                        </button>
                    </form>
                    <form class="iconForm" method="POST" onSubmit={this.deleteBook}>
                        <button>
                        <img src={del} alt="edit" class="icon" />
                    </button>
                    </form>
                </td>
            </tr>
        )
    }
}

export default BookInList;