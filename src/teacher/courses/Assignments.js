import React, { useState, useEffect } from 'react';
import { Link, useRouteMatch, useParams } from 'react-router-dom';
import apiLink from "../../API";

/* Displays the list of assignments for this course */
function AssignmentList(props) {
	const teacherId = props.teacherId;
	const courseId = props.courseId;
	const [assignments, setAssignments] = useState([]);

	useEffect(() => {
		const fetchAssignments = async () => {
			const token = sessionStorage.getItem("jwt");
			const bearer = "Bearer " + token;
			await fetch(`${apiLink}/teachers/${teacherId}/courses/${courseId}/assignments`, {
				headers: { 'Authorization': bearer }
			})
				.then(res => res.json())
				.then(res => res.status === "OK" ? res.result : [])
				.then(assignments => {
					setAssignments(assignments);
				})
		}
		fetchAssignments();
	}, []);

	return (
		<div className="assignments">
			{assignments.map(a => <AssignmentItem key={a.id} assignment={a} />)}
		</div>
	);
}

/* Displays one single assignment in the list */
function AssignmentItem(props) {
	const { url } = useRouteMatch();
	return (
		<div className="assignment">
			<Link to={`${url}/${props.assignment.id}`}>{props.assignment.title}</Link>
		</div>
	);
}

/* The component that displays the information about an assignment */
function Assignment(props) {
	const teacherId = props.teacherId;
	const courseId = props.courseId;
	const { assignmentId } = useParams();

	const [assignment, setAssignment] = useState(null);
	useEffect(() => {
		const fetchAssignment = async () => {
			const token = sessionStorage.getItem("jwt");
			const bearer = "Bearer " + token;
			await fetch(`${apiLink}/teachers/${teacherId}/courses/${courseId}/assignments/${assignmentId}`, {
				headers: { 'Authorization': bearer }
			})
				.then(res => res.json())
				.then(res => res.status === "OK" ? res.result : null)
				.then(assignment => {
					setAssignment(assignment);
				});
		}
		fetchAssignment();
	}, []);

	const [assignmentFiles, setAssignmentFiles] = useState([]);
	useEffect(() => {
		const fetchFiles = async () => {
			const token = sessionStorage.getItem("jwt");
			const bearer = "Bearer " + token;
			await fetch(`${apiLink}/teachers/${teacherId}/courses/${courseId}/assignments/${assignmentId}/files`,{
				headers: {"Authorization": bearer}
			})
				.then(res => res.json())
				.then(res => res.status === "OK" ? res.result : [])
				.then(files => {
					setAssignmentFiles(files);
				});
		}
		fetchFiles();
	}, []);

	// TODO: get the id of the class to set up the file upload
	const [fileForm , setFileForm] = useState(null);
	useEffect(() => {
		const fetchFileForm = async () => {
			const token = sessionStorage.getItem("jwt");
			const bearer = 'Bearer ' + token;

			await fetch(`${apiLink}/teachers/${teacherId}/courses/${props.courseId}`, {
				headers: {
					'Authorization': bearer
				}
			})
				.then(res => res.json())
				.then(res => res.status === "OK" ? res.result : null)
				.then(course => {
					if(course){
						setFileForm(<FileForm courseId={course.courseID} assignmentId={assignmentId} classInstanceId={course.classInstanceID}/> );
					}
				})
		}
		fetchFileForm();
	}, []);



	return (
		<div className="assignment">
			<h2>{assignment ? assignment.title : "title"}</h2>
			<p>{assignment ? assignment.description : "description"}</p>
			<div className="files">
				<div className="file-list">
					<h4>Assignment files</h4>
					{fileForm}
					<ul>
						{assignmentFiles.map(file => <FileItem file={file} />)}
					</ul>
				</div>
				<div className="student-files">
					<h4>Student files</h4>
					<StudentList courseId={courseId} teacherId={teacherId} assignmentId={assignmentId} />
				</div>
			</div>
		</div>
	);
}

/* Displays the list of students that have uploaded a file */
function StudentList(props) {
	const courseId = props.courseId;
	const teacherId = props.teacherId;
	const assignmentId = props.assignmentId;

	const [students, setStudents] = useState([]);
	useEffect(() => {
		const fetchStudents = async () => {
			const token = sessionStorage.getItem("jwt");
			const bearer = "Bearer " + token;
			await fetch(`${apiLink}/teachers/${teacherId}/courses/${courseId}/assignments/${assignmentId}/studentfiles`, {
				headers: {
					'Authorization': bearer
				}
			})
				.then(res => res.json())
				.then(res => res.status === "OK" ? res.result : [])
				.then(fileList => {
					setStudents(organizeStudents(fileList));
				});
		}
		fetchStudents();
	}, []);

	return (
		<div className="student-files">
			{students.map(student => <Student key={student.id} student={student} />)}
		</div>
	);
}

/* Displays a single student and his files */
function Student({ student }) {
	const firstname = student.firstname;
	const lastname = student.lastname;
	const files = student.files;
	return (
		<div className="student">
			<div className="head">
				<h2>{firstname + " " + lastname}</h2>
			</div>
			<div className="body">
				<div className="file-list">
					<ul>
						{files.map(file => <FileItem key={file.id} file={file} />)}
					</ul>
				</div>
			</div>
		</div>
	);
}

/* Displays a single file in the list */
function FileItem({ file }) {
	const filename = file.filename;
	const studentId = file.studentID;
	const classInstanceId = file.classInstanceID;
	/* We use courseInstanceID instead of courseId because that is the
	 * table field in the database
	 */
	const courseId = file.courseInstanceID;
	return (
		<li id={file.id}>
			<a href={`${apiLink}/files/${classInstanceId}/${courseId}/${studentId}/${filename}`} target="_blank">{file.filename}</a>
			<i className="material-icons">download</i>
		</li>
	);
}

/* Handles uploading a file */
function FileForm(props){
	const assignmentId = props.assignmentId;
	const classInstanceId = props.classInstanceId;
	const courseId = props.courseId;
	return (
		<div className="file-form">
			<form
				method="post"
				action={`${apiLink}/files/${classInstanceId}/${courseId}`}
				encType="multipart/form-data">

				<input name="assignmentID" value={assignmentId} hidden="true" type="text" readOnly="true" />
				<input name="file" type="file" />
				<input type="submit" />
			</form>
		</div>
	);
}

/* organizes the list of files received from the api 
 * into a list of student objects, each containing a list of files
 * */
const organizeStudents = (studentFiles) => {
	const result = [];/* The final result */
	/* Keeps track of the current student id */
	let lastStudentId = -1;
	/* Keeps track of the current student index */
	let currStudent = -1;
	for (let i = 0; i < studentFiles.length; i++) {
		const studentFile = studentFiles[i];

		/* If the file belongs to a new student this means that
		 * we now have to create a new student object*/
		if (studentFile.studentID != lastStudentId) {
			lastStudentId = studentFile.studentID;
			currStudent++;
			result[currStudent] = {
				id: studentFile.studentID,
				firstname: studentFile.firstname,
				lastname: studentFile.lastname,
				files: []
			}
		}

		result[currStudent].files.push(studentFile);
	}
	return result;
}

export {AssignmentList, Assignment};
