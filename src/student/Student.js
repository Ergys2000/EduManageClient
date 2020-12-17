import React from 'react';
import {Route, Switch, useParams, useRouteMatch} from 'react-router-dom';
import NavBar from './NavBar';
import Home from './home/Home';
import Schedule from './schedule/Schedule';
import Course from './courses/Courses';

function Student() {
	const {id} = useParams();
	const {path} = useRouteMatch();


	return (
		<div className="StudentPage">
			<NavBar />
			<Switch>
				<Route path={`${path}/courses`}>
					<Course studentId={id} />
				</Route>

				<Route exact path={`${path}/`}>
					<Home studentId={id} />
				</Route>

				<Route exact path={`${path}/home`}>
					<Home studentId={id} />
				</Route>

				<Route exact path={`${path}/schedule`}>
					<Schedule studentId={id} />
				</Route>
			</Switch>
		</div>
	);

}


export default Student;
