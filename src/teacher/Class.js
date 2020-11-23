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
					<h2>Grades</h2>
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
				<Link to={`${url}/${props.course.id}/attendance`}>Attendance</Link>
				<Link to={`${url}/${props.course.id}/grades`}>Grades</Link>
				<p>Category: {props.course.category}</p>
			</div>

		</div>
	);
}

function Grades(props) {
	return (
		<div>

		</div>
	);
}
function GradeItem(props) {
	return (
		<div>

		</div>
	);
}

export default Class;
