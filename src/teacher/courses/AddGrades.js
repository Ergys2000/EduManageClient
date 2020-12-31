import { useState, useEffect, useContext } from 'react';
import apiLink from "../../API";
import { useHistory } from 'react-router-dom';
import { TeacherContext } from "../Teacher";
import { CourseContext } from "./Course";

/* This component is responsible for handling uploading a bunch of grades for
 * all the students of a course. */
function AddGrades(props) {
	const course = useContext(CourseContext);
	const teacherId = useContext(TeacherContext);
	const history = useHistory();

	const [students, setStudents] = useState([]);
	useEffect(() => {
		const fetchStudents = async () => {

			const token = sessionStorage.getItem("jwt");
			const bearer = 'Bearer ' + token;
			await fetch(`${apiLink}/teachers/${teacherId}/courses/${course.id}/students`, {
				headers: {
					'Authorization': bearer
				}
			})
				.then(res => res.json())
				.then(res => res.status === "OK" ? res.result : [])
				.then(students => {
					setStudents(students);

					// also populate the list of grades with a default value
					const array = [];
					for (let i = 0; i < students.length; i++)
						array.push(4);
					setGrades(array);
				});
		}

		fetchStudents();

	}, []);

	// session will hold the common values for all the grades
	const [session, setSession] = useState({
		weight: 0.0,
		date: ""
	});

	// will hold the grades for each student
	const [grades, setGrades] = useState([]);

	// handles <input> element changes
	const handleChange = (event) => {
		const target = event.target;
		const name = target.name;

		setSession({ ...session, [name]: target.value });
		event.preventDefault();
	}

	// submits the information into the api
	const onSubmit = async () => {
		if (session.weight === 0 ||
			session.weight >= 1 ||
			session.date === "") {

			alert("Date is not set or weight is wrong!");
			return;
		}
		/* Creates an array where each element an object with a student id and
		 * a grade, this array is created from two existing arrays:
		 *      1. The students array from which we map
		 *      2. The grades array where grades[i] belongs to students[i]
		 *          
		 * */
		const studentGradeList = students.map((student, key) => {
			return { id: student.id, grade: grades[key] };
		});
		/* Creates the body of the post request */
		const body = {
			weight: session.weight,
			date: session.date,
			students: studentGradeList
		};

		const token = sessionStorage.getItem("jwt");
		const bearer = "Bearer " + token;
		await fetch(`${apiLink}/teachers/${teacherId}/courses/${course.id}/grades`, {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': bearer
			},
			body: JSON.stringify(body)
		})
			.then(res => res.json())
			.then(res => res.status === "OK" ? res.result : res.message)
			.then(result => {
				if (result.affectedRows === students.length) {
					alert("Grades were added successfully!");
					history.push(`/t/${teacherId}/courses/${course.id}/grades`);
				}
			})
			.catch((err) => console.log(err));
	}

	// creates a different callback function for each student row
	// to modify it's own grade via the two buttons provided 
	const functionGenerator = (key) => {

		const callback = (delta) => {

			const newArray = [...grades];
			newArray[key] += delta;

			/* Check if the new value conforms to the rules */
			if (newArray[key] > 10 || newArray[key] < 4) {
				alert("not allowed");
				return;
			}

			setGrades(newArray)
		}
		return callback;
	}

	return (
		<div className="add-grades">
			<label>
				Weight:
				<input name="weight" type="number" step="0.05" value={session.weight} onChange={handleChange} />
			</label>
			<label>
				Date:
				<input name="date" type="date" value={session.date} onChange={handleChange} />
			</label>
			<button onClick={onSubmit}>Submit</button>
			<div className="horizontal-divider"></div>
			<table>
				<thead>
					<tr>
						<th>Id</th>
						<th>Firstname</th>
						<th>Lastname</th>
						<th>Grade</th>
						<th></th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{students.map((student, key) => <StudentRow key={key} student={student} grade={grades[key]} callback={functionGenerator(key)} />)}
				</tbody>
			</table>
		</div>
	);

}

