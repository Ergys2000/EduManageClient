import {Link, useRouteMatch} from 'react-router-dom';
import {useState, useEffect} from 'react';

function StudentList(props){
	const courseId = props.courseId;
	const {url} = useRouteMatch();
	const [students, setStudents] = useState([]);
	useEffect(async () => {
		getCourseGrades();
	}, []);

	async function getCourseGrades(){
		await fetch(`http://localhost:5000/courses/${courseId}/grades`)
			.then(res => res.json())
			.then(res => res.status === "OK" ? res.result : [])
			.then(result => {
				const students = organizeGrades(result);
				const elements = students.map(student => 
					<Grades name={student.firstname} grades={student.grades} key={student.id}/>
				);
				setStudents(elements);
			});
	}
	return (
		<div className="Student-List">
			<Link to={`${url}/add`}>ADD GRADES</Link>
			{students}
		</div>
	);
}

function Grades(props) {
	const [hidden, setHidden] = useState(true);

	return (
		<div className="Grades">
			<div className="head" onClick={() => setHidden(!hidden)}>
				<h4>{props.name}</h4>
			</div>
			<div className="body">
				<table className={hidden ? "hidden" : "shown"}>
					<thead>
						<tr>
							<th>Grade</th>
							<th>Weight</th>
							<th>Date</th>
						</tr>
					</thead>
					<tbody>
						{props.grades.map(grade => GradeRow(grade))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

function GradeRow(grade) {
	return (
		<tr key={grade.id}>
			<td>{grade.grade}</td>
			<td>{grade.weight}</td>
			<td>{grade.date}</td>
		</tr>
	);
}

function organizeGrades(grades){
	// the final result
	let result = [];
	// helps us determine if the grades have changed
	let lastStudentId = -1;
	// holds the current position in terms of student count
	let currPosition = -1;

	// for each grade in the list
	for(let i=0; i<grades.length; i++){
		// extract the current grade
		const currGrade = grades[i];
		// get only the neccessary information
		const grade = {
			id: currGrade.id,
			grade: currGrade.grade,
			weight: currGrade.weight,
			date: currGrade.date
		};
		// if the student id has not changed
		if(lastStudentId !== currGrade.studentID){
			// increment the counter to point to the other student
			currPosition++;
			lastStudentId = currGrade.studentID;
			// create the other student entry
			result[currPosition] = {
				id: currGrade.studentID,
				firstname: currGrade.firstname,
				lastname: currGrade.lastname,
				grades: []
			}
		}
		result[currPosition].grades.push(grade);
	}
	return result;
}

export default StudentList;

