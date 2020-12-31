import React, { useEffect, useState, useContext } from 'react';
import apiLink from "../../API";
import { TeacherContext } from "../Teacher";
import { CourseContext } from "./Course";

/* Displays a list of general course files */
function FileList(props) {
	const teacherId = useContext(TeacherContext);
	const course = useContext(CourseContext);

	const [shouldUpdate, setShouldUpdate] = useState(0);

	const [files, setFiles] = useState([]);
	useEffect(() => {
		const fetchFiles = async () => {
			const token = sessionStorage.getItem("jwt");
			const bearer = 'Bearer ' + token;

			fetch(`${apiLink}/teachers/${teacherId}/courses/${course.id}/files`, {
				headers: {
					'Authorization': bearer
				}
			})
				.then(res => res.json())
				.then(res => {
					if (res.status === "OK")
						setFiles(res.result);
				});
		}
		fetchFiles();
	}, [teacherId, course.id, shouldUpdate])

	const update = () => setShouldUpdate(shouldUpdate + 1);

	return (
		<div className="file-list">
			<FileForm 
				updateCallback={update}
				classInstanceId={course.classInstanceID} 
				courseId={course.id} />
			<ul>
				{files.map(file => <FileListItem key={file.id} file={file} />)}
			</ul>
		</div>
	);
}

/* Renders a single file */
function FileListItem({ file }) {
	const courseID = file.courseInstanceID;
	const classInstanceID = file.classInstanceID;
	const filename = file.filename;

	return (
		<li id={file.id}>
			<a href={`${apiLink}/files/${classInstanceID}/${courseID}/${filename}`} target="_blank">{file.filename}</a>
			<i className="material-icons">download</i>
		</li>
	);
}

/* Handles uploading a file to the api */
function FileForm(props) {

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

				<input type="file" name="file" />
				<input type="submit" value="Upload" />
			</form>
		</div>
	);
}

export default FileList;
