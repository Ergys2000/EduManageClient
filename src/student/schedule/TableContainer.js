import React, { useEffect, useState } from 'react';

function TableContainer(props){
	const [days, setDays] = useState([]);
	useEffect(() => {
		fetch(`http://localhost:5000/students/${props.id}/schedule`)
			.then(res => res.json())
			.then(schedule_data => organizeSchedule(schedule_data.result))
			.then(schedule => {
				const days = [];
				for(let i=0; i<schedule.length; i++){
					days[i] = <Column title={schedule[i].name} hours={schedule[i].hours}/>
				}
				setDays(days);
			});
	}, []);
	
	return (
		<div className="table-container">
			<Timeline />
			{days}
		</div>
	);
}
function Column(props) {
	let hours = [
		<TableElement />,
		<TableElement />,
		<TableElement />,
		<TableElement />,
		<TableElement />,
		<TableElement />,
		<TableElement />,
		<TableElement />,
		<TableElement />,
		<TableElement />,
		<TableElement />,
		<TableElement />
	];
	console.log(props.hours);
	for(let i=0; i<props.hours.length; i++){
		const hour_index = props.hours[i].hour - 1;
		hours[hour_index] = <TableElement category={props.hours[i].course_category} name={props.hours[i].course_name}/>;
	}
	return (
		<div className="column">
			<h2>{props.title}</h2>
			{hours}
		</div>
	);
}
function TableElement(props){
	return (
		<div className="element">
			<h4>{props.category }</h4>
			<p>{props.name? props.name : ""}</p>
		</div>
	);
}

function organizeSchedule(schedule_data){
	let result = [];
	let currDayIndex = -1, currHourIndex = 0;
	let lastDayName = "";
	for(let i=0; i<schedule_data.length; i++){
		let row = schedule_data[i];
		if(lastDayName !== row.day_name){
			lastDayName = row.day_name;
			currDayIndex++;
			currHourIndex = 0;
			result[currDayIndex] = {name: lastDayName, hours: []};
		}
		result[currDayIndex].hours[currHourIndex] = {
			hour: row.hour,
			course_name: row.course_name,
			course_category: row.course_category,
			courseID: row.courseID};
		currHourIndex++;
	}
	return result;
}

function Timeline(props){
	return (
		<div className="timeline-column">
			<div className="element">
				8:00
			</div>
			<div className="element">
				9:00
			</div>
			<div className="element">
				10:00
			</div>
			<div className="element">
				11:00
			</div>
			<div className="element">
				12:00
			</div>
			<div className="element">
				13:00
			</div>
			<div className="element">
				14:00
			</div>
			<div className="element">
				15:00
			</div>
			<div className="element">
				16:00
			</div>
			<div className="element">
				17:00
			</div>
			<div className="element">
				18:00
			</div>
			<div className="element">
				19:00
			</div>
			<div className="element">
				20:00
			</div>
		</div>
	);
}

export default TableContainer;
