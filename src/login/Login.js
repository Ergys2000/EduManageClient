import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import apiLink from "../API";

const Login = (_props) => {

	const history = useHistory();

	const [form, setForm] = useState({
		email: "",
		password: ""
	});

	const auth_student = async () => {
		const email = form.email;
		const password = form.password;
		const url = `${apiLink}/auth/auth_student?email=${email}&password=${password}`;
		await fetch(url)
			.then(res => res.json())
			.then(res => {
				if (res.status === "OK") {
					if (res.result.authenticated) {
						const token = res.result.token;
						const id = res.result.id;
						sessionStorage.setItem("jwt", token);
						history.push(`/s/${id}`);
					}
				} else {
					alert(res.message);
				}
			}).catch(err => console.log(err));
	}

	const auth_teacher = async () => {
		const email = form.email;
		const password = form.password;
		const url = `${apiLink}/auth/auth_teacher?email=${email}&password=${password}`;
		await fetch(url)
			.then(res => res.json())
			.then(res => {
				if (res.status === "OK") {
					if (res.result.authenticated) {
						const token = res.result.token;
						const id = res.result.id;
						sessionStorage.setItem("jwt", token);
						history.push(`/t/${id}`);
					}
				} else {
					alert(res.message);
				}
			}).catch(err => console.log(err));
	}

	const onChange = (e) => {
		e.preventDefault();
		const name = e.target.name;
		const value = e.target.value;

		setForm({ ...form, [name]: value });
	}

	return (
		<div style={{ borderRadius: "12px" }} className="Login">

			<div className="right-pane">
				<h2>Learning Management System</h2>
				<br></br>
				<h2>Login</h2>
				<input placeholder="Email..." type="text" name="email" value={form.email} onChange={onChange} />
				<br></br>
				<input placeholder="Password..." type="password" name="password" value={form.password} onChange={onChange} />
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
