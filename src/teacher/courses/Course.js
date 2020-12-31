import React, { useEffect, useState, useContext } from 'react';
import { Link, useParams, useRouteMatch, Route, Switch, Redirect } from 'react-router-dom';
import PostList from './PostList';
import FileList from './FileList';
import { AssignmentList, Assignment } from './Assignments';
import Attendance from './Attendance';
import Session from './AttendanceSession';
import AddSession from './AddSession';
import Grades from './Grades';
import AddGrades, { AddSingleGrade } from './AddGrades';
import apiLink from "../../API";
import { TeacherContext } from "../Teacher";

export const CourseContext = React.createContext({});

function Course(props) {
	const teacherId = useContext(TeacherContext);
	const { courseId } = useParams();
	const { url, path } = useRouteMatch();

	const [course, setCourse] = useState({});
	useEffect(() => {
		const token = sessionStorage.getItem("jwt");
		const bearer = "Bearer " + token;
		const fetchCourse = async () => {
			await fetch(`${apiLink}/teachers/${teacherId}/courses/${courseId}`, {
				headers: { 'Authorization': bearer }
			})
				.then(res => res.json())
				.then(res => res.status === "OK" ? res.result : {})
				.then(course => {
					setCourse(course)
				});
		}
		fetchCourse();
	}, []);

	return (
		<CourseContext.Provider value={course}>
			<div className="course">

				<NavBar courseId={courseId} teacherId={teacherId} />
				<Switch>

					<Route exact path={`${path}/`}>
						<Redirect to={`${url}/posts`} />
					</Route>

					<Route exact path={`${path}/posts`}>
						<PostList />
					</Route>

					<Route exact path={`${path}/assignments`}>
						<AssignmentList />
					</Route>

					<Route exact path={`${path}/assignments`}>
						<AssignmentList />
					</Route>

					<Route exact path={`${path}/assignments/:assignmentId`}>
						<Assignment />
					</Route>

					<Route exact path={`${path}/files`}>
						<FileList />
					</Route>

					<Route exact path={`${path}/attendance`} >
						<Attendance />
					</Route>

					<Route exact path={`${path}/attendance/add`} >
						<AddSession />
					</Route>

					<Route path={`${path}/attendance/:sessionId`} >
						<Session />
					</Route>

					<Route exact path={`${path}/grades`} >
						<Grades />
					</Route>

					<Route exact path={`${path}/grades/add`} >
						<AddGrades />
					</Route>

					<Route exact path={`${path}/grades/addsingle`} >
						<AddSingleGrade />
					</Route>

				</Switch>
			</div>
		</CourseContext.Provider>
	);
}

function NavBar(props) {
	const course = useContext(CourseContext);

	const { url } = useRouteMatch();

	const [onFocus, setFocus] = useState("posts");

	return (
		<div className="navbar">
			<h1>{course.name}</h1>
			<ul>
				<li>
					<Link
						to={`${url}/posts`}
						className={onFocus === "posts" ? "active" : ""}
						onClick={() => setFocus("posts")}
					>Posts</Link>
				</li>
				<li>
					<Link
						to={`${url}/assignments`}
						className={onFocus === "assignments" ? "active" : ""}
						onClick={() => setFocus("assignments")}
					>Assignments</Link>
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
