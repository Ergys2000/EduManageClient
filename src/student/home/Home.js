import React, { useEffect, useState } from "react";
import apiLink from "../../API";

function Home(props) {
	const studentId = props.studentId;
	/* This state is used to information about the student */
	const [student, setStudent] = useState(null);

	useEffect(() => {
		const token = sessionStorage.getItem("jwt");
		const bearer = "Bearer " + token;
		fetch(`${apiLink}/students/${studentId}`, {
			headers: {
				'Authorization': bearer
			}
		})
			.then(res => res.json())
			.then(res => res.status === "OK" ? res.result : null)
			.then(student => setStudent(student));
	}, []);

	return (

		<div className="option">
			<h1>Welcome {(student) ? student.firstname : "..."}</h1>
			<div className="dashboard">
				<Events />
				<div className="personal">
					<Courses studentId={studentId} />
					<ProfileInfo student={student} />
				</div>
			</div>
		</div>

	);
}

/* this component is responsible for displaying the school events */
function Events(props) {
	return (
		<div className="events">
			<div className="head">
				<h3>Upcoming Events</h3>
			</div>
			<Event />
			<Event />
			<Event />
			<Event />
		</div>
	);
}

/* displays a single event */
function Event(props) {
	return (
		<div className="event">
			<h4>Title</h4>
			<p>This is an event with an description.</p>
		</div>
	);
}

/* Displayes the list of the courses and the average grade */
function Courses(props) {
	return (
		<div className="courses">
			<div className="head">
				<h3>Course stats</h3>
			</div>
			<table>
				<tr>
					<th>Course name</th>
					<th>Grade Average</th>
					<th>Undone assignments</th>
				</tr>
				<CourseRow />
				<CourseRow />
				<CourseRow />
			</table>
		</div>
	);
}
/* Responsible for displaying a course in a single row */
function CourseRow(props) {
	return (
		<tr>
			<td>Mathematics</td>
			<td>7.0</td>
			<td>3</td>
		</tr>
	);
}

/* Displays profile information about the student */
function ProfileInfo(props) {
	const student = props.student ? props.student : {};
	return (
		<div className="profile">
			<div className="head">
				<h3>Profile information</h3>
				<button>Update</button>
			</div>
			<div className="labels">
				<p>Name: </p>
				<p>Surname: </p>
				<p>Email: </p>
				<p>Address: </p>
				<p>Number: </p>
				<p>Age: </p>
				<p>Gender: </p>
				<p>Nationality: </p>
			</div>
			<div className="values">
				<p>{student.firstname}</p>
				<p>{student.lastname}</p>
				<p>{student.email}</p>
				<p>{student.address}</p>
				<p>{student.number}</p>
				<p>{student.age}</p>
				<p>{student.gender}</p>
				<p>{student.nationality}</p>
			</div>
		</div>
	);
}

export default Home;
