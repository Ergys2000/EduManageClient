import React, {useEffect, useState} from 'react';
import {Link, Route, Switch, useRouteMatch} from 'react-router-dom';
import Course from './Course';


function Courses(props){
	let {path, url} = useRouteMatch();
	const id = props.id;

	return (
		<div className="option">
			<Switch>
				<Route exact path={`${path}/`} >
					<CourseList id={id}/>
				</Route>
				<Route path={`${path}/:courseId`}>
					<Course id={id}/>
				</Route>
			</Switch>
		</div>
	);
}


function CourseList(props){
	const [courses, setCourses] = useState([]);
	useEffect(() => {
		fetch(`http://3.138.109.77:5000/teachers/${props.id}/courses`)
		.then(res => res.json())
		.then(res => {
			if(res.status === "OK"){
				setCourses(res.result);
			}
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
