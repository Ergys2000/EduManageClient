import {useState, useEffect} from 'react';
import {Link, Switch, useRouteMatch, Route} from 'react-router-dom';
import Attendance from './courses/Attendance';
import Session from './courses/AttendanceSession';

function Class(props) {
	const {url, path} = useRouteMatch();
	return (
		<div className="option">
			<Switch>
				<Route exact path={`${path}/`}>
					<CourseList id={props.id} />
				</Route>
				<Route exact path={`${path}/:courseId/attendance`}>
					<Attendance />
				</Route>
				<Route exact path={`${path}/:courseId/attendance/:sessionId`}>
					<Session />
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
	useEffect(() => {
		fetch(`http://localhost:5000/teachers/${props.id}/class`)
			.then(res => res.json())
			.then(res => res.status==="OK"? res.result: [])
			.then(courses => {
				setCourses(courses);
			});
	}, []);
	return (
		<div className="Course-List">
			{courses.map(x => CourseListItem({course: x}))}
		</div>
	);
}

function CourseListItem(props) {
	let {url} = useRouteMatch();
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

function StudentList(props){
	return (
		<div className="Student-List">
			<Grades name="Ergys"/>
			<Grades name="John"/>
		</div>
	);
}

// TODO display the grades of each student
function Grades(props) {
	const grade = {grade: 1, weight: 0.2, date: "2020-14-5"};

	const [hidden, setHidden] = useState(true);

	return (
		<div className="Grades">
			<div className="head" onClick={() => setHidden(!hidden)}>
				<h4>{props.name}</h4>
			</div>
			<div className="body">
				<table className={hidden ? "hidden" : "shown"}>
					<tr>
						<th>Grade</th>
						<th>Weight</th>
						<th>Date</th>
					</tr>
					{GradeRow(grade)}
					{GradeRow(grade)}
					{GradeRow(grade)}
					{GradeRow(grade)}
					{GradeRow(grade)}
					{GradeRow(grade)}
				</table>
			</div>
		</div>
	);
}

function GradeRow(grade) {
	return (
		<tr>
			<td>{grade.grade}</td>
			<td>{grade.weight}</td>
			<td>{grade.date}</td>
		</tr>
	);
}

export default Class;
