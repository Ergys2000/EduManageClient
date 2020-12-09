import React, { useEffect, useState } from "react";
import apiLink from "../../API";

function Grades(props) {
	const studentId = props.studentId;
	const courseId = props.courseId;
    const [grades, setGrades] = useState(null);
    useEffect(() => {

		const getGrades = async () => {

			await fetch(`${apiLink}/students/${studentId}/grades/${courseId}`)
				.then(res => res.json())
				.then(res => {
					if (res.status === "OK") {
						const organized_grades = organize(res.result);
						const gradeHolders = organized_grades.map(course => CourseItem(course));
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

function GradeRow(grade) {
    return (
        <tr className="Grade-Row" key={grade.id}>
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
