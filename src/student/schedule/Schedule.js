import React from 'react';
import TableContainer from './TableContainer';

function Schedule(props){
	return(
		<div className="option"> 
			<TableContainer id={props.id}/>
		</div>
	);
}

export default Schedule;
