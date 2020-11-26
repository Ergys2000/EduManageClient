import React, {useEffect, useState} from 'react';
import FileForm from './FileForm';

function FileList(props){
	const [files, setFiles] = useState([]);
	useEffect(() => {
		fetch(`http://3.138.109.77:5000/files/${props.courseId}`)
		.then(res => res.json())
		.then(res => {
			if(res.status === "OK")
				setFiles(res.result);
		});
	}, [])


	return (
		<div className="File-List">
			<FileForm courseId={props.courseId}/>
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
			<a href={`http://3.138.109.77:5000/files/${classInstanceID}/${courseID}/${filename}`} target="_blank">{file.filename}</a>
			<i className="material-icons">download</i>
		</li>
	);
}

export default FileList;
