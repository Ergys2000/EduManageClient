import {useState, useEffect} from 'react';

function AddGrades(props) {
	const courseId = props.courseId;

	const [students, setStudents] = useState([]);
	useEffect(() => {
		const fetchStudents = async () => {

			await fetch(`http://localhost:5000/courses/${courseId}/students`)
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

		setSession({...session, [name]: target.value});
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
		const studentGradeList = students.map((student, key) => {
			return {id: student.id, grade: grades[key]};
		});
		const body = {
			weight: session.weight,
			date: session.date,
			students: studentGradeList
		};
		await fetch(`http://localhost:5000/courses/${courseId}/grades`, {
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(body)
		})
			.then(res => res.json())
			.then(res => res.status === "OK" ? res.result : res.message)
			.then(result => console.log(result))
			.catch((err) => console.log(err));
	}

	// creates a different callback function for each student row
	// to modify itself
	const functionGenerator = (key) => {

		const callback = (delta) => {

			const newArray = [...grades];
			newArray[key] += delta;

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

export default AddGrades;
