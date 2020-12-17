import React from 'react';
import TableContainer from './TableContainer';


function Schedule(props){
	return (
		<div className="option">
			<TableContainer teacherId={props.teacherId} />
		</div>
	);
}

export default Schedule;
