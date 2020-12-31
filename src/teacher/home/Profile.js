import { useContext, useState, useEffect } from 'react';
import { TeacherContext } from '../Teacher';
import { validateEmail, validateNameString, validatePhone } from '../../Utils';
import apiLink from '../../API';

/* Controlled component for updating info about the teacher */
function Profile(props) {
	const teacherId = useContext(TeacherContext);

	/* This state will hold info about the form entered so far
	 * We use the useEffect hook to connect to the database and get the
	 * current info about the teacher, then the teacher can modify them
	 * */
	const [teacher, setTeacher] = useState({
		firstname: "",
		lastname: "",
		email: "",
		address: "",
		phone: ""
	});
	useEffect(() => {
		const fetchteacher = async () => {
			const token = sessionStorage.getItem("jwt");
			const bearer = "Bearer " + token;
			await fetch(`${apiLink}/teachers/${teacherId}`, {
				headers: { 'Authorization': bearer }
			})
				.then(res => res.json())
				.then(res => res.status === "OK" ? res.result : {})
				.then(teacher => setTeacher(teacher))
				.catch(err => console.log(err));
		}
		fetchteacher();
	}, [teacherId]);

	/* This function is used for handling form changes */
	const handleChange = (event) => {
		event.preventDefault();

		const target = event.target;
		/* The name of the input field that has changed */
		const name = target.name;
		/* The changed value of the input field */
		const value = target.value;

		if (name === "firstname" || name === "lastname") {
			if (!validateNameString(value)) {
				alert(`The firstname and lastname fields should only containt letters, and be no longer than 30 characters`);
				return;
			}
		}

		/* Update the state if all the validations were successful */
		setTeacher({ ...teacher, [name]: value });
	}

	/* This functions submits the information to the api and handles the
	 * response */
	const onSubmit = async (event) => {
		event.preventDefault();

		/* Check the integrity of email and phone number fields */
		if (!validateEmail(teacher.email)) {
			alert("Invalid email");
			return;
		} else if (!validatePhone(teacher.phone)) {
			alert("Invalid phone number");
			return;
		}

		const token = sessionStorage.getItem("jwt");
		const bearer = "Bearer " + token;
		await fetch(`${apiLink}/teachers/${teacherId}`, {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': bearer
			},
			body: JSON.stringify(teacher)
		})
			.then(res => res.json())
			.then(res => res.status === "OK" ? res.result : null)
			.then(result => {
				if (result) {
					result.affectedRows === 1
						? alert("teacher updated successfully")
						: alert("Something went wrong, pleasy try again");
				} else throw new Error("teacher could not update due to an internal error");
			}).catch(err => alert(err.message));
	}


	return (
		<div className="option">
			<div className="profile-form">
				<h2>Update profile info</h2>
				<form className="teacher-form" onSubmit={onSubmit}>
					<label>
						Firstname:
					<input onChange={handleChange} name="firstname" value={teacher.firstname} />
					</label>
					<label>
						Lastname:
					<input onChange={handleChange} name="lastname" value={teacher.lastname} />
					</label>
					<label>
						Email:
					<input type="email" onChange={handleChange} name="email" value={teacher.email} />
					</label>
					<label>
						Address:
					<input onChange={handleChange} name="address" value={teacher.address} />
					</label>
					<label>
						Phone number:
					<input onChange={handleChange} name="phone" value={teacher.phone} />
					</label>
					<button>Update</button>
				</form>
			</div>
		</div>
	);
}

export default Profile;

