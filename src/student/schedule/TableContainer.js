import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import apiLink from "../../API";
import { organizeSchedule } from '../../Utils';

/* The component which displays the whole table */
function TableContainer(props) {
	const studentId = props.studentId;
	const [days, setDays] = useState([]);

	useEffect(() => {
		const fetchDays = async () => {
			const token = sessionStorage.getItem("jwt");
			const bearer = 'Bearer ' + token;
			await fetch(`${apiLink}/students/${studentId}/schedule`, {
				headers: {
					'Authorization': bearer
				}
			})
				.then(res => res.json())
				.then(res => {
					if (res.status === "OK") {
            console.log(res);
						const schedule = organizeSchedule(res.result);
						const days = [];
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
}, [studentId]);

return (
	<div className="table-container">
		<Timeline />
		{days}
	</div>
);
}

function Column(props) {
	// we have 12 hours in a column
	let hours = [];
	// fill the hours with empty table elements
	for (let i = 0; i < 12; i++)
		hours.push(<TableElement key={i - 12} />);

	// modify each table element to represent the correct hour of the day
	// if there is no hour at that index, then it will be left empty
	for (let i = 0; i < props.hours.length; i++) {
		// the hour index is the hour in each row of the returned data.
		const hour_index = props.hours[i].hour - 1;
		hours[hour_index] =
			<TableElement
				key={props.hours[i].id}
				id={props.hours[i].courseInstanceID}
				name={props.hours[i].course_name} />;
	}
	return (
		<div className="column">
			<h2>{props.title}</h2>
			{hours}
		</div>
	);
}

// this simply renders an hour
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
