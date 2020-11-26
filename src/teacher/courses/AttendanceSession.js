import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Session(props){
    const {sessionId, courseId} = useParams();
    const [students, setStudents] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:5000/courses/${courseId}/attendance/${sessionId}`)
            .then(res => res.json())
			.then(res => res.status === "OK"? res.result : [])
            .then(students => {
                setStudents(students);
            });
    }, []);

    return (
        <table className="Attendance-Session">
            <tr>
                <th>Firstname</th>
                <th>Lastname</th>
                <th>Attended</th>
                <th></th>
                <th></th>
            </tr>
            {students.map(student => <StudentRow student={student} />)}
        </table>
    );
}

function StudentRow(props){
    const {courseId, sessionId} = useParams();
    const [student, setStudent] = useState(props.student);

    async function incButton(){
        if(student.attended == student.total){
            alert("You cannot increase any more!");
            return;
        } 
        await fetch(`http://localhost:5000/courses/${courseId}/attendance/${sessionId}/${student.id}`, {

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

    async function decButton(){
        if(student.attended == 0){
            alert("You cannot decrease any more!");
            return;
        } 
        await fetch(`http://localhost:5000/courses/${courseId}/attendance/${sessionId}/${student.id}`, {

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
