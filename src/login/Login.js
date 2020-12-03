import React from 'react';
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
        <div style={{backgroundColor: "white", borderRadius: "12px"}} className="Login">
           
            <div  className="right-pane">
				<h2>Learning Management System</h2>
                <h2 style={{textAlign: "center"}}>Login</h2>
                <input style={{backgroundColor: "white"}} id="emailField" placeholder="Email..." type="text" name="email"/>
                <br></br>
                <input style={{backgroundColor: "white"}} id="passwordField" placeholder="Password..." type="password" name="password"/>
                <br></br>
                <div className="button-box">
                    <button style={{color:"white", fontWeight: "bold"}} onClick={() => authenticate_student()}>Login as student</button>
                    <br></br>
                    <button style={{color:"white", fontWeight: "bold"}} onClick={() => authenticate_teacher()}>Login as teacher</button>
                </div>
            </div>
        </div>
    );
}
export default Login;
