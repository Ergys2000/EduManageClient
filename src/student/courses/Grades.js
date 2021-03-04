import React, { useEffect, useState, useContext } from "react";
import apiLink from "../../API";
import { StudentContext } from '../Student';
import { CourseContext } from './Course';

function Grades(props) {
	const course = useContext(CourseContext);
	const studentId = useContext(StudentContext);

	const [grades, setGrades] = useState([]);
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
					if(res.status === "OK") {
						setGrades(res.result);
					} else {
						alert(res.message);
					}
				}).catch(_ => console.log(_));
		}

		getGrades();

	}, []);

	return (
		<div className="option">
			<div className="course-container">
				<CourseItem grades={grades} />
			</div>
		</div>
	);
}

function CourseItem({ grades }) {
	return (
		<div className="Course-Item">
			<div className="head">
				<h4>{grades[0] ? grades[0].name : ""}</h4>
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
						{grades.map(grade => <GradeRow key={grade.id} grade={grade} />)}
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

export default Grades;
