import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import apiLink from "../../API";
import { organizeSchedule } from '../../Utils';
import { TeacherContext } from '../Teacher';

function TableContainer(props) {
	const teacherId = useContext(TeacherContext);
	const [days, setDays] = useState([]);
	useEffect(() => {
		const fetchDays = async () => {
			const token = sessionStorage.getItem("jwt");
			const bearer = 'Bearer ' + token;

			fetch(`${apiLink}/teachers/${teacherId}/schedule`, {
				headers: {
					'Authorization': bearer
				}
			})
				.then(res => res.json())
				.then(res => {
					if (res.status === "OK") {
						const days = [];
						const schedule = organizeSchedule(res.result);
						for (let i = 0; i < schedule.length; i++) {
							days[i] = <Column key={schedule[i].day} title={schedule[i].name} hours={schedule[i].hours} />
						}
						setDays(days);

					} else {
						alert(res.message);
					}
				}).catch(_ => console.log(_));
		}

		fetchDays();

	}, [teacherId]);

	return (
		<div className="table-container">
			<Timeline />
			{days}
		</div>
	);
}

function Column(props) {
	// will hold the hours for each day
	let hours = [];
	// insert twelve default hours for each day
	for (let i = 0; i < 12; i++)
		hours.push(<TableElement key={i - 18} />)

	// fill the hours if they are busy
	for (let i = 0; i < props.hours.length; i++) {
		const hour_index = props.hours[i].hour - 1;
		hours[hour_index] =
			<TableElement
				key={props.hours[i].id}
				id={props.hours[i].courseInstanceID}
				category={props.hours[i].course_category}
				name={props.hours[i].course_name} />;
	}
	return (
		<div className="column">
			<h2>{props.title}</h2>
			{hours}
		</div>
	);
}

/* 
 * The single square that holds represents 1 hour 
 * Just takes as an argument a name and category
 */
function TableElement(props) {
	/* use the history hook to redirect the user */
	const history = useHistory();

	/* Use use this variable to make the element clickable if it is not empty */
	const clickable = props.id ? "clickable" : "";
	const onClick = () => {
		if (props.id && props.name) {
			history.push(`courses/${props.id}`);
		}
	}
	return (
		<div className={"element " + clickable} onClick={onClick}>
			<h4>{props.name}</h4>
		</div>
	);
}

/* 
 * The timeline element that displays the timestamps for the start and end of
 * an hour
*/
function Timeline(props) {
	const timestamps = [];
	const start = 8;
	for (let i = 0; i < 12; i++) {
		timestamps.push(<div key={i} className="element">{start + i}:00</div>)
	}
	return (
		<div className="timeline-column">
			{timestamps}
		</div>
	);
}

export default TableContainer;
