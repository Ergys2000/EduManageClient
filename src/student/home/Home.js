import React, { useEffect, useState } from "react";
import {useHistory} from 'react-router-dom';
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
				<Events studentId = {studentId} />
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
	const studentId = props.studentId;

	/* Fetch the events from the api */
	const [events, setEvents] = useState([]);
	useEffect(() => {
		const fetchEvents = async () => {
			const token = sessionStorage.getItem("jwt");
			const bearer = "Bearer " + token;
			await fetch(`${apiLink}/students/${studentId}/events`, {
				headers: {
					'Authorization': bearer
				}
			})
				.then(res => res.json())
				.then(res => res.status === "OK" ? res.result : [])
				.then(events => {
					setEvents(events);
				})
		}

		fetchEvents();
	}, []);

	return (
		<div className="events">
			<div className="head">
				<h3>Upcoming Events</h3>
			</div>
			{events.map(event => <Event key={event.id} event={event} />)}
		</div>
	);
}

/* displays a single event */
function Event(props) {
	const e = props.event;
	return (
		<div className="event">
			<h4>{e.title}</h4>
			<p><b>Due: </b>{e.due}</p>
			<p><b>Category: </b> {e.classInstanceID ? "School" : "Class"}</p>
			<p>{e.description}</p>
		</div>
	);
}

/* Displayes the list of the courses and the average grade */
function Courses(props) {
	const studentId = props.studentId;
	const [courses, setCourses] = useState([]);
	useEffect(() => {
		const fetchCourses = async () => {
			const token = sessionStorage.getItem("jwt");
			const bearer = "Bearer " + token;
			await fetch(`${apiLink}/students/${studentId}/courses`, {
				headers: {
					'Authorization': bearer
				}
			})
				.then(res => res.json())
				.then(res => res.status === "OK" ? res.result : [])
				.then(courses => {
					setCourses(courses);
				})
		}
		fetchCourses();
	}, []);
	return (
		<div className="courses">
			<div className="head">
				<h3>Course stats</h3>
			</div>
			<table>
				<thead>
					<tr>
						<th>Course name</th>
						<th>Grade Average</th>
						<th>Max. can get</th>
					</tr>
				</thead>
				<tbody>
					{courses.map(course => <CourseRow key={course.id} course={course} studentId={studentId} />)}
				</tbody>
			</table>
		</div>
	);
}

/* Responsible for displaying a course in a single row */
function CourseRow(props) {
	const studentId = props.studentId;
	const course = props.course;

	const history = useHistory();

	const [average, setAverage] = useState(null);
	const [maxAvg, setMaxAvg] = useState(null);
	useEffect(() => {
		/* This function calculates the average grade so far 
		 * and the max. can get grade */
		const calculateAverages = (grades) => {
					/* The sum will hold the weighted sum of grades */
					let sum = 0;
					/* weightSum will hold the sum of weights */
					let weightSum = 0;

					/* Loop throught the grades and calculate the weighted sum
					 * and the sum of weights*/
					grades.forEach(grade => {
						sum += grade.grade*grade.weight
						weightSum += grade.weight;
					});
					/* we scale the average according to the sum of the weights */
					const avg = sum / weightSum;

					/* Now we calculate the max can get value for the grade
					 * average */
					const maxGrade = 10;
					const leftWeight = 1 - weightSum;
					const maxAvg = sum + maxGrade * leftWeight;

					return [avg, maxAvg];
		}

		const fetchGrades = async () => {
			const token = sessionStorage.getItem("jwt");
			const bearer = "Bearer " + token;
			await fetch(`${apiLink}/students/${studentId}/courses/${course.id}/grades`,{
				headers: {
					'Authorization': bearer
				}
			})
				.then(res => res.json())
				.then(res => res.status === "OK" ? res.result : [])
				.then(grades => {
					const [avg, maxAvg] = calculateAverages(grades);
					setAverage(avg);
					setMaxAvg(maxAvg);
				});
		}

		fetchGrades();
	}, []);

	const onClick = () => {
		history.push(`courses/${course.id}`);
	}
	return (
		<tr onClick={onClick}>
			<td>{course.name}</td>
			<td>{average ? average.toFixed(2) : ""}</td>
			<td>{maxAvg ? maxAvg.toFixed(2) : ""}</td>
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
