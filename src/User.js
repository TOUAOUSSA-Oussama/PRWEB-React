import React, { Component } from 'react';
import { postServiceData } from './util';
import { Redirect } from 'react-router-dom';
import Borrows from './Borrows';


class User extends Component {
    

    constructor(props) {
        super(props);

        this.state = {
            person_id: this.props.data.person_id,
            person_firstname: this.props.data.person_firstname,
            person_lastname: this.props.data.person_lastname,
            person_birthdate: this.props.data.person_birthdate,
            canGoBack: false,
            users: [], 
            sommeUsers: 0,
        }

        this.handleChangePersonFirstname = this.handleChangePersonFirstname.bind(this);
        this.handleChangePersonLastname = this.handleChangePersonLastname.bind(this);
        this.handleChangePersonBirthDate = this.handleChangePersonBirthDate.bind(this);
        this.saveUser = this.saveUser.bind(this);

        this.getUsers = this.getUsers.bind(this);
        this.getUsers();
    }

    // gérer les input de la forme
    handleChangePersonFirstname(e) {
        this.setState({person_firstname: e.target.value});
    }

    handleChangePersonLastname(e) {
        this.setState({person_lastname: e.target.value});
    }

    handleChangePersonBirthDate(e) {
        this.setState({person_birthdate: e.target.value});
    }

    // Enregistrer les modifications losque la forme est submited : 
    saveUser(event) {
        event.preventDefault();
        var params = {
            person_id: this.state.person_id,
            person_newId: this.state.person_newId,
            person_firstname: this.state.person_firstname,
            person_lastname: this.state.person_lastname,
            person_birthdate: this.state.person_birthdate
        };
        if (params.person_id === "NEW") {
            params.person_id = -1;
            params.person_newId = this.state.sommeUsers + 10;
        }
        postServiceData("saveUser", params).then((data) => {
            this.setState({canGoBack: true});
        });
    }

    // Envoyer la requete pour recuperer la liste
    getUsers() {
        const params = {ok:1};
        postServiceData("users", params).then((data) => {
            this.setState({users: data});
            this.setState({sommeUsers: this.state.users.length})
        });
   }

  render() {
    if (this.state.canGoBack) {
        return <Redirect to={{
            pathname: "/users"
        }} />;
        
    }
    if (this.state.person_id === "NEW") {
        return (
            <div className="list">
                <h1>Create / Edit User page :</h1>
                <form onSubmit={this.saveUser}>
                    <table>
                        <tbody>
                        <tr>
                            <th>User #</th>
                            <td>{this.state.person_id}</td>
                        </tr>
                        <tr>
                            <th>FirstName</th>
                            <td><input type="text" placeholder={this.state.person_firstname}
                                    value={this.state.person_firstname} onChange={this.handleChangePersonFirstname} /></td>
                        </tr>
                        <tr>
                            <th>LastName</th>
                            <td><input type="text" placeholder={this.state.person_lastname}
                                    value={this.state.person_lastname} onChange={this.handleChangePersonLastname}/></td>
                        </tr>
                        <tr>
                            <th>Birthdate</th>
                            <td><input type="text" 
                                    value={this.state.person_birthdate} onChange={this.handleChangePersonBirthDate}/></td>
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
    return (
      <div>
        <div className="list">
            <h1>Create / Edit User page :</h1>
            <form onSubmit={this.saveUser}>
                <table>
                    <tbody>
                    <tr>
                        <th>User #</th>
                        <td>{this.state.person_id}</td>
                    </tr>
                    <tr>
                        <th>FirstName</th>
                        <td><input type="text" placeholder={this.state.person_firstname}
                                value={this.state.person_firstname} onChange={this.handleChangePersonFirstname} /></td>
                    </tr>
                    <tr>
                        <th>LastName</th>
                        <td><input type="text" placeholder={this.state.person_lastname}
                                value={this.state.person_lastname} onChange={this.handleChangePersonLastname}/></td>
                    </tr>
                    <tr>
                        <th>Birthdate</th>
                        <td><input type="text" 
                                value={this.state.person_birthdate} onChange={this.handleChangePersonBirthDate}/></td>
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
        <div className="list">
            <Borrows person_id={this.state.person_id} />
        </div>
    </div>
    )
  }
}

export default User;