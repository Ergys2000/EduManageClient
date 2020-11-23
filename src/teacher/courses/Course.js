import React, {useEffect, useState} from 'react';
import {Link, useParams, useRouteMatch} from 'react-router-dom';
import PostList from './PostList';
import FileList from './FileList';
import FileForm from './FileForm';

function Course(props){
	const {courseId} = useParams();
	const {url} = useRouteMatch();
	const [course, setCourse] = useState((
		<div className="Course">
			<h2>Entering in the course...</h2>
		</div>
	));
	useEffect(() => {
		fetch(`http://localhost:5000/courses/${courseId}`)
		.then(res => res.json())
		.then(course => {
			const new_course = (
				<div className="Course">
					<h1>{course.name}</h1>
					<Link to={`${url}/attendance`} >
						<button>Attendance</button>
					</Link>
					<FileList courseID={course.courseID} classInstanceID={course.classInstanceID} />
					<FileForm courseID={course.courseID} classInstanceID={course.classInstanceID}/>
					<PostList courseID={course.courseID}/>
				</div>
			);
			setCourse(new_course);
		}).catch(err => {
			const new_course = (
				<div>
					<h1>There was a problem with entering the course.</h1>
				</div>
			);
			setCourse(new_course);
		});
	}, []);
	return course;
}

export default Course;
