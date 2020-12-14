import React, { useEffect, useState } from "react";
import apiLink from "../../API";

function Home(props){
	const [student, setStudent] = useState(null);
	useEffect(() => {
		const token = sessionStorage.getItem("jwt");
		const bearer = "Bearer " + token;
		fetch(`${apiLink}/students/${props.id}`,{
			headers: {
				'Authorization': bearer
			}
		})
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
