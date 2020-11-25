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
            <Link to={`${match.url}/class`}>
				<i className="material-icons">face</i>
				<p>My class</p>
            </Link>
            <Link to={`${match.url}/courses`}>
				<i className="material-icons">description</i>
				<p>My Courses</p>
            </Link>
            <Link to={`${match.url}/schedule`}>
				<i className="material-icons">schedule</i>
				<p>Schedule</p>
            </Link>
        </div>
    );
}
