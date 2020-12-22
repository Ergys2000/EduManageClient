import React, {useContext} from 'react';
import TableContainer from './TableContainer';
import {StudentContext} from '../Student';

function Schedule(props){
	const studentId = useContext(StudentContext);
	return(
		<div className="option"> 
			<TableContainer studentId={studentId}/>
		</div>
	);
}

export default Schedule;
