import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiLink from "../../API";

function Session(props){
	const teacherId = props.teacherId;
    const {sessionId, courseId} = useParams();
    const [students, setStudents] = useState([]);

    useEffect(() => {
		const fetchStudents = async () => {
			fetch(`${apiLink}/teachers/${teacherId}/courses/${courseId}/attendance/${sessionId}`)
				.then(res => res.json())
				.then(res => res.status === "OK"? res.result : [])
				.then(students => {
					setStudents(students);
				});
		}
		fetchStudents();
    }, []);

    return (
		<div className="session">
			<table>
				<thead>
					<tr>
						<th>Firstname</th>
						<th>Lastname</th>
						<th>Attended</th>
						<th></th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{students.map(student => <StudentRow key={student.id} student={student} teacherId={teacherId}/>)}
				</tbody>
			</table>
		</div>
	);
}

function StudentRow(props) {
	const teacherId = props.teacherId;
	const {courseId, sessionId} = useParams();
    const [student, setStudent] = useState(props.student);

    const incButton = async () => {
        if(student.attended == student.total){
            alert("You cannot increase any more!");
            return;
        } 
        await fetch(`${apiLink}/teachers/${teacherId}/courses/${courseId}/attendance/${sessionId}/${student.id}`, {

            method: "post",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({length: student.attended+1})

        })
        .then(res => res.json())
        .then(res => {
            if(res.status ==="OK") alert("Update successful");
            else alert("update failed: " + res.message);
            setStudent({...student, attended: student.attended+1});
        });
    }

    const decButton = async () => {
        if(student.attended == 0){
            alert("You cannot decrease any more!");
            return;
        } 
        await fetch(`${apiLink}/courses/${courseId}/attendance/${sessionId}/${student.id}`, {

            method: "post",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({length: student.attended-1})

        })
        .then(res => res.json())
        .then(res => {
            if(res.status ==="OK") alert("Update successful");
            else alert("update failed: " + res.message);
            setStudent({...student, attended: student.attended-1});
        });
    }

    return (
        <tr>
            <td>{student.firstname}</td>
            <td>{student.lastname}</td>
            <td>{student.attended + " / " + student.total}</td>
            <td>
                <button onClick={decButton}><i className="material-icons">remove</i></button>
            </td>
            <td>
                <button onClick={incButton}><i className="material-icons">add</i></button>
            </td>
        </tr>
    );
}

export default Session;
