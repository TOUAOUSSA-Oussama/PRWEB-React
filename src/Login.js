import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { postServiceData } from './util';

class Login extends Component {
    constructor(props){
        super(props);

        this.state = {
            canLogin: false,
            login: "",
            pass: ""
        }

        this.checkLogin = this.checkLogin.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handlePass = this.handlePass.bind(this);
    }

    handleLogin(event){
        this.setState({login: event.target.value});
    }

    handlePass(event){
        this.setState({pass: event.target.value});
    }

    checkLogin(event){
        event.preventDefault();
        const params = {login: this.state.login, passwd: this.state.pass};
        postServiceData("identify", params).then((data) => {
            if (data.ok === 1) {
                this.props.setToken("abcd");
                this.setState({canLogin: true});
            }
        });
    }

    render() {
        if(this.state.canLogin){
            return <Redirect push to="/users" />;
        }
        this.props.removeToken();
        return (
            <div>
                <div className="login">
                    <h1>Library Login :</h1>
                    <form method='POST' onSubmit={this.checkLogin}>
                        <p>Give your login :</p>
                        <input type="text" name="login" placeholder="Login" value={this.state.login} onChange={this.handleLogin}/>
                        <p>Give your password :</p>
                        <input type="password" name="password" placeholder="Password" value={this.state.pass} onChange={this.handlePass}/>
                        <button className="loginBtn">Login</button>
                    </form>
                </div>
            </div>
        );
    }
};

export default Login;