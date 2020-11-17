import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import PostList from './course_components/PostList';
import FileList from './course_components/FileList';

function Course(props){
	const {id, courseId} = useParams();
	const [course, setCourse] = useState({});
	useEffect(() => {
		fetch(`http://localhost:5000/courses/${courseId}`)
		.then(res => res.json())
		.then(course => setCourse(course))
	}, []);
	return (
		<div className="Course">
			<h1>{course.name}</h1>
			<FileList courseID={courseId} classInstanceID={1} />
			<PostList courseId={courseId}/>
		</div>
	);
}
export default Course;
