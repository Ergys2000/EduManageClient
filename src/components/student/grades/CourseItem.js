import React from 'react';


function CourseItem(course){
	const name = course.courseName;
	const grades = course.grades.map(grade => GradeRow(grade));
	return (
		<div className="Course-Item">
			<div className="head">
				<h4>{name}</h4>
			</div>
			<div className="body">
				<table className="table">
					<tr>
						<th>Grade</th>
						<th>Weight</th>
						<th>Date</th>
					</tr>
					{grades}
				</table>
			</div>
		</div>
	);
}

function GradeRow(grade){
	function stripDate(date){
		if(date === null){
			return 'No date';
		}
		return date.substring(0, date.indexOf('T'));
	}
	return(
		<tr className="Grade-Row">
			<td>{grade.grade}</td>
			<td>{grade.weight}</td>
			<td>{stripDate(grade.date)}</td>
		</tr>
	);
}

export default CourseItem;
