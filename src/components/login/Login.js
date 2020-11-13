import React from 'react';
import './Login.css';
import {BrowserRouter as Router, Switch, Route, useHistory} from 'react-router-dom';

function Login(props){

    const history = useHistory();
    async function authenticate_student(){
        const email = document.getElementById("emailField").value;
        const password = document.getElementById("passwordField").value;

        const url = `http://localhost:5000/authenticate/auth_student?email=${email}&password=${password}`;
        await fetch(url)
        .then(res => res.json())
        .then(res => {
            if(res.authenticated){
                const id = res.id;
                history.push(`/s/${id}`);
            }
        });
    }
    async function authenticate_teacher(){
        const email = document.getElementById("emailField").value;
        const password = document.getElementById("passwordField").value;

        const url = `http://localhost:5000/authenticate/auth_teacher?email=${email}&password=${password}`;
        await fetch(url)
        .then(res => res.json())
        .then(res => {
            if(res.authenticated){
                const id = res.id;
                history.push(`/t/${id}`);
            }
        });
    }

    return (
        <div className="login-container">
            <div className="left-pane">

            </div>
            <div className="right-pane">
                <input id="emailField" type="text" name="email"/>
                <br></br>
                <input id="passwordField" type="text" name="password"/>
                <br></br>
                <div className="button-box">
                    <button onClick={() => authenticate_student()}>Login as student</button>
                    <br></br>
                    <button onClick={() => authenticate_teacher()}>Login as teacher</button>
                </div>
            </div>
        </div>
    );
}
export default Login;
