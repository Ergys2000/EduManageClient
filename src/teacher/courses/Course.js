import React, {useEffect, useState} from 'react';
import {Link, useParams, useRouteMatch, Route, Switch, Redirect} from 'react-router-dom';
import PostList from './PostList';
import FileList from './FileList';
import StudentFiles from './StudentFiles';
import Attendance from './Attendance';
import Session from './AttendanceSession';
import AddSession from './AddSession';
import Grades from './Grades';
import AddGrades from './AddGrades';
import Home from './Home';
import apiLink from "../../API";

function Course(props){
	const teacherId = props.id;
	const {courseId} = useParams();
	const {url, path} = useRouteMatch();
	return (
		<div className="course">

			<NavBar courseId={courseId} teacherId={teacherId} />

			<Switch>

				<Route exact path={`${path}/`}>
					<Redirect to={`${url}/home`} />
				</Route>

				<Route exact path={`${path}/home`}>
					<Home courseId={courseId} teacherId={teacherId} />
				</Route>

				<Route exact path={`${path}/posts`}>
					<PostList courseId={courseId} teacherId={teacherId} />
				</Route>

				<Route exact path={`${path}/studentfiles`}>
					<StudentFiles courseId={courseId} teacherId={teacherId} />
				</Route>

				<Route exact path={`${path}/files`}>
					<FileList courseId={courseId} teacherId={teacherId} />
				</Route>

				<Route exact path={`${path}/attendance`} >
					<Attendance courseId={courseId} teacherId={teacherId} />
				</Route>

				<Route exact path={`${path}/attendance/add`} >
					<AddSession courseId={courseId} teacherId={teacherId} />
				</Route>

				<Route path={`${path}/attendance/:sessionId`} >
					<Session courseId={courseId} teacherId={teacherId} />
				</Route>

				<Route exact path={`${path}/grades`} >
					<Grades courseId={courseId} teacherId={teacherId} />
				</Route>

				<Route exact path={`${path}/grades/add`} >
					<AddGrades courseId={courseId} teacherId={teacherId} />
				</Route>

			</Switch>
		</div>
	);
}

function NavBar(props){
	const {url} = useRouteMatch();
	const courseId = props.courseId;
	const teacherId = props.teacherId;
	const [courseName, setCourseName] = useState("Course name");
	useEffect(() =>{
		const fetchCourseName = async () => {
			await fetch(`${apiLink}/teachers/${teacherId}/courses/${courseId}`)
				.then(res => res.json())
				.then(res => res.status === "OK" ? res.result : null)
				.then(course => setCourseName(course.name));
		}
		fetchCourseName();
	}, []);

	const [onFocus, setFocus] = useState("home");

	return (
		<div className="navbar">
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
						to={`${url}/studentfiles`} 
						className={onFocus === "studentfiles" ? "active" : ""}
						onClick={() => setFocus("studentfiles")}
					>Student Files</Link>
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
