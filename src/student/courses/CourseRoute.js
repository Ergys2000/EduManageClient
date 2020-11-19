import React, {useEffect, useState} from 'react';
import {Link, Route, Switch, useParams, useRouteMatch} from 'react-router-dom';
import Course from './Course';


function Courses(props){
	const id = props.id;
	let {path} = useRouteMatch();

	return (
		<div className="option">
			<Switch>
				<Route exact path={`${path}/`} >
					<CourseList id={id}/>
				</Route>

				<Route path={`${path}/:courseId`} component={Course}/>
			</Switch>
		</div>
	);
}


function CourseList(props){
	const id = props.id;
	const [courses, setCourses] = useState([]);
	useEffect(() => {
		fetch(`http://localhost:5000/students/${id}/courses`)
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
