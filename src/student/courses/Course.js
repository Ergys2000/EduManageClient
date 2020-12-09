import React, {useEffect, useState} from 'react';
import {useParams, useRouteMatch, Switch, Route, Link, Redirect} from 'react-router-dom';
import PostList from './PostList';
import {FileList, StudentFileList} from './FileList';
import Grades from '../grades/Grades';

function Course(props) {
	const studentId = props.id;
	const {courseId} = useParams();
	const {path, url} = useRouteMatch();
	return (
		<div className="course">
			<NavBar courseId={courseId} />
			<Switch>

				<Route exact path={`${path}/`}>
					<Redirect to={`${url}/home`} />
				</Route>

				<Route exact path={`${path}/posts`}>
					<PostList courseId={courseId} />
				</Route>

				<Route exact path={`${path}/files`}>
					<FileList courseId={courseId} />
				</Route>

				<Route exact path={`${path}/myfiles`}>
					<StudentFileList studentId={studentId} courseId={courseId} />
				</Route>

				<Route exact path={`${path}/grades`}>
					<Grades studentId={studentId} courseId={courseId} />
				</Route>

			</Switch>
		</div>
	);
}

function NavBar(props) {
	const {url} = useRouteMatch();
	const courseId = props.courseId;

	const [courseName, setCourseName] = useState("Course name");
	useEffect(() => {
		const fetchCourseName = async () => {
			await fetch(`http://localhost:5000/courses/${courseId}`)
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
						to={`${url}/myfiles`}
						className={onFocus === "myfiles" ? "active" : ""}
						onClick={() => setFocus("myfiles")}
					>My Files</Link>
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
