import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import plus from './images/plus.png'
import { postServiceData } from './util';
import UserInList from './UserInList';

class Users extends Component {
   constructor(props) {
       super(props);

       this.state = {
           users: [],
           canCreate: false,
           canSwitch: false,
        };
       this.getUsers = this.getUsers.bind(this);
       this.createUser = this.createUser.bind(this);
       this.switchBooks = this.switchBooks.bind(this);
       this.getUsers();
   }
   
   // Envoyer la requete pour recuperer la liste des personnes et les mettre dans users
   getUsers() {
    const params = {ok:1};
    postServiceData("users", params).then((data) => {
        this.setState({users: data});
    });
   }

   // Creer un nouveau utilisateur :
   createUser(event) {
        event.preventDefault();
        this.setState({canCreate: true});
   }

   switchBooks(event) {
    event.preventDefault();
    this.setState({canSwitch: true});
   }

  render() {
    if (this.state.canCreate) {
        return <Redirect to={{
            pathname: "/user",
            state: {
                person_id: "NEW",
                person_firstname: "",
                person_lastname:"",
                person_birthdate: new Date().toISOString().slice(0, 10)
            }
        }} />;
    }

    if (this.state.canSwitch) {
        return <Redirect to={{
            pathname: "/books",
            
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
                    <td className="noborder"><h1>List of users :</h1></td>
                    <td className="noborder">
                        <form onSubmit={this.switchBooks}><button>Switch books</button></form>
                    </td>
                </tr>
                </tbody>
                
            </table>
            <table>
                <thead>
                    <tr>
                        <th>User #</th>
                        <th>FirstName</th>
                        <th>LastName</th>
                        <th>Birthdate</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {this.state.users.map((user) => <UserInList user={user} key={user.person_id} />)}
                </tbody>

                <tfoot>
                    <tr>
                        <td colspan="4"></td>
                        <td>
                            <form className="iconForm" method="POST" onSubmit={this.createUser}>
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

export default Users;