import React, {useEffect, useState} from 'react';

function FileList(props){
	const courseID = props.courseID;
	const classInstanceID = props.classInstanceID;

	const [files, setFiles] = useState([]);
	useEffect(() => {
		fetch(`http://localhost:5000/files/${classInstanceID}/${courseID}`)
		.then(res => res.json())
		.then(files => setFiles(files));
	}, [])


	return (
		<ul>
			{files.map(file => FileListItem(file))}
		</ul>
	);
}

function FileListItem(file){
	const courseID = file.courseID;
	const classInstanceID = file.classInstanceID;
	const filename = file.filename;
	return (
		<li><a href={`http://localhost:5000/files/${classInstanceID}/${courseID}/${filename}`} target="_blank">{file.filename}</a></li>
	);
}

export default FileList;
