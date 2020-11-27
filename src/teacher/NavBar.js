import React, { useState } from 'react';
import {Link, useRouteMatch} from 'react-router-dom';


export default function NavBar(){
    let match = useRouteMatch();
	const [onFocus, setFocus] = useState("home");

    return (
        <div className="sidenav">
            <Link to={`${match.url}/home`} 
				  onClick={() => setFocus("home")}
				  className={onFocus === "home" ?  "active" : ""}
			>
				<i className="material-icons">home</i>
				<p>Home</p>
			</Link>

            <Link to={`${match.url}/class`}
				  onClick={() => setFocus("class")}
				  className={onFocus === "class" ?  "active" : ""}
			>
				<i className="material-icons">face</i>
				<p>My class</p>
            </Link>
            <Link to={`${match.url}/courses`}
				  onClick={() => setFocus("courses")}
				  className={onFocus === "courses" ?  "active" : ""}
			>
				<i className="material-icons">description</i>
				<p>My Courses</p>
            </Link>
            <Link to={`${match.url}/schedule`}
				  onClick={() => setFocus("schedule")}
				  className={onFocus === "schedule" ?  "active" : ""}
			>
				<i className="material-icons">schedule</i>
				<p>Schedule</p>
            </Link>
        </div>
    );
}
