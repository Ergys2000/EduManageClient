import React, { useEffect, useState } from 'react';
import Timeline from './Timeline';
import Column from './Column';


function TableContainer(props){
	const [days, setDays] = useState([]);
	useEffect(() => {
		getSchedule();
	}, []);
	
	function getSchedule(){
		fetch(`http://localhost:5000/students/${props.id}/schedule`)
			.then(res => res.json())
			.then(schedule => {
				const days = [
					<Column title="Monday" id={schedule.monday}/>,
					<Column title="Tuesday" id={schedule.tuesday}/>,
					<Column title="Wednesday" id={schedule.wednesday}/>,
					<Column title="Thursday" id={schedule.thursday}/>,
					<Column title="Friday" id={schedule.friday}/>
				];
				setDays(days);
			});
	}
	return (
		<div className="table-container">
			<Timeline />
			{days}
		</div>
	);
}
export default TableContainer;