import returnBookIcon from './images/return.png';
import React, { Component } from 'react';
import { useNavigate, Redirect } from 'react-router-dom';
import { postServiceData } from './util';

class BorrowInList extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            borrow_id: this.props.borrow.borrow_id,
            borrow_return: this.props.borrow.borrow_return,
            borrow_date: this.props.borrow.borrow_date,
            bookTitle: "",
            book_id: this.props.borrow.book_id
        }
        this.returnBook = this.returnBook.bind(this);
        this.getBookTitle = this.getBookTitle.bind(this);
        this.getBookTitle();
    }

    returnBook(event) {
        event.preventDefault();
        const params = {
            borrow_id: this.state.borrow_id,
            borrow_return: new Date().toLocaleDateString()
        };
        console.log(params.borrow_return);
        postServiceData("returnBook", params).then((data) => {
            
        });
    }

    getBookTitle() {
        const params = {
            book_id: this.state.book_id,
        };
        
        postServiceData("bookTitle", params).then((data) => {
            this.setState({bookTitle: data[0].book_title});
            
        });
    }

    render() {
        let theBorrowDate = new Date(this.state.borrow_date).toLocaleDateString();
        if ((this.state.borrow_return === null)
            || (this.state.borrow_return === undefined)
            || (this.state.borrow_return === "")) {
                return (
                    <tr>
                        <td>{theBorrowDate}</td>
                        <td>{this.state.bookTitle}</td>
                        <td>
                            <form onSubmit={this.returnBook}>
                                <button>
                                    <img src={returnBookIcon} alt="edit" className="icon" />
                                </button>
                            </form>
                        </td>
                    </tr>
                );
                } else {
                    let theBorrowReturn = new Date(this.state.borrow_return).toLocaleDateString();
                    return (
                        <tr>
                            <td>{theBorrowDate}</td>
                            <td>{this.state.bookTitle}</td>
                            <td>{theBorrowReturn}</td>
                        </tr>
                    );
                }
            }
        
    }


export default BorrowInList;