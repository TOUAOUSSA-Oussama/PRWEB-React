import React, { Component } from 'react';
import { postServiceData } from './util';
import { Redirect } from 'react-router-dom';

class Book extends Component {
    

    constructor(props) {
        super(props);

        this.state = {
            book_id: this.props.data.book_id,
            book_title: this.props.data.book_title,
            book_authors: this.props.data.book_authors,
            canGoBack: false,
            books: [], 
            sommeBooks: 0,
        }

        this.handleChangeBookTitle = this.handleChangeBookTitle.bind(this);
        this.handleChangeBookAuthors = this.handleChangeBookAuthors.bind(this);
        this.saveBook = this.saveBook.bind(this);

        this.getBooks = this.getBooks.bind(this);
        this.getBooks();
    }

    // gérer les input de la forme
    handleChangeBookTitle(e) {
        this.setState({book_title: e.target.value});
    }

    handleChangeBookAuthors(e) {
        this.setState({book_authors: e.target.value});
    }

    // Enregistrer les modifications losque la forme est submited : 
    saveBook(event) {
        event.preventDefault();
        var params = {
            book_id: this.state.book_id,
            book_newId: this.state.book_newId,
            book_title: this.state.book_title,
            book_authors: this.state.book_authors,
        };
        if (params.book_id === "NEW") {
            params.book_id = -1;
            params.book_newId = this.state.sommeBooks + 10;
        }
        postServiceData("saveBook", params).then((data) => {
            this.setState({canGoBack: true});
        });
    }

    // Envoyer la requete pour recuperer la liste 
    getBooks() {
        const params = {ok:1};
        postServiceData("books", params).then((data) => {
            this.setState({books: data});
            this.setState({sommeBooks: this.state.books.length})
        });
   }

  render() {
    if (this.state.canGoBack) {
        return <Redirect to={{
            pathname: "/books"
        }} />;
        
    }
    return (
      <div className="list">
        <h1>Create / Edit Book page :</h1>
        <form onSubmit={this.saveBook}>
            <table>
                <tbody>
                <tr>
                    <th>Book #</th>
                    <td>{this.state.book_id}</td>
                </tr>
                <tr>
                    <th>BookTitle</th>
                    <td><input type="text" placeholder={this.state.book_title}
                            value={this.state.book_title} onChange={this.handleChangeBookTitle} /></td>
                </tr>
                <tr>
                    <th>BookAuthors</th>
                    <td><input type="text" placeholder={this.state.book_authors}
                            value={this.state.book_authors} onChange={this.handleChangeBookAuthors}/></td>
                </tr>
                <tr>
                    <td colspan="2">
                        <button type="submit" className="saveBtn">Save</button>
                    </td>
                </tr>
                </tbody>
            </table>
        </form>
        
    </div>
    )
  }
}

export default Book;