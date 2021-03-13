import React, { useState, useEffect, useContext } from 'react';
import { Link, useRouteMatch, useParams } from 'react-router-dom';
import apiLink from "../../API";
import { CourseContext } from "./Course";
import { TeacherContext } from "../Teacher";
import { organizeStudents } from '../../Utils';

/* Displays the list of assignments for this course */
function AssignmentList(props) {
	const teacherId = useContext(TeacherContext);
	const course = useContext(CourseContext);

	const [shouldUpdate, setShouldUpdate] = useState(0);

	const [assignments, setAssignments] = useState([]);
	useEffect(() => {
		const fetchAssignments = async () => {
			const token = sessionStorage.getItem("jwt");
			const bearer = "Bearer " + token;
			await fetch(`${apiLink}/teachers/${teacherId}/courses/${course.id}/assignments`, {
				headers: { 'Authorization': bearer }
			})
				.then(res => res.json())
				.then(res => {
					if(res.status === "OK") {
						setAssignments(res.result);
					} else {
						alert(res.message);
					}
				}).catch(_ => console.log(_));
		}
		fetchAssignments();
	}, [teacherId, course.id, shouldUpdate]);

	const update = () => setShouldUpdate(shouldUpdate + 1);

	return (
		<div className="assignment-list">
			<AssignmentForm updateCallback={update} />
			{assignments.map(a => <AssignmentItem key={a.id} assignment={a} />)}
		</div>
	);
}

/* Displays one single assignment in the list */
function AssignmentItem(props) {
	const { url } = useRouteMatch();
	return (
		<div className="assignment">
			<div className="title">
				<i className="material-icons">folder</i>
				<Link to={`${url}/${props.assignment.id}`}>{props.assignment.title}</Link>
			</div>
			<p>Due {props.assignment.due}</p>
		</div>
	);
}

/* Handles creating a new assignment */
function AssignmentForm(props) {
	const teacherId = useContext(TeacherContext);
	const course = useContext(CourseContext);

	const [form, setForm] = useState({
		title: "",
		description: "",
		due: ""
	});

	const [shown, setShown] = useState(false);

	const handleChange = (event) => {
		event.preventDefault();

		const name = event.target.name;
		const value = event.target.value;

		if(name === 'title' && value.length > 100) {
			alert("Title is too long!");
			return;
		}
    console.log(value);

		setForm({ ...form, [name]: value });
	}

	const onSubmit = async (event) => {
		event.preventDefault();
		const token = sessionStorage.getItem("jwt");
		const bearer = "Bearer " + token;
		await fetch(`${apiLink}/teachers/${teacherId}/courses/${course.id}/assignments`, {
			method: 'post',
			headers: {
				'Authorization': bearer,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(form)
		})
			.then(res => res.json())
			.then(res => {
				if(res.status === "OK") {
					alert("Assignment added successfully!");
					/* This function updates the assignment list */
					props.updateCallback();
				} else {
					alert("Could not add assignment!");
				}
			})
			.catch(err => console.log(err));
	}

	const hide = (event) => {
		event.preventDefault();
		setShown(false);
	}

	return (
		<div className="assignment-form">
			<button className={shown ? "hidden" : "shown"} onClick={() => setShown(true)}>ADD ASSIGNMENT</button>
			<form onSubmit={onSubmit} className={shown ? "shown" : "hidden"}>
				<label>
					Title
					<br/>
					<input name="title" value={form.title} onChange={handleChange} type="text" />
				</label>
				<label>
					Description
					<br/>
					<input name="description" value={form.description} onChange={handleChange} type="text" />
				</label>
				<label>
					Due
					<br/>
					<input name="due" value={form.due} onChange={handleChange} type="datetime-local" />
				</label>
				<button>ADD ASSIGNMENT</button>
				<button onClick={hide}>CANCEL</button>
			</form>
		</div>
	);
}

/* The component that displays the information about an assignment */
function Assignment(props) {
	const teacherId = useContext(TeacherContext);
	const course = useContext(CourseContext);
	const { assignmentId } = useParams();

	/* Used to update the assignment page after a file upload */
	const [shouldUpdate, setShouldUpdate] = useState(0);

	/* Used to get infomation about the assignment */
	const [assignment, setAssignment] = useState(null);
	useEffect(() => {
		const fetchAssignment = async () => {
			const token = sessionStorage.getItem("jwt");
			const bearer = "Bearer " + token;
			await fetch(`${apiLink}/teachers/${teacherId}/courses/${course.id}/assignments/${assignmentId}`, {
				headers: { 'Authorization': bearer }
			})
				.then(res => res.json())
				.then(res => {
					if(res.status === "OK") {
						setAssignment(res.result);
					} else {
						alert(res.message);
					}
				}).catch(_ => console.log(_));
		}
		fetchAssignment();
	}, [shouldUpdate, teacherId, course.id]);

	/* used to get the assignment files */
	const [assignmentFiles, setAssignmentFiles] = useState([]);
	useEffect(() => {
		const fetchFiles = async () => {
			const token = sessionStorage.getItem("jwt");
			const bearer = "Bearer " + token;
			await fetch(`${apiLink}/teachers/${teacherId}/courses/${course.id}/assignments/${assignmentId}/files`, {
				headers: { "Authorization": bearer }
			})
				.then(res => res.json())
				.then(res => {
					if(res.status === "OK") {
						setAssignmentFiles(res.result);
					} else {
						alert(res.message);
					}
				}).catch(_ => console.log(_));
		}
		fetchFiles();
	}, [shouldUpdate]);

	/* This function makes the assignment page update */
	const update = () => setShouldUpdate(shouldUpdate + 1);

	return (
		<div className="assignment">
			<h2>{assignment ? assignment.title : "title"}</h2>
			<p>{assignment ? assignment.description : "description"}</p>
			<div className="files">
				<div className="file-list">
					<h4>Assignment files</h4>
					<FileForm
						updateCallback={update}
						courseId={course.courseID}
						assignmentId={assignmentId}
						classInstanceId={course.classInstanceID} />
					<ul>
						{assignmentFiles.map(file => <FileItem file={file} />)}
					</ul>
				</div>
				<div className="student-files">
					<h4>Student files</h4>
					<StudentList courseId={course.id} teacherId={teacherId} assignmentId={assignmentId} />
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
				.then(res => {
					if(res.status === "OK") {
						setStudents(organizeStudents(res.result));
					} else {
						alert(res.message);
					}
				}).catch(_ => console.log(_));
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
function FileForm(props) {
	const assignmentId = props.assignmentId;
	const classInstanceId = props.classInstanceId;
	const courseId = props.courseId;

	const onSubmit = async (event) => {
		event.preventDefault();
		const form = event.target;
		const formData = new FormData(form);
		await fetch(`${apiLink}/files/${classInstanceId}/${courseId}`, {
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
		<div className="file-form">
			<form
				onSubmit={onSubmit}
				method="post"
				action={`${apiLink}/files/${classInstanceId}/${courseId}`}
				encType="multipart/form-data">

				<input name="assignmentID" value={assignmentId} hidden={true} type="text" readOnly={true} />
				<input name="file" type="file" />
				<input type="submit" />
			</form>
		</div>
	);
}

export { AssignmentList, Assignment };
