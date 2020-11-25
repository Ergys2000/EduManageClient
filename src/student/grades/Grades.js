import React, {useEffect, useState} from "react";

function Grades(props) {
	const [grades, setGrades] = useState(null);
	useEffect(() => {
		getGrades();
	}, []);
	function getGrades() {
		fetch(`http://localhost:5000/students/${props.id}/grades`)
			.then(res => res.json())
			.then(res => {
				if (res.status === "OK") {
					const organized_grades = organize(res.result);
					const gradeHolders = organized_grades.map(course => CourseItem(course));
					setGrades(gradeHolders);
				}
			});
	}
	return (
		<div className="option">
			<h1>Grades</h1>
			<div className="course-container">
				{grades ? grades : "Getting grades"}
			</div>
		</div>
	);
}

function CourseItem(course) {
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

function GradeRow(grade) {
	return (
		<tr className="Grade-Row">
			<td>{grade.grade}</td>
			<td>{grade.weight}</td>
			<td>{grade.date}</td>
		</tr>
	);
}

// this function organizes the list of grades in course specific grades
// the time complexity is O(n)
function organize(grades) {
	let result = [];
	let lastID = -1; // holds the last courseID encountered in the list
	let currPosition = -1; // holds the current position in terms of different courses

	for (let i = 0; i < grades.length; i++) {

		const currGrade = grades[i];

		if (lastID === currGrade.courseID) { // if the id of the course has not changed
			// just insert the current grade in the current course position
			result[currPosition].grades.push(currGrade);

		} else { // if the course if has now changed
			lastID = currGrade.courseID; //set the id to this one
			currPosition++; // increment the currPosition

			// add a new course in the result
			result[currPosition] = {
				courseName: currGrade.name,
				grades: [currGrade]
			};
		}
	}
	return result;
}

export default Grades;
