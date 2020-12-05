import {useState, useEffect} from 'react';

const isNumeric = (string) => {
	return /^-?\d+$/.test(string) || string === "";
}

function NewSession(props) {

	const courseId = props.courseId;

	const [students, setStudents] = useState([]);
	useEffect( () => {
		const fetchStudents = async () => {

			await fetch(`http://localhost:5000/courses/${courseId}/students`)
				.then(res => res.json())
				.then(res => res.status === "OK" ? res.result : [])
				.then(students => {

					setStudents(students);
					const array = [];
					for(let i=0; i<students.length; i++){
						array[i] = 1;
					}

					setAttendedList(array);
				});
		}

		fetchStudents();

	}, []);

	const [session, setSession] = useState({
		week: 0,
		topic: "",
		type: "lecture",
		length: 1,
		date: ""
	});

	const [attendedList, setAttendedList] = useState([]);

	const handleChange = (event) => {

		event.preventDefault();

		const target = event.target;
		const name = target.name;

		if (name === "length") {

			if (!isNumeric(target.value)){
				alert("It should be a number");
				return;
			} else if ( parseInt(target.value) > 10) {
					alert("To big of a length");
					return;
			} else {
				const array = [];
				for(let i=0; i<students.length; i++) {
					array.push(parseInt(target.value));
				}

				setAttendedList(array);
			}

		}

		setSession({...session, [name] : target.value});
	}

	const onSubmit = async (event) => {
		// TODO submit the informatin into the api
		event.preventDefault();
		if (session.topic === "" ||
			session.date === "" ||
			session.type === "" ||
			session.week <= 0 ||
			session.length <= 0 ||
			session.length > 10) {

			alert("Your input is wrong");
			return;
		}
		await fetch(`http://localhost:5000/courses/${courseId}/attendance`, {
			method: 'post',
            headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(session)
		})
			.then(res => res.json())
			.then(res => {
				if (res.status === "OK"){
					// TODO now you should add the student entries
					console.log(res.result.insertId);
					submitStudents(res.result.insertId);
				}
			})
	}


	const submitStudents = async (sessionId) => {

		const body = students.map( (student, key) => {
			return ({id: student.id, length: attendedList[key]});
		});

		await fetch(`http://localhost:5000/courses/${courseId}/attendance/${sessionId}`,{
			method: 'post',
            headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(body)
		})
			.then(res => res.json())
			.then(res => res.status === "OK" ? res.result: null)
			.then(result => {

				if(result.affectedRows === students.length){
					alert("The session was successfully added");
				}

			})
			.catch((err) => console.log(err));
	};

	const functionGenerator = (key) => {

		const changeStudentAttended = (delta) => {
			
			const newArray = [...attendedList];
			const newValue = attendedList[key] + delta;

			if(newValue > session.length || newValue < 0) {
				alert("Number not allowed");
				return;
			}

			newArray[key] = newValue;
			
			setAttendedList(newArray);
		}

		return changeStudentAttended;
	}

	return (
		<div className="add-session">
			<label>
				Week:
				<input name="week" placeholder="week" type="number" onChange={handleChange} value={session.week} />
			</label>
			<label>
				Topic:
				<input name="topic" placeholder="topic" onChange={handleChange} value={session.topic} />
			</label>
			<label>
				Type:
				<select name="type" placeholder="Type" onChange={handleChange} value={session.type}>
					<option value="lecture">Lecture</option>
					<option value="seminar">Seminar</option>
				</select>
			</label>
			<label>
				Length:
				<input name="length" type="number" placeholder="length" onChange={handleChange} value={session.length} />
			</label>
			<label>
				Date:
				<input name="date" placeholder="week" type="date" onChange={handleChange} value={session.date} />
			</label>
			<button onClick={onSubmit}>Submit</button>
			<div className="horizontal-divider"></div>
			<table>
				<thead>
					<tr>
						<th>Id</th>
						<th>Firstname</th>
						<th>Lastname</th>
						<th>Attended</th>
						<th></th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{students.map( (student, key) => <StudentRow key={key} student={student} length={attendedList[key]} callback={functionGenerator(key)} />)}
				</tbody>
			</table>
		</div>
	);
}

function StudentRow(props){
	const student = props.student;
	const callback = props.callback;

    return (
        <tr>
			<td>{student.id}</td>
            <td>{student.firstname}</td>
            <td>{student.lastname}</td>
            <td>{typeof props.length !== "NaN" ? props.length : "Invalid"}</td>
            <td>
                <button onClick={() => callback(-1)}><i className="material-icons">remove</i></button>
            </td>
            <td>
                <button onClick={() => callback(1)}><i className="material-icons">add</i></button>
            </td>
        </tr>
    );
}

export default NewSession;
