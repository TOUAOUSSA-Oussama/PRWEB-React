import edit from './images/edit.png';
import del from './images/delete.png'
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { postServiceData } from './util';

class UserInList extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            canEdit: false,
            canDelete: false
        }

        this.editUSer = this.editUSer.bind(this);
        this.deleteUSer = this.deleteUSer.bind(this);
    }

    // handle edit click bouton
    editUSer(event) {
        event.preventDefault();
        this.setState({canEdit: true});
        
    }

    // handle delete click bouton
    deleteUSer(event) {
        event.preventDefault();
        this.setState({canDelete: true});
        const params = {person_id: this.props.user.person_id};
        postServiceData("deleteUser", params).then((data) => {
            
        });
    }

    render() {
        let user = this.props.user;
        if (this.state.canEdit) {
            return <Redirect to={{
                pathname: "/user",
                state: {
                    person_id: user.person_id,
                    person_firstname: user.person_firstname,
                    person_lastname: user.person_lastname,
                    person_birthdate: (new Date(user.person_birthdate)).toLocaleDateString()
                }
            }} />;
            
        }
        if (this.state.canDelete) {
            return <Redirect push to="/users" />;
        }
        return (
            <tr>
                <td>{user.person_id}</td>
                <td>{user.person_firstname}</td>
                <td>{user.person_lastname}</td>
                <td>{(new Date(user.person_birthdate)).toLocaleDateString()}</td>
                <td>
                    <form class="iconForm" method="POST" onSubmit={this.editUSer}>
                        <button>
                            <img src={edit} alt="edit" class="icon" />
                        </button>
                    </form>
                    <form class="iconForm" method="POST" onSubmit={this.deleteUSer}>
                        <button>
                        <img src={del} alt="edit" class="icon" />
                    </button>
                    </form>
                </td>
            </tr>
        )
    }
}

export default UserInList;