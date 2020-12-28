import { useState, useEffect, useContext } from 'react';
import { useParams, Link, Switch, useRouteMatch, Route } from 'react-router-dom';
import Attendance from './courses/Attendance';
import Session from './courses/AttendanceSession';
import apiLink from "../API";
import {TeacherContext} from "./Teacher";
import { organizeGrades } from '../Utils';

function Class(props) {
	const { path } = useRouteMatch();
	const teacherId = useContext(TeacherContext);
	return (
		<div className="option">
			<Switch>
				<Route exact path={`${path}/`}>
					<CourseList />
				</Route>
				<Route exact path={`${path}/:courseId/attendance`}>
					<Attendance teacherId={teacherId}/>
				</Route>
				<Route exact path={`${path}/:courseId/attendance/:sessionId`}>
					<Session teacherId={teacherId} />
				</Route>
				<Route exact path={`${path}/:courseId/grades`}>
					<StudentList />
				</Route>
			</Switch>
		</div>
	);
}

function CourseList(props) {
	const [courses, setCourses] = useState([]);
	const teacherId = useContext(TeacherContext);
	useEffect(() => {
		const fetchCourses = async () => {
			const token = sessionStorage.getItem("jwt");
			const bearer = 'Bearer ' + token;
			await fetch(`${apiLink}/teachers/${teacherId}/class`, {
				headers: {
					'Authorization': bearer
				}
			})
				.then(res => res.json())
				.then(res => res.status === "OK" ? res.result : [])
				.then(courses => {
					setCourses(courses);
				});
		}
		fetchCourses();
	}, []);
	return (
		<div className="Course-List">
			{courses.map(x => CourseListItem({ course: x }))}
		</div>
	);
}

function CourseListItem(props) {
	let { url } = useRouteMatch();
	return (
		<div className="Course-Info-Item">

			<div className="Course-Header">
				<h2>{props.course.name}</h2>
			</div>

			<div className="Course-Body">
				<Link to={`${url}/${props.course.id}/attendance`}>
					<i className="material-icons">chevron_right</i>
					<p>Attendance</p>
				</Link>
				<Link to={`${url}/${props.course.id}/grades`}>
					<i className="material-icons">chevron_right</i>
					<p>Grades</p>
				</Link>
				<p>Category: {props.course.category}</p>
			</div>

		</div>
	);
}

function StudentList(props) {
	const teacherId = useContext(TeacherContext);

	const { courseId } = useParams();

	const [students, setStudents] = useState([]);
	useEffect(async () => {
		const fetchCourseGrades = async () => {
			const token = sessionStorage.getItem("jwt");
			const bearer = 'Bearer ' + token;
			await fetch(`${apiLink}/teachers/${teacherId}/courses/${courseId}/grades`, {
				headers: {
					'Authorization': bearer
				}
			})
				.then(res => res.json())
				.then(res => res.status === "OK" ? res.result : [])
				.then(result => {
					const students = organizeGrades(result);
					const elements = students.map(student => (
						<Grades name={student.firstname} grades={student.grades} key={student.id} />
					));
					setStudents(elements);
				});
		}
		fetchCourseGrades();
	}, []);

	return (
		<div className="student-list">
			{students}
		</div>
	);
}

// TODO display the grades of each student
function Grades(props) {
	const [hidden, setHidden] = useState(true);

	return (
		<div className="grades">
			<div className="head" onClick={() => setHidden(!hidden)}>
				<h4>{props.name}</h4>
			</div>
			<div className="body">
				<table className={hidden ? "hidden" : "shown"}>
					<thead>
						<tr>
							<th>Grade</th>
							<th>Weight</th>
							<th>Date</th>
						</tr>
					</thead>
					<tbody>
						{props.grades.map(grade => GradeRow(grade))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

function GradeRow(grade) {
	return (
		<tr key={grade.id}>
			<td>{grade.grade}</td>
			<td>{grade.weight}</td>
			<td>{grade.date}</td>
		</tr>
	);
}

export default Class;
