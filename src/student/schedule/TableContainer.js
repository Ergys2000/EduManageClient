import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import apiLink from "../../API";

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
				.then(res => res.status === "OK" ? res.result : [])
				.then(schedule_data => organizeSchedule(schedule_data))
				.then(schedule => {
					const days = [];
					for (let i = 0; i < schedule.length; i++) {
						days[i] = <Column key={schedule[i].day} title={schedule[i].name} hours={schedule[i].hours} />
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
	// we have 12 hours in a column
	let hours = [];
	// fill the hours with empty table elements
	for (let i = 0; i < 12; i++)
		hours.push(<TableElement />);

	// modify each table element to represent the correct hour of the day
	// if there is no hour at that index, then it will be left empty
	for (let i = 0; i < props.hours.length; i++) {
		// the hour index is the hour in each row of the returned data.
		const hour_index = props.hours[i].hour - 1;
		hours[hour_index] =
			<TableElement
				key={hour_index}
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

// this simply renders an hour
function TableElement(props) {
	/* use the history hook to redirect the user */
	const history = useHistory();
	return (
		<div className="element" onClick={() => history.push(`courses/${props.id}`)}>
			<h4>{props.name}</h4>
		</div>
	);
}

// this function is used to organize the schedule data into day specific data
function organizeSchedule(schedule_data) {

	let result = []; // the final result
	// the below variables determine where a new hour will be inserted
	let currDayIndex = -1, currHourIndex = 0;

	// lastDayName represents the name of the last day we were adding into
	// we use it to determine when we need to insert hours into another day
	let lastDayName = "";

	for (let i = 0; i < schedule_data.length; i++) {

		let row = schedule_data[i];

		// if the day name has changed
		if (lastDayName !== row.day_name) {
			// modify and increment the variables
			lastDayName = row.day_name;
			currDayIndex++;
			currHourIndex = 0;
			// initialize the day object in the correct index
			result[currDayIndex] = { name: lastDayName, hours: [], day: row.day };
		}

		result[currDayIndex].hours[currHourIndex] = {
			hour: row.hour,
			course_name: row.course_name,
			course_category: row.course_category,
			courseID: row.courseID
		};

		currHourIndex++;
	}
	return result;
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
