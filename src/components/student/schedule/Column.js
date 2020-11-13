import React, { useEffect, useState } from 'react';
import TableElement from './TableElement';


function Column(props) {
	const [hours, setHours] = useState([]);
	useEffect(() => {
		getDay();
	});
	function getDay(){
		fetch(`http://localhost:5000/day/${props.id}`)
			.then(res => res.json())
			.then(day => {
				const hours = [
					<TableElement id={day.one}/>,
					<TableElement id={day.two}/>,
					<TableElement id={day.three}/>,
					<TableElement id={day.four}/>,
					<TableElement id={day.five}/>,
					<TableElement id={day.six}/>,
					<TableElement id={day.seven}/>,
					<TableElement id={day.eight}/>,
					<TableElement id={day.nine}/>,
					<TableElement id={day.ten}/>,
					<TableElement id={day.eleven}/>,
					<TableElement id={day.twelve}/>,
				];
				setHours(hours);
			});
	}
	return (
		<div className="column">
			<h2>{props.title}</h2>
			{hours}
		</div>
	);
}
export default Column;