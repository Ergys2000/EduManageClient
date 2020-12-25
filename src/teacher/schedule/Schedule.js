import React, {useContext} from 'react';
import TableContainer from './TableContainer';
import {TeacherContext} from "../Teacher";


function Schedule(props){
	const teacherId = useContext(TeacherContext);
	return (
		<div className="option">
			<TableContainer teacherId={teacherId} />
		</div>
	);
}

export default Schedule;
