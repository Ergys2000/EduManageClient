import {useState, useEffect} from 'react';
import {useParams, Link, Switch, useRouteMatch, Route} from 'react-router-dom';
import Attendance from './courses/Attendance';
import Session from './courses/AttendanceSession';

function Class(props) {
	const {url, path} = useRouteMatch();
	return (
		<div className="option">
			<Switch>
				<Route exact path={`${path}/`}>
					<CourseList id={props.id} />
				</Route>
				<Route exact path={`${path}/:courseId/attendance`}>
					<Attendance />
				</Route>
				<Route exact path={`${path}/:courseId/attendance/:sessionId`}>
					<Session />
				</Route>
				<Route exact path={`${path}/:courseId/grades`}>
					<StudentList />
				</Route>
			</Switch>
		</div>
	);
}

function CourseList(props) {
	const [courses, setCourses] = useState([]);
	useEffect(() => {
		fetch(`http://localhost:5000/teachers/${props.id}/class`)
			.then(res => res.json())
			.then(res => res.status === "OK" ? res.result : [])
			.then(courses => {
				setCourses(courses);
			});
	}, []);
	return (
		<div className="Course-List">
			{courses.map(x => CourseListItem({course: x}))}
		</div>
	);
}

function CourseListItem(props) {
	let {url} = useRouteMatch();
	return (
		<div className="Course-Info-Item">

			<div className="Course-Header">
				<h2>{props.course.name}</h2>
			</div>

			<div className="Course-Body">
				<Link to={`${url}/${props.course.id}/attendance`}>
					<i className="material-icons">chevron_right</i>
					<p>Attendance</p>
				</Link>
				<Link to={`${url}/${props.course.id}/grades`}>
					<i className="material-icons">chevron_right</i>
					<p>Grades</p>
				</Link>
				<p>Category: {props.course.category}</p>
			</div>

		</div>
	);
}

function StudentList(props) {
	const {courseId} = useParams();
	const [students, setStudents] = useState([]);
	useEffect(async () => {
		getCourseGrades();
	}, []);

	async function getCourseGrades() {
		await fetch(`http://localhost:5000/courses/${courseId}/grades`)
			.then(res => res.json())
			.then(res => res.status === "OK" ? res.result : [])
			.then(result => {
				const students = organizeGrades(result);
				const elements = students.map(student => (
					<Grades name={student.firstname} grades={student.grades} key={student.id} />
				));
				setStudents(elements);
			});
	}
	return (
		<div className="Student-List">
			{students}
		</div>
	);
}

// TODO display the grades of each student
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

function organizeGrades(grades) {
	// the final result
	let result = [];
	// helps us determine if the grades have changed
	let lastStudentId = -1;
	// holds the current position in terms of student count
	let currPosition = -1;

	// for each grade in the list
	for (let i = 0; i < grades.length; i++) {
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
		if (lastStudentId !== currGrade.studentID) {
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


export default Class;
