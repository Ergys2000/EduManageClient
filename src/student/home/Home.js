import React, { useEffect, useState } from "react";

function Home(props){
	const [student, setStudent] = useState(null);
	useEffect(() => {
		fetch(`http://localhost:5000/students/${props.id}`)
			.then(res => res.json())
			.then(res => res.status === "OK"? res.result : null)
			.then(student => setStudent(student));
	}, []);
	return (
		<div className="option">
			<h1>Welcome {(student) ? student.firstname : "..."}</h1>
			<p>adjfalkdsjflkdsajf</p>
		</div>
	);
}

export default Home;
