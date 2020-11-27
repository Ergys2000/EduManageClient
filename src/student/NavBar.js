import React, { useState } from 'react';
import {Link, useRouteMatch} from 'react-router-dom';

export default function NavBar(){
	const [onFocus, setFocus] = useState("home");
    let match = useRouteMatch();

    return (
        <div className="sidenav">
            <Link to={`${match.url}/home`} 
				  onClick={() => setFocus("home")}
				  className={onFocus === "home" ?  "active" : ""}
			>
				<i className="material-icons">home</i>
				<p>Home</p>
			</Link>

            <Link to={`${match.url}/schedule`}
				  onClick={() => setFocus("schedule")}
				  className={onFocus === "schedule" ?  "active" : ""}
			>
				<i className="material-icons">schedule</i>
				<p>Schedule</p>
			</Link>

            <Link to={`${match.url}/grades`}
				  onClick={() => setFocus("grades")}
				  className={onFocus === "grades" ?  "active" : ""}
			>
				<i className="material-icons">list</i>
				<p>Grades</p>
			</Link>
            <Link to={`${match.url}/courses`}
				  onClick={() => setFocus("courses")}
				  className={onFocus === "courses" ?  "active" : ""}
			>
				<i className="material-icons">description</i>
				<p>Courses</p>
			</Link>
        </div>
    );
}
