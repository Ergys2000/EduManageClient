import React, {useState, useEffect} from 'react';
import {Link, Route, Switch, useParams, useRouteMatch} from 'react-router-dom';


function Courses(props){
	let {id} = useParams();
	let {path, url}= useRouteMatch();

	return (
		<div className="option">
			<Switch>
				<Route exact path={`${path}/`} >
					<CourseList id={props.id}/>
				</Route>
			</Switch>
		</div>
	);
}


function CourseList(props){
	const {id} = useParams();
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
