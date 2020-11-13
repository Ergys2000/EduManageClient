import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';

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
		</div>
	);
}
export default Course;
