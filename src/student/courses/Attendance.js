import React, {useState, useEffect, useContext} from 'react';
import {StudentContext} from '../Student';
import {CourseContext} from './Course';
import apiLink from '../../API';

/* displays a list of attendence sessions */
export default function Attendance(props) {
	const studentId = useContext(StudentContext);
	const course = useContext(CourseContext);

	const [sessions, setSessions] = useState([]);
	useEffect(() => {
		const token = sessionStorage.getItem("jwt");
		const bearer = "Bearer " + token;
		const fetchSessions = async () => {
			await fetch(`${apiLink}/students/${studentId}/courses/${course.id}/attendance`,{
				headers: {'Authorization': bearer}
			})
				.then(res => res.json())
				.then(res => res.status === "OK" ? res.result : [])
				.then(sessions => {
					setSessions(sessions);
				})
		}
		fetchSessions();
	}, []);
	return (
		<div className="sessions">
			<table>
				<thead>
					<tr>
						<th>Week</th>
						<th>Topic</th>
						<th>Type</th>
						<th>Date</th>
						<th>Attended</th>
					</tr>
				</thead>
				<tbody>
					{sessions.map(session => <SessionRow key={session.id} session={session} />)}
				</tbody>
			</table>
		</div>
	);
}

/* Displays a single session table row */
function SessionRow(props) {
	const session = props.session;
	return (
		<tr>
			<td>{session.week}</td>
			<td>{session.topic}</td>
			<td>{session.type}</td>
			<td>{session.date}</td>
			<td>{session.attended} / {session.length}</td>
		</tr>
	)
}
