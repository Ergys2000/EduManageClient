import React from 'react';
import { useHistory } from 'react-router-dom';
import apiLink from "../API";

function Login(_props) {

	const history = useHistory();

	const auth_student = async () => {
		const email = document.getElementById("emailField").value;
		const password = document.getElementById("passwordField").value;
		const url = `${apiLink}/auth/auth_student?email=${email}&password=${password}`;
		await fetch(url)
			.then(res => res.json())
			.then(res => res.status === "OK" ? res.result : {})
			.then(result => {
				if (result.authenticated) {
					const token = result.token;
					const id = result.id;
					sessionStorage.setItem("jwt", token);
					history.push(`/s/${id}`);
				}
			});
	}

	const auth_teacher = async () => {
		const email = document.getElementById("emailField").value;
		const password = document.getElementById("passwordField").value;
		const url = `${apiLink}/auth/auth_teacher?email=${email}&password=${password}`;
		await fetch(url)
			.then(res => res.json())
			.then(res => res.status === "OK" ? res.result : {})
			.then(result => {
				if (result.authenticated) {
					const token = result.token;
					const id = result.id;
					sessionStorage.setItem("jwt", token);
					history.push(`/t/${id}`);
				}
			});
	}

	return (
		<div style={{ borderRadius: "12px" }} className="Login">

			<div className="right-pane">
				<h2>Learning Management System</h2>
				<br></br>
				<h2>Login</h2>
				<input id="emailField" placeholder="Email..." type="text" name="email" />
				<br></br>
				<input id="passwordField" placeholder="Password..." type="password" name="password" />
				<br></br>
				<div className="button-box">
					<button onClick={() => auth_student()}>Login as student</button>
					<br></br>
					<button onClick={() => auth_teacher()}>Login as teacher</button>
				</div>
			</div>
		</div>
	);
}
export default Login;
