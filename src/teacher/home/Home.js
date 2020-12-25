import React, { useEffect, useState, useContext } from "react";
import apiLink from "../../API";
import { TeacherContext } from "../Teacher";

/* This component displays the whole home page */
function Home(props) {
	const teacherId = useContext(TeacherContext);
	/* This state is used to information about the teacher */
	const [teacher, setTeacher] = useState(null);

	useEffect(() => {
		const token = sessionStorage.getItem("jwt");
		const bearer = "Bearer " + token;
		fetch(`${apiLink}/teachers/${teacherId}`, {
			headers: {
				'Authorization': bearer
			}
		})
			.then(res => res.json())
			.then(res => res.status === "OK" ? res.result : null)
			.then(teacher => {
				setTeacher(teacher);
			});
	}, []);

	return (

		<div className="option">
			<h1>Welcome {(teacher) ? teacher.firstname : "..."}</h1>
			<div className="dashboard">
				<Events />
				<div className="personal">
					<ProfileInfo teacher={teacher} />
				</div>
			</div>
		</div>

	);
}

/* this component is responsible for displaying the school events */
function Events(props) {
	const teacherId = useContext(TeacherContext);

	/* Fetch the events from the api */
	const [events, setEvents] = useState([]);
	useEffect(() => {
		const fetchEvents = async () => {
			const token = sessionStorage.getItem("jwt");
			const bearer = "Bearer " + token;
			await fetch(`${apiLink}/teachers/${teacherId}/events`, {
				headers: {
					'Authorization': bearer
				}
			})
				.then(res => res.json())
				.then(res => res.status === "OK" ? res.result : [])
				.then(events => {
					setEvents(events);
				})
		}

		fetchEvents();
	}, []);

	return (
		<div className="events">
			<div className="head">
				<h3>Upcoming Events</h3>
			</div>
			{events.map(event => <Event key={event.id} event={event} />)}
		</div>
	);
}

/* displays a single event */
function Event(props) {
	const e = props.event;
	return (
		<div className="event">
			<h4>{e.title}</h4>
			<p><b>Due: </b>{e.due}</p>
			<p><b>Category: </b> {e.classInstanceID ? "School" : "Class"}</p>
			<p>{e.description}</p>
		</div>
	);
}

/* Displays profile information about the teacher */
function ProfileInfo(props) {
	const teacher = props.teacher ? props.teacher : {};
	return (
		<div className="profile">
			<div className="head">
				<h3>Profile information</h3>
				<button>Update</button>
			</div>
			<div className="labels">
				<p>Name: </p>
				<p>Surname: </p>
				<p>Email: </p>
				<p>Address: </p>
				<p>Number: </p>
				<p>Age: </p>
				<p>Gender: </p>
				<p>Nationality: </p>
			</div>
			<div className="values">
				<p>{teacher.firstname}</p>
				<p>{teacher.lastname}</p>
				<p>{teacher.email}</p>
				<p>{teacher.address}</p>
				<p>{teacher.number}</p>
				<p>{teacher.age}</p>
				<p>{teacher.gender}</p>
				<p>{teacher.nationality}</p>
			</div>
		</div>
	);
}

export default Home;
