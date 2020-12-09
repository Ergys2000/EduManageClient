import React, { useEffect, useState } from "react";
import apiLink from "../../API";

function Home(props){
	const [student, setStudent] = useState(null);
	useEffect(() => {
		fetch(`${apiLink}/students/${props.id}`)
			.then(res => res.json())
			.then(res => res.status === "OK"? res.result : null)
			.then(student => setStudent(student));
	}, []);
	return (
		<div className="option">
			<h1>Welcome {(student) ? student.firstname : "..."}</h1>
		</div>
	);
}

export default Home;
