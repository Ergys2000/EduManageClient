import React, {useEffect, useState} from 'react';
import {useHistory, useParams, useRouteMatch} from 'react-router-dom';

function Attendance(props) {
	const {courseId} = useParams();
	const [sessions, setSessions] = useState([]);
	useEffect(() => {
		fetch(`http://3.138.109.77:5000/courses/${courseId}/attendance`)
			.then(res => res.json())
			.then(res => res.status === "OK" ? res.result : [])
			.then(sessions => {
				setSessions(sessions);
			});
	});
	return (
		<table className="Attendance-Sessions">
			<tr>
				<th>Week</th>
				<th>Topic</th>
				<th>Type</th>
				<th>Date</th>
				<th>Hours</th>
				<th></th>
			</tr>
			{sessions.map(session => SessionRow(session))}
		</table>
	);
}

function SessionRow(session) {
	const history = useHistory();
	function onClick() {
		history.push(`attendance/${session.id}`);
	}
	return (
		<tr>
			<td>{session.week}</td>
			<td>{session.topic}</td>
			<td>{session.type}</td>
			<td>{session.date}</td>
			<td>{session.total}</td>
			<td><button onClick={onClick}>View</button></td>
		</tr>
	)
}

export default Attendance;
