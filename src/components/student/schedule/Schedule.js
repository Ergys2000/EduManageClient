import React from 'react';
import './schedule.css';
import Table from './Table';
class Schedule extends React.Component{
	render(){
		return(
			<div className="option"> 
				<h1>Schedule</h1>
				<Table />
			</div>
		);
	}
}

export default Schedule;
