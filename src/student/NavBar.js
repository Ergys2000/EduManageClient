import React from 'react';
import {Link, useRouteMatch} from 'react-router-dom';


export default function NavBar(){
    let match = useRouteMatch();

    return (
        <div className="sidenav">
            <Link to={`${match.url}/home`}>
				<i className="material-icons">home</i>
				<p>Home</p>
			</Link>
            <Link to={`${match.url}/schedule`}>
				<i className="material-icons">schedule</i>
				<p>Schedule</p>
			</Link>
            <Link to={`${match.url}/grades`}>
				<i className="material-icons">list</i>
				<p>Grades</p>
			</Link>
            <Link to={`${match.url}/courses`}>
				<i className="material-icons">description</i>
				<p>Courses</p>
			</Link>
        </div>
    );
}
