import React, {useState, useEffect} from 'react';


function StudentFiles(props) {
	const courseId = props.courseId;

	const [students, setStudents] = useState([]);
	useEffect( () => {
		const fetchStudents = async () => {
			await fetch(`http://localhost:5000/courses/${courseId}/studentfiles`)
				.then(res => res.json())
				.then(res => res.status === "OK" ? res.result : [])
				.then(fileList => {
					setStudents(organizeStudents(fileList));
				});
		}
		fetchStudents();
	}, []);
	
	return (
		<div className="student-files">
			{students.map(student => <Student key={student.id} student={student} />)}
		</div>
	);
}

function Student({student}) {
	const firstname = student.firstname;
	const lastname = student.lastname;
	const files = student.files;
	return (
		<div className="student">
			<div className="head">
				<h2>{firstname + " " + lastname}</h2>
			</div>
			<div className="body">
				<ul>
					{files.map(file => <FileRow key={file.id} file={file} />)}
				</ul>
			</div>
		</div>
	);
}



function FileRow({file}) {
	const filename = file.filename;
	const studentId = file.studentID;
	const classInstanceId = file.classInstanceID;
	const courseId = file.courseInstanceID;
	return (
		<li id={file.id}>
			<a href={`http://localhost:5000/files/${classInstanceId}/${courseId}/${studentId}/${filename}`} target="_blank">{file.filename}</a>
			<i className="material-icons">download</i>
		</li>
	);
}

const organizeStudents = (studentFiles) => {
	const result = [];
	let lastStudentId = -1;
	let currStudent = -1;
	for(let i=0; i<studentFiles.length; i++) {
		const studentFile = studentFiles[i];

		if (studentFile.studentID != lastStudentId) {
			lastStudentId = studentFile.studentID;
			currStudent++;
			result[currStudent] = {
				id: studentFile.studentID,
				firstname: studentFile.firstname,
				lastname: studentFile.lastname,
				files: []
			}
		}

		result[currStudent].files.push(studentFile);
	}
	return result;
}

export default StudentFiles;
