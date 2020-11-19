import React, {useEffect, useState} from 'react';
import {Link, Route, Switch, useParams, useRouteMatch} from 'react-router-dom';
import Course from './Course';
import Attendance from './Attendance';
import Session from './AttendanceSession';


function Courses(props){
	let {path, url} = useRouteMatch();
	const id = props.id;

	return (
		<div className="option">
			<Switch>
				<Route exact path={`${path}/`} >
					<CourseList id={id}/>
				</Route>

				<Route exact path={`${path}/:courseId`} >
					<Course />
				</Route>
				<Route exact path={`${path}/:courseId/attendance`} >
					<Attendance />
				</Route>
				<Route path={`${path}/:courseId/attendance/:sessionId`} >
					<Session />
				</Route>
			</Switch>
		</div>
	);
}


function CourseList(props){
	const [courses, setCourses] = useState([]);
	useEffect(() => {
		fetch(`http://localhost:5000/teachers/${props.id}/courses`)
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

function CourseListItem(props){
	let {url} = useRouteMatch();
	return (
		<div className="Course-Info-Item">

			<div className="Course-Header">
				<Link to={`${url}/${props.course.id}`}>{props.course.name}</Link>
			</div>

			<div className="Course-Body">
				<p>Category: {props.course.category}</p>
			</div>

		</div>
	);
}

export default Courses;