import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import plus from './images/plus.png'
import { postServiceData } from './util';
import BookInList from './BookInList';

class Books extends Component {
   constructor(props) {
       super(props);

       this.state = {
           books: [],
           canCreate: false,
           canSwitch: false,
        };
       this.getBooks = this.getBooks.bind(this);
       this.createBook = this.createBook.bind(this);
       this.switchUsers = this.switchUsers.bind(this);
       this.getBooks();
   }
   
   getBooks() {
    const params = {ok:1};
    postServiceData("books", params).then((data) => {
        this.setState({books: data});
    });
   }

   // Creer un nouveau  :
   createBook(event) {
        event.preventDefault();
        this.setState({canCreate: true});
   }

   switchUsers(event) {
    event.preventDefault();
    this.setState({canSwitch: true});
   }

  render() {
    if (this.state.canCreate) {
        return <Redirect to={{
            pathname: "/book",
            state: {
                book_id: "NEW",
                book_title: "",
                book_authors:"",
            }
        }} />;
    }

    if (this.state.canSwitch) {
        return <Redirect to={{
            pathname: "/users",
            
        }} />;
    }

    const token = this.props.getToken();
    if(!token){
        return <Redirect push to="/" />;
    }
    
    return (
        <div className="list">
            <table className="noborder">
                <tbody>
                <tr>
                    <td className="noborder"><h1>List of books :</h1></td>
                    <td className="noborder">
                        <form onSubmit={this.switchUsers}><button>Switch users</button></form>
                    </td>
                </tr>
                </tbody>
                
            </table>
            <table>
                <thead>
                    <tr>
                        <th>Book #</th>
                        <th>BookTitle</th>
                        <th>BookAuthors</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {this.state.books.map((book) => <BookInList book={book} key={book.book_id} />)}
                </tbody>

                <tfoot>
                    <tr>
                        <td colspan="3"></td>
                        <td>
                            <form className="iconForm" method="POST" onSubmit={this.createBook}>
                                <button >
                                    <img src={plus} alt="plus" class="icon" />
                                </button>
                            </form>
                        </td>
                    </tr>
                </tfoot>
            </table>

        </div>
    )
  }
}

export default Books;