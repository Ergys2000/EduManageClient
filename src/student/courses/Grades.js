import React, { useEffect, useState, useContext } from "react";
import apiLink from "../../API";
import { StudentContext } from '../Student';
import { CourseContext } from './Course';

function Grades(props) {
	const course = useContext(CourseContext);
	const studentId = useContext(StudentContext);

	const [grades, setGrades] = useState(null);
	useEffect(() => {

		const getGrades = async () => {
			const token = sessionStorage.getItem("jwt");
			const bearer = 'Bearer ' + token;
			await fetch(`${apiLink}/students/${studentId}/courses/${course.id}/grades`, {
				headers: {
					'Authorization': bearer
				}
			})
				.then(res => res.json())
				.then(res => {
					if (res.status === "OK") {
						const organized_grades = organize(res.result);
						const gradeHolders = organized_grades.map(course => <CourseItem course={course} />);
						setGrades(gradeHolders);
					}
				});
		}

		getGrades();

	}, []);

	return (
		<div className="option">
			<h1>Grades</h1>
			<div className="course-container">
				{grades ? grades : "Getting grades"}
			</div>
		</div>
	);
}

function CourseItem({ course }) {
	const name = course.courseName;
	const grades = course.grades.map(grade => <GradeRow key={grade.id} grade={grade} />);
	return (
		<div className="Course-Item">
			<div className="head">
				<h4>{name}</h4>
			</div>
			<div className="body">
				<table className="table">
					<thead>
						<tr>
							<th>Grade</th>
							<th>Weight</th>
							<th>Date</th>
						</tr>
					</thead>
					<tbody>
						{grades}
					</tbody>
				</table>
			</div>
		</div>
	);
}

function GradeRow({ grade }) {
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

		if (lastID !== currGrade.courseID) { // if the id of the course has changed
			currPosition++; // increment the currPosition
			lastID = currGrade.courseID; //set the id to this one
			// add a new course in the result
			result[currPosition] = {
				courseName: currGrade.name,
				grades: []
			};
		}
		result[currPosition].grades.push(currGrade);
	}
	return result;
}

export default Grades;
