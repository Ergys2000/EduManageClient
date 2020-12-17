import React, {useEffect, useState} from 'react';
import {Link, Route, Switch, useRouteMatch} from 'react-router-dom';
import Course from './Course';
import apiLink from "../../API";


function Courses(props){
	let {path} = useRouteMatch();
	const teacherId = props.teacherId;

	return (
		<div className="option">
			<Switch>
				<Route exact path={`${path}/`} >
					<CourseList teacherId={teacherId}/>
				</Route>
				<Route path={`${path}/:courseId`}>
					<Course teacherId={teacherId}/>
				</Route>
			</Switch>
		</div>
	);
}


function CourseList(props){
	const teacherId = props.teacherId;
	const [courses, setCourses] = useState([]);
	useEffect(() => {
		
		const fetchCourses = async () => {
			const token = sessionStorage.getItem("jwt");
			const bearer = 'Bearer ' + token;

			await fetch(`${apiLink}/teachers/${teacherId}/courses`, {
				headers: {
					'Authorization': bearer
				}
			})
			.then(res => res.json())
			.then(res => {
				console.log(res);
				if(res.status === "OK"){
					setCourses(res.result);
				}
			});
		}
		fetchCourses();

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
