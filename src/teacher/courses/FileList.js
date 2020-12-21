import React, {useEffect, useState} from 'react';
import apiLink from "../../API";

function FileList(props){
	const teacherId = props.teacherId;
	const courseId = props.courseId;

	const [files, setFiles] = useState([]);
	useEffect(() => {
		const fetchFiles = async () => {
			const token = sessionStorage.getItem("jwt");
			const bearer = 'Bearer ' + token;

			fetch(`${apiLink}/teachers/${teacherId}/courses/${courseId}/files`, {
				headers: {
					'Authorization': bearer
				}
			})
			.then(res => res.json())
			.then(res => {
				console.log(res);
				if(res.status === "OK")
					setFiles(res.result);
			});
		}
		fetchFiles();
	}, [])

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
						setFileForm(<FileForm courseId={course.courseID} classInstanceId={course.classInstanceID}/> );
					}
				})
		}
		fetchFileForm();
	}, []);


	return (
		<div className="file-list">
			{fileForm}
			<ul>
				{files.map(file => FileListItem(file))}
			</ul>
		</div>
	);
}

function FileListItem(file){
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

function FileForm({classInstanceId, courseId}){
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
