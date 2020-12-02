import React, {useEffect, useState} from 'react';

function FileList(props) {
	const courseId = props.courseId;


	const [files, setFiles] = useState([]);
	useEffect(() => {
		fetch(`http://localhost:5000/files/${courseId}`)
			.then(res => res.json())
			.then(res => {
				if (res.status === "OK")
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

function FileListItem(file) {
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

function StudentFileList(props) {
	const courseId = props.courseId;
	const studentId = props.studentId;

	const [files, setFiles] = useState([]);
	useEffect(() => {
		fetch(`http://localhost:5000/files/${courseId}/${studentId}`)
			.then(res => res.json())
			.then(res => {
				console.log(res);
				if (res.status === "OK")
					setFiles(res.result);
			});
	}, []);

	// TODO use this to pass throught the fileform so that we know where the
	// student should upload
	const [fileForm,  setFileForm] = useState(null);
	useEffect(() => {
		fetch(`http://localhost:5000/courses/${courseId}`)
			.then(res => res.json())
			.then(res => res.status === "OK" ? res.result : null)
			.then(course => {
				setFileForm(<FileForm studentId={studentId} courseId={courseId} classInstanceId={course.classInstanceID} />)
			});
	}, []);

	return (
		<div className="File-List">
			{fileForm}
			<ul>
				{files.map(file => StudentFile(file))}
			</ul>
		</div>
	);
}

function StudentFile(file) {
	const courseID = file.courseInstanceID;
	const classInstanceID = file.classInstanceID;
	const studentID = file.studentID;
	const filename = file.filename;
	return (
		<li id={file.id}>
			<a href={`http://localhost:5000/files/${classInstanceID}/${courseID}/${studentID}/${filename}`} target="_blank">{file.filename}</a>
			<i className="material-icons">download</i>
		</li>
	);
}

function FileForm(props) {
	const classInstanceId = props.classInstanceId;
	const studentId = props.studentId;
	const courseId = props.courseId;
	return (
        <form
            action={`http://localhost:5000/files/${classInstanceId}/${courseId}/${studentId}`}
            method="post"
            encType="multipart/form-data">

            <input name="file" type="file" />
            <input type="submit" />

        </form>
	)
}

export {FileList, StudentFileList};
