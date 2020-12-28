import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import apiLink from "../../API";
import { organizeSchedule } from '../../Utils';

function TableContainer(props) {
	const [days, setDays] = useState([]);
	useEffect(() => {
		const fetchDays = async () => {
			const token = sessionStorage.getItem("jwt");
			const bearer = 'Bearer ' + token;

			fetch(`${apiLink}/teachers/${props.teacherId}/schedule`, {
				headers: {
					'Authorization': bearer
				}
			})
				.then(res => res.json())
				.then(res => res.status === "OK" ? res.result : [])
				.then(scheduleRaw => {
					const days = [];
					const schedule = organizeSchedule(scheduleRaw);
					for (let i = 0; i < schedule.length; i++) {
						days[i] = <Column title={schedule[i].name} hours={schedule[i].hours} />
					}
					setDays(days);
				});
		}

		fetchDays();

	}, []);

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
	for(let i=0; i<12; i++)
		hours.push( <TableElement />)

	// fill the hours if they are busy
	for (let i = 0; i < props.hours.length; i++) {
		const hour_index = props.hours[i].hour - 1;
		hours[hour_index] = 
			<TableElement key={props.hours[i].hour}
				id={props.hours[i].courseID}
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
	return (
		<div className="element" onClick={() => history.push(`courses/${props.id}`)}>
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
	for(let i=0; i<12; i++){
		timestamps.push(<div className="element">{start+i}:00</div>)
	}
	return (
		<div className="timeline-column">
			{timestamps}
		</div>
	);
}

export default TableContainer;
