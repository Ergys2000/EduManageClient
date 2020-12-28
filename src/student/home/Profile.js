import { useContext, useState, useEffect } from 'react';
import { StudentContext } from '../Student';
import { validateEmail, validateNameString, validatePhone } from '../../Utils';
import apiLink from '../../API';

/* Controlled component for updating info about the teacher */
function Profile(props) {
	const studentId = useContext(StudentContext);

	/* This state will hold info about the form entered so far
	 * We use the useEffect hook to connect to the database and get the
	 * current info about the student, then the student can modify them
	 * */
	const [student, setStudent] = useState({});
	useEffect(() => {
		const fetchStudent = async () => {
			const token = sessionStorage.getItem("jwt");
			const bearer = "Bearer " + token;
			await fetch(`${apiLink}/students/${studentId}`, {
				headers: { 'Authorization': bearer }
			})
				.then(res => res.json())
				.then(res => res.status === "OK" ? res.result : {})
				.then(student => setStudent(student))
				.catch(err => console.log(err));
		}
		fetchStudent();
	}, []);

	/* This function is used for handling form changes */
	const handleChange = (event) => {
		event.preventDefault();

		const target = event.target;
		/* The name of the input field that has changed */
		const name = target.name;
		/* The changed value of the input field */
		const value = target.value;

		/* Perform validations */
		if (name === "firstname" || name === "lastname") {
			if (!validateNameString(value)) {
				alert(`The firstname and lastname fields should only containt letters, and be no longer than 30 characters`);
				return;
			}
		}

		/* Update the state if all the validations were successful */
		setStudent({ ...student, [name]: value });
	}

	/* This functions submits the information to the api and handles the
	 * response */
	const onSubmit = async (event) => {
		event.preventDefault();

		/* Check the integrity of email and phone number fields */
		if (!validateEmail(student.email)) {
			alert("Invalid email");
			return;
		} else if (!validatePhone(student.phone)) {
			alert("Invalid phone number");
			return;
		}

		/* Set up the request */
		const token = sessionStorage.getItem("jwt");
		const bearer = "Bearer " + token;
		await fetch(`${apiLink}/students/${studentId}`, {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': bearer
			},
			body: JSON.stringify(student)
		})
			.then(res => res.json())
			.then(res => {
				console.log(res);
				return res;
			})
			.then(res => res.status === "OK" ? res.result : null)
			.then(result => {
				if (result) {
					result.affectedRows === 1
						? alert("Student updated successfully")
						: alert("Something went wrong, pleasy try again");
				} else throw new Error("Student could not update due to an internal error");
			}).catch(err => alert(err.message));
	}


	return (
		<div className="option">
			<h2>Update profile info</h2>
			<form className="student-form" onSubmit={onSubmit}>
				<h2>Student id: {studentId}</h2>
				<label>
					Firstname:
					<input onChange={handleChange} name="firstname" value={student.firstname} />
				</label>
				<label>
					Lastname:
					<input onChange={handleChange} name="lastname" value={student.lastname} />
				</label>
				<label>
					Email:
					<input type="email" onChange={handleChange} name="email" value={student.email} />
				</label>
				<label>
					Address:
					<input onChange={handleChange} name="address" value={student.address} />
				</label>
				<label>
					Phone number:
					<input onChange={handleChange} name="phone" value={student.phone} />
				</label>
				<button>Update</button>
			</form>
		</div>
	);
}

export default Profile;
