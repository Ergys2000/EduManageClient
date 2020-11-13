import React from 'react';
import {Link, useParams, useRouteMatch} from 'react-router-dom';

function CourseListItem(props){
	let {url} = useRouteMatch();
	return (
		<div className="Course-Item">

			<div className="Course-Header">
				<Link to={`${url}/${props.course.id}`}>{props.course.name}</Link>
			</div>

			<div className="Course-Body">
				<p>Category: {props.course.category}</p>
			</div>

		</div>
	);
}
export default CourseListItem;
