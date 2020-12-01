import React, {useEffect, useState} from 'react';
import {Link, useParams, useRouteMatch, Route, Switch, Redirect} from 'react-router-dom';
import PostList from './PostList';
import FileList from './FileList';
import FileForm from './FileForm';
import Attendance from './Attendance';
import Session from './AttendanceSession';
import Grades from './Grades';

function Course(props){
	const {courseId} = useParams();
	const {url, path} = useRouteMatch();
	return (
		<div className="Course">
			<NavBar courseId={courseId}/>
			<Switch>

				<Route exact path={`${path}/`}>
					<Redirect to={`${url}/home`} />
				</Route>

				<Route exact path={`${path}/home`}>
					<h2>Home page</h2>
				</Route>

				<Route exact path={`${path}/posts`}>
					<PostList courseId={courseId}/>
				</Route>

				<Route exact path={`${path}/files`}>
					<FileList courseId={courseId} />
				</Route>

				<Route exact path={`${path}/attendance`} >
					<Attendance courseId={courseId}/>
				</Route>

				<Route path={`${path}/attendance/:sessionId`} >
					<Session courseId={courseId}/>
				</Route>

				<Route path={`${path}/grades`} >
					<Grades courseId={courseId}/>
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

	const [onFocus, setFocus] = useState("home");

	return (
		<div className="NavBar">
			<h1>{courseName}</h1>
			<ul>
				<li>
					<Link 
						to={`${url}/home`} 
						className={onFocus === "home" ? "active" : ""}
						onClick={() => setFocus("home")}
					>Home</Link>
				</li>
				<li>
					<Link 
						to={`${url}/posts`} 
						className={onFocus === "posts" ? "active" : ""}
						onClick={() => setFocus("posts")}
					>Posts</Link>
				</li>
				<li>
					<Link 
						to={`${url}/files`} 
						className={onFocus === "files" ? "active" : ""}
						onClick={() => setFocus("files")}
					>Files</Link>
				</li>
				<li>
					<Link 
						to={`${url}/attendance`} 
						className={onFocus === "attendance" ? "active" : ""}
						onClick={() => setFocus("attendance")}
					>Attendance</Link>
				</li>
				<li>
					<Link 
						to={`${url}/grades`} 
						className={onFocus === "grades" ? "active" : ""}
						onClick={() => setFocus("grades")}
					>Grades</Link>
				</li>
			</ul>
		</div>
	);
}
export default Course;
