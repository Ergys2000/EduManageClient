import React, { useEffect, useState } from 'react';


function TableElement(props){
	const [course, setCourse] = useState({category: null, name: null});
	useEffect(() => {
		getCourse();
	}, []);
	function getCourse(){
		fetch(`http://localhost:5000/courses/${props.id}`)
			.then(res => res.json())
			.then(course => {
				setCourse(course);
			});
	}
	return (
		<div className="element">
			<h4>{course.category}</h4>
			<p>{course.name}</p>
		</div>
	);
}
export default TableElement;