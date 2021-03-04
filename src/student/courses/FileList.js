import React, { useEffect, useState, useContext } from 'react';
import apiLink from "../../API";
import { StudentContext } from "../Student";
import { CourseContext } from "./Course";

function FileList(props) {
	const course = useContext(CourseContext);
	const studentId = useContext(StudentContext);

	const [files, setFiles] = useState([]);
	useEffect(() => {
		const fetchFiles = async () => {
			const token = sessionStorage.getItem("jwt");
			const bearer = 'Bearer ' + token;
			await fetch(`${apiLink}/students/${studentId}/courses/${course.id}/files`, {
				headers: {
					'Authorization': bearer
				}
			})
				.then(res => res.json())
				.then(res => {
					if(res.status === "OK") {
						setFiles(res.result);
					} else {
						alert(res.message);
					}
				}).catch(_ => console.log(_));
		}
		fetchFiles();
	}, [])


	return (
		<div className="file-list">
			<h2>General course files</h2>
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

export { FileList, FileListItem };
