import React, { useEffect, useState } from "react";
import './grades.css';
import CourseItem from './CourseItem';

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
                const gradeHolders = organized_grades.map(course => CourseItem(course));
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
