import React, {useEffect, useState} from 'react';

function FileList(props){
	const courseId = props.courseId;
	const [classInstanceID, setClassInstanceID] = useState(null);
	useEffect(() => {
		fetch(`http://localhost:5000/courses/${courseId}`)
		.then(res => res.json())
		.then(res => res.status === "OK" ? res.result : null)
		.then(course => setClassInstanceID(course.classInstanceID));
	}, []);

	const [files, setFiles] = useState([]);
	useEffect(() => {
		fetch(`http://localhost:5000/files/${courseId}`)
		.then(res => res.json())
		.then(res => {
			if(res.status === "OK")
				setFiles(res.result);
		});
	}, [])


	return (
		<div className="File-List">
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
			<a href={`http://localhost:5000/files/${classInstanceID}/${courseID}/${filename}`} target="_blank">{file.filename}</a>
			<i className="material-icons">download</i>
		</li>
	);
}

export default FileList;
