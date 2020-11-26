import React, {useEffect, useState} from 'react';
import FileForm from './FileForm';

function FileList(props){
	const [files, setFiles] = useState([]);
	useEffect(() => {
		fetch(`http://localhost:5000/files/${props.courseId}`)
		.then(res => res.json())
		.then(res => {
			if(res.status === "OK")
				setFiles(res.result);
		});
	}, [])

	const [fileForm , setFileForm] = useState(null);
	useEffect(() => {
		fetch(`http://localhost:5000/courses/${props.courseId}`)
			.then(res => res.json())
			.then(res => res.status === "OK" ? res.result : null)
			.then(course => {
				setFileForm(<FileForm courseId={course.courseID} classInstanceId={course.classInstanceID}/> );
			})
	}, []);


	return (
		<div className="File-List">
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
			<a href={`http://localhost:5000/files/${classInstanceID}/${courseID}/${filename}`} target="_blank">{file.filename}</a>
			<i className="material-icons">download</i>
		</li>
	);
}

export default FileList;