/* Just displays a single row tha contains information about a student */
const StudentRow = (props) => {
	const student = props.student;
	const callback = props.callback;
	return (
		<tr>
			<td>{student.id}</td>
			<td>{student.firstname}</td>
			<td>{student.lastname}</td>
			<td>{props.grade}</td>
			<td>
				<button onClick={() => callback(-1)}><i className="material-icons">remove</i></button>
			</td>
			<td>
				<button onClick={() => callback(1)}><i className="material-icons">add</i></button>
			</td>
		</tr>
	);
}

/* This component is responsible for handling uploading a single student grade */
function AddSingleGrade(props) {
	/* Use the defined contexts */
	const teacherId = useContext(TeacherContext);
	const course = useContext(CourseContext);

	/* Will hold the controlled form information */
	const [form, setForm] = useState({
		weight: 0.0,
		date: "",
		studentId: -1,
		grade: 4
	});

	/* This state holds the students of the course */
	const [students, setStudents] = useState([]);
	useEffect(() => {
		const fetchStudents = async () => {

			const token = sessionStorage.getItem("jwt");
			const bearer = "Bearer " + token;

			await fetch(`${apiLink}/teachers/${teacherId}/courses/${course.id}/students`,{
				headers: {'Authorization': bearer}
			})
				.then(res => res.json())
				.then(res => res.status === "OK" ? res.result : [])
				.then(students => {
					setStudents(students);
					setForm({...form, 'studentId': students[0].id});
				})
				.catch(err => console.log(err));
		}

		fetchStudents();
	}, []);

	/* Handles input changes and validates them */
	const handleChange = (event) => {
		event.preventDefault();

		const name = event.target.name;
		const value = event.target.value;

		if (name === "grade") {
			if (value > 10 || value < 4) {
				alert("Grade is wrong!");
				return;
			}
		}

		if(name === "weight") {
			if (value > 1 || value < 0) {
				alert("Weight cannot be bigger than 1 or smaller than 0!");
				return;
			}
		}

		setForm({...form, [name]: value});
	}

	/* Handles submitting the form in the api */
	const onSubmit = async (event) => {
		event.preventDefault();
		/* input validation */
		if(form.date === "" || form.weight === 0.0) {
			alert("Grade information is wrong!");
			return;
		}

		/* Create the body of the request */
		const body = {
			weight: form.weight,
			date: form.date,
			students: [{id: form.studentId, grade: form.grade}]
		};

		/* Make the request */
		const token = sessionStorage.getItem("jwt");
		const bearer = "Bearer " + token;
		await fetch(`${apiLink}/teachers/${teacherId}/courses/${course.id}/grades`,{
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': bearer
			},
			body: JSON.stringify(body)
		})
			.then(res => res.json())
			.then(res => {
				if(res.status === "OK"){
					alert("Grade added successfully!");
				} else {
					alert(res.message);
				}
			});
	}


	return (
		<div className="add-grades">
			<label>
				Weight:
				<input onChange={handleChange} value={form.weight} name="weight" type="number" step="0.05" max={1} min={0} />
			</label>
			<label>
				Date:
				<input onChange={handleChange} value={form.date} name="date" type="date" />
			</label>
			<label>
				Select the student:
				<select onChange={handleChange} value={form.studentId} name="studentId">
					{students.map(student => <option 
						key={student.id} 
						value={student.id}
					>
						{`${student.firstname} ${student.lastname}`}
					</option>)}
				</select>
			</label>
			<label>
				Select the grade:
				<input onChange={handleChange} value={form.grade} name="grade" type="number" step="1" min={4} max={10} />
			</label>
			<button onClick={onSubmit}>Submit</button>
		</div>
	);
}

export default AddGrades;
export {AddSingleGrade};
