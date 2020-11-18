import React from 'react';
import {Link, useRouteMatch} from 'react-router-dom';


export default function NavBar(){
    let match = useRouteMatch();

    return (
        <div className="sidenav">
            <Link to={`${match.url}/home`}>Home </Link>
            <Link to={`${match.url}/students`}>Students</Link>
            <Link to={`${match.url}/courses`}>My courses</Link>
            <Link to={`${match.url}/schedule`}>My schedule</Link>
        </div>
    );
}
