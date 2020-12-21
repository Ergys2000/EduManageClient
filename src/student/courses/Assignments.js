import React, { useEffect, useState } from 'react';
import { Link, useRouteMatch, useParams } from 'react-router-dom';
import apiLink from "../../API";
import { FileListItem } from "./FileList";

/* Displays the list of assignments for this course */
function AssignmentList(props) {
	const studentId = props.studentId;
	const courseId = props.courseId;
	const [assignments, setAssignments] = useState([]);

	useEffect(() => {
		const fetchAssignments = async () => {
			const token = sessionStorage.getItem("jwt");
			const bearer = "Bearer " + token;
			await fetch(`${apiLink}/students/${studentId}/courses/${courseId}/assignments`, {
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
	const studentId = props.studentId;
	const courseId = props.courseId;
	const { assignmentId } = useParams();

	/* TODO: Use context api to not have to get the information of the student for
	 * this */
	const [fileForm, setFileForm] = useState(null);
	useEffect(() => {
		const fetchStudent = async () => {
			const token = sessionStorage.getItem("jwt");
			const bearer = "Bearer " + token;
			await fetch(`${apiLink}/students/${studentId}`, {
				headers: { 'Authorization': bearer }
			})
				.then(res => res.json())
				.then(res => res.status === "OK" ? res.result : null)
				.then(student => {
					if (student) {
						setFileForm(
							<FileForm classInstanceId={student.classInstanceID}
								studentId={studentId} courseId={courseId} assignmentId={assignmentId} />
						);
					}
				});
		}
		fetchStudent();
	}, []);

	/* The files that the student has uploaded so far */
	const [files, setFiles] = useState([]);
	useEffect(() => {
		const fetchFiles = async () => {
			const token = sessionStorage.getItem("jwt");
			const bearer = "Bearer " + token;
			/* Retrieve them from the correct api endpoint */
			await fetch(`${apiLink}/students/${studentId}/courses/${courseId}/assignments/${assignmentId}/studentfiles`, {
				headers: { 'Authorization': bearer }
			})
				.then(res => res.json())
				.then(res => res.status === "OK" ? res.result : [])
				.then(files => {
					setFiles(files);
				});
		}
		fetchFiles();
	}, []);

	/* Holds the information about the assignment, like title and description */
	const [assignment, setAssignment] = useState(null);
	useEffect(() => {
		const fetchAssignment = async () => {
			const token = sessionStorage.getItem("jwt");
			const bearer = "Bearer " + token;
			await fetch(`${apiLink}/students/${studentId}/courses/${courseId}/assignments/${assignmentId}`, {
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

	/* Holds the list of files included in this assignment, like the test that
	 * you have to solve*/
	const [assignmentFiles, setAssignmentFiles] = useState([]);
	useEffect(() => {
		const fetchFiles = async () => {
			const token = sessionStorage.getItem("jwt");
			const bearer = "Bearer " + token;
			await fetch(`${apiLink}/students/${studentId}/courses/${courseId}/assignments/${assignmentId}/files`, {
				headers: { "Authorization": bearer }
			})
				.then(res => res.json())
				.then(res => res.status === "OK" ? res.result : [])
				.then(files => setAssignmentFiles(files));
		}
		fetchFiles();
	}, []);


	return (
		<div className="assignment">
			<h2>{assignment ? assignment.title : "title"}</h2>
			<p>{assignment ? assignment.description : "description"}</p>
			<div className="files">
				<div className="file-list">
					<h4>Assignment files</h4>
					<ul>
						{assignmentFiles.map(file => FileListItem(file))}
					</ul>
				</div>
				<div className="file-list">
					<h4>My files</h4>
					{fileForm}
					<ul>
						{files.map(file => StudentFile(file))}
					</ul>
				</div>
			</div>
		</div>
	);
}

/* Displays a single student file */
function StudentFile(file) {
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
	return (
		<form
			action={`${apiLink}/files/${classInstanceId}/${courseId}/${studentId}`}
			method="post"
			encType="multipart/form-data">

			<input name="assignmentID" value={assignmentId} hidden="true" type="text" readOnly="true" />
			<input name="file" type="file" />
			<input type="submit" />

		</form>
	)
}

export { AssignmentList, AssignmentItem, Assignment };
