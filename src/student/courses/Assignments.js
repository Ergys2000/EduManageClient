import React, { useEffect, useState, useContext } from 'react';
import { Link, useRouteMatch, useParams, useHistory } from 'react-router-dom';
import apiLink from "../../API";
import { FileListItem } from "./FileList";
import { CourseContext } from "./Course";
import { StudentContext } from "../Student";

/* Displays the list of assignments for this course */
function AssignmentList(props) {
	const studentId = useContext(StudentContext);
	const course = useContext(CourseContext);

	const [assignments, setAssignments] = useState([]);
	useEffect(() => {
		const fetchAssignments = async () => {
			const token = sessionStorage.getItem("jwt");
			const bearer = "Bearer " + token;
			await fetch(`${apiLink}/students/${studentId}/courses/${course.id}/assignments`, {
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
			<p>Due: {props.assignment.due}</p>
		</div>
	);
}

/* The component that displays the information about an assignment */
function Assignment(props) {
	const studentId = useContext(StudentContext);
	const course = useContext(CourseContext);
	const { assignmentId } = useParams();

	const [shouldUpdate, setShouldUpdate] = useState(0);

	/* The files that the student has uploaded so far */
	const [files, setFiles] = useState([]);
	useEffect(() => {
		const fetchFiles = async () => {
			const token = sessionStorage.getItem("jwt");
			const bearer = "Bearer " + token;
			/* Retrieve them from the correct api endpoint */
			await fetch(`${apiLink}/students/${studentId}/courses/${course.id}/assignments/${assignmentId}/studentfiles`, {
				headers: { 'Authorization': bearer }
			})
				.then(res => res.json())
				.then(res => res.status === "OK" ? res.result : [])
				.then(files => {
					setFiles(files);
				});
		}
		fetchFiles();
	}, [shouldUpdate]);

	/* Holds the information about the assignment, like title and description */
	const [assignment, setAssignment] = useState(null);
	useEffect(() => {
		const fetchAssignment = async () => {
			const token = sessionStorage.getItem("jwt");
			const bearer = "Bearer " + token;
			await fetch(`${apiLink}/students/${studentId}/courses/${course.id}/assignments/${assignmentId}`, {
				headers: { 'Authorization': bearer }
			})
				.then(res => res.json())
				.then(res => res.status === "OK" ? res.result : null)
				.then(assignment => {
					setAssignment(assignment);
				});
		}
		fetchAssignment();
	}, [shouldUpdate]);

	/* Holds the list of files included in this assignment, like the test that
	 * you have to solve*/
	const [assignmentFiles, setAssignmentFiles] = useState([]);
	useEffect(() => {
		const fetchFiles = async () => {
			const token = sessionStorage.getItem("jwt");
			const bearer = "Bearer " + token;
			await fetch(`${apiLink}/students/${studentId}/courses/${course.id}/assignments/${assignmentId}/files`, {
				headers: { "Authorization": bearer }
			})
				.then(res => res.json())
				.then(res => res.status === "OK" ? res.result : [])
				.then(files => setAssignmentFiles(files));
		}
		fetchFiles();
	}, [shouldUpdate]);

	const update = () => setShouldUpdate(shouldUpdate+1);

	return (
		<div className="assignment">
			<h2>{assignment ? assignment.title : "title"}</h2>
			<p>{assignment ? assignment.description : "description"}</p>
			<div className="files">
				<div className="file-list">
					<h4>Assignment files</h4>
					<ul>
						{assignmentFiles.map(file => <FileListItem key={file.id} file={file} />)}
					</ul>
				</div>
				<div className="file-list">
					<h4>My files</h4>
					<FileForm 
						classInstanceId={course.classInstanceID}
						studentId={studentId} 
						courseId={course.id} 
						updateCallback={update}
						assignmentId={assignmentId} />
					<ul>
						{files.map(file => <StudentFile key={file.id} file={file} />)}
					</ul>
				</div>
			</div>
		</div>
	);
}

/* Displays a single student file */
function StudentFile({file}) {
	const courseID = file.courseInstanceID;
	const classInstanceID = file.classInstanceID;
	const studentID = file.studentID;
	const filename = file.filename;
	return (
		<li id={file.id}>
			<a href={`${apiLink}/files/${classInstanceID}/${courseID}/${studentID}/${filename}`} target="_blank">{file.filename}</a>
			<i className="material-icons">download</i>
		</li>
	);
}

/* Handles uploading a file to the server */
function FileForm(props) {

	const classInstanceId = props.classInstanceId;
	const studentId = props.studentId;
	const courseId = props.courseId;
	const assignmentId = props.assignmentId;

	const onSubmit = async (event) => {
		event.preventDefault();
		const form = event.target;
		const formData = new FormData(form);
		await fetch(`${apiLink}/files/${classInstanceId}/${courseId}/${studentId}`,{
			method: 'post',
			body: formData
		})
			.then(res => res.json())
			.then(res => {
				alert(res.message);
				props.updateCallback();
			})
			.catch(err => console.log(err));
	}
	return (
		<form
			onSubmit={onSubmit}
			action={`${apiLink}/files/${classInstanceId}/${courseId}/${studentId}`}
			method="post"
			encType="multipart/form-data">

			<input name="assignmentID" value={assignmentId} hidden={true} type="text" readOnly={true} />
			<input name="file" type="file" />
			<input type="submit" />

		</form>
	)
}

export { AssignmentList, AssignmentItem, Assignment };
