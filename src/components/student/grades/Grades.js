import React, { useEffect, useState } from "react";
import './grades.css';

function Grades(props){
    const [grades, setGrades] = useState(null);
    useEffect(() => {
        getGrades();
    },[]);
    function getGrades(){
        fetch(`http://localhost:5000/students/${props.id}/grades`)
            .then(res => res.json())
            .then(grades => {
                const organized_grades = organize(grades);
                const gradeHolders = organized_grades.map(course => GradeList(course));
                setGrades(gradeHolders);
            });
    }
    return (
        <div className="option">
            <h1>Grades</h1>
            <div className="course-container">
                {grades? grades: "Getting grades"}
            </div>
        </div>
    );
}

function GradeList(course){
    const name = course.courseName;
    const grades = course.grades.map(grade => GradeItem(grade));
    return (
        <div className="course">
            <h2>{name}</h2>
            <table className="grades-table">
                <tr>
                    <th>Grade</th>
                    <th>Weight</th>
                    <th>Date</th>
                </tr>
                {grades}
            </table>
        </div>
    );
}

function GradeItem(grade){
    function stripDate(date){
        return date.substring(0, date.indexOf('T'));
    }
    return(
        <tr className="grade">
            <td>{grade.grade}</td>
            <td>{grade.weight}</td>
            <td>{stripDate(grade.date)}</td>
        </tr>
    );
}


// this function organizes the list of grades in course specific grades
// the time complexity is O(n)
function organize(grades){
    let result = [];
    let lastID = -1; // holds the last courseID encountered in the list
    let currPosition = -1; // holds the current position in terms of different courses

    for(let i=0; i<grades.length; i++){

        const currGrade = grades[i];

        if(lastID === currGrade.courseID){ // if the id of the course has not changed
            // just insert the current grade in the current course position
            result[currPosition].grades.push(currGrade);

        }else{ // if the course if has now changed
            lastID = currGrade.courseID; //set the id to this one
            currPosition++; // increment the currPosition

            // add a new course in the result
            result[currPosition] = {
                courseName: currGrade.name,
                grades:[currGrade]
            };
        }
    }
    return result;
}

export default Grades;
