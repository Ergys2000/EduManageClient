import React from 'react';
import TableContainer from './TableContainer';

function Schedule(props){
	return(
		<div className="option"> 
			<TableContainer studentId={props.studentId}/>
		</div>
	);
}

export default Schedule;
