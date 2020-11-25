import React, {useEffect, useState} from 'react';
import {useParams, useRouteMatch, Switch, Route, Link, Redirect} from 'react-router-dom';
import PostList from './PostList';
import FileList from './FileList';

function Course(props){
	const studentId = props.id;
	const {courseId} = useParams();
	const {path, url} = useRouteMatch();
	return (
		<div className="Course">
			<NavBar courseId={courseId}/>
			<Switch>
				<Route exact path={`${path}/`}>
					<Redirect to={`${url}/home`}  />
				</Route>
				<Route exact path={`${path}/posts`}>
					<PostList  courseId={courseId}/>
				</Route>
				<Route exact path={`${path}/files`}>
					<FileList courseId={courseId}/>
				</Route>
			</Switch>
		</div>
	);
}

function NavBar(props){
	const {url} = useRouteMatch();
	const courseId = props.courseId;
	const [courseName, setCourseName] = useState("Course name");
	useEffect(() =>{
		fetch(`http://localhost:5000/courses/${courseId}`)
		.then(res => res.json())
		.then(res => res.status === "OK" ? res.result : null)
		.then(course => setCourseName(course.name));
	}, []);
	return (
		<div className="NavBar">
			<h1>{courseName}</h1>
			<ul>
				<li>
					<Link to={`${url}/home`}>Home</Link>
				</li>
				<li>
					<Link to={`${url}/posts`}>Posts</Link>
				</li>
				<li>
					<Link to={`${url}/files`}>Files</Link>
				</li>
			</ul>
		</div>
	);
}

export default Course;
