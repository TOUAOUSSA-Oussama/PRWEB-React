import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import plus from './images/plus.png'
import { postServiceData } from './util';
import BorrowInList from './BorrowInList';

class Borrows extends Component {
    constructor(props) {
        super(props);
 
        this.state = {
            borrows: [],
            books: [],
            book_id: 0,
            savedBorrow: false,
            person_id : this.props.person_id,
            sommeBorrows: 0,
         };
        this.getBorrows = this.getBorrows.bind(this);
        this.getBooks = this.getBooks.bind(this);
        this.handleChangeBook = this.handleChangeBook.bind(this);
        this.borrowBook = this.borrowBook.bind(this);
        this.getBorrows();
        this.getBooks();
    }
    
    // Envoyer la requete pour recuperer la liste 
    getBorrows() {
     const params = {person_id: this.props.person_id};
     postServiceData("borrows", params).then((data) => {
         this.setState({borrows: data});
         this.setState({sommeBorrows: this.state.borrows.length})
         
     });
    }

    getBooks(){
        const params = {ok:1};
        postServiceData("books", params).then((data) => {
            this.setState({books: data});
        });
    }
    
    borrowBook(event){
        event.preventDefault();
        const params = {
            borrow_id: this.state.sommeBorrows + 1000,
            person_id: this.state.person_id,
            book_id: this.state.book_id,
        };
        postServiceData("borrowBook", params).then((data) => {
            this.setState({borrows: data});
            this.setState({savedBorrow: true})
        });

    }

    handleChangeBook(event){
        this.setState({book_id: event.target.value});
    }
 
   render() {
       if (this.state.savedBorrow) {
            return <Redirect to={{
                pathname: "/users",
                
            }} />;
       }
       return (
        <div>
            <table>
                <tbody>
                    <tr>
                        <td><h2>Borrow list :</h2></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>

            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Title</th>
                        <th>Return</th>
                    </tr>
                </thead>

                <tbody>
                    {this.state.borrows.map((borrow) =>
                    <BorrowInList borrow={borrow} key={borrow.borrow_id}/>)}
                </tbody>

                <tfoot>
                    <tr>
                        <td colSpan="2">
                            <select onChange={this.handleChangeBook}>
                                <option value="-1"> - </option>
                                {this.state.books.map((book) => 
                                <option value={book.book_id} key={book.book_id}>{book.book_title}</option>)}
                            </select>
                        </td>
                        <td>
                            <form onSubmit={this.borrowBook}>
                                <button><img src={plus} alt="add" className="icon" /></button>
                            </form>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
       )
   }
 }
 
 export default Borrows;