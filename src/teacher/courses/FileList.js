import React, { useEffect, useState, useContext } from 'react';
import apiLink from "../../API";
import { TeacherContext } from "../Teacher";
import { CourseContext } from "./Course";

function FileList(props) {
	const teacherId = useContext(TeacherContext);
	const course = useContext(CourseContext);

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
	}, [])


	return (
		<div className="file-list">
			<FileForm classInstanceId={course.classInstanceID} courseId={course.id} />
			<ul>
				{files.map(file => <FileListItem key={file.id} file={file} />)}
			</ul>
		</div>
	);
}

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

function FileForm({ classInstanceId, courseId }) {
	return (
		<div className="file-form">
			<form
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
