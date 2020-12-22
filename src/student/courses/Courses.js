import React, {useEffect, useState, useContext} from 'react';
import {Link, Route, Switch, useRouteMatch} from 'react-router-dom';
import Course from './Course';
import apiLink from "../../API";
import {StudentContext} from "../Student";

function Courses(props){
	let {path} = useRouteMatch();

	return (
		<div className="option">
			<Switch>
				<Route exact path={`${path}/`} >
					<CourseList />
				</Route>
				<Route path={`${path}/:courseId`} >
					<Course />
				</Route>
			</Switch>
		</div>
	);
}

function CourseList(props){
	const studentId = useContext(StudentContext);
	const [courses, setCourses] = useState([]);
	useEffect(async () => {
		getCourses();
	}, []);
	
	async function getCourses(){
		const token = sessionStorage.getItem("jwt");
		const bearer = 'Bearer ' + token;
		await fetch(`${apiLink}/students/${studentId}/courses`,{
			headers: {
				'Authorization': bearer
			}
		})
			.then(res => res.json())
			.then(res => {
				if(res.status==="OK"){
					setCourses(res.result);
				}
			});
	}
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
