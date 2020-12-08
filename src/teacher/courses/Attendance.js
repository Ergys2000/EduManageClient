import React, {useEffect, useState} from 'react';
import {useHistory, useParams, useRouteMatch, Link} from 'react-router-dom';

function Attendance(props) {
	const {courseId} = useParams();
	const {url} = useRouteMatch();

	const [sessions, setSessions] = useState([]);
	useEffect(() => {
		const fetchSessions = async () => {
			fetch(`http://localhost:5000/courses/${courseId}/attendance`)
				.then(res => res.json())
				.then(res => res.status === "OK" ? res.result : [])
				.then(sessions => {
					setSessions(sessions);
				});
		}
		fetchSessions();
	});

	return (
		<div className="sessions">
			<Link to={`${url}/add`}>ADD SESSION</Link>
			<table>
				<thead>
					<tr>
						<th>Week</th>
						<th>Topic</th>
						<th>Type</th>
						<th>Date</th>
						<th>Hours</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{sessions.map(session => <SessionRow key={session.id} session={session} />)}
				</tbody>
			</table>
		</div>
	);
}

function SessionRow(props) {
	const history = useHistory();
	const session = props.session;
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
			<td><button onClick={onClick}>VIEW</button></td>
		</tr>
	)
}


export default Attendance;
