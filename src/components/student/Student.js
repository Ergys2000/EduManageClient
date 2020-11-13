import React from 'react';
import {Route, Switch, useParams, useRouteMatch} from 'react-router-dom';
import NavBar from './NavBar';
import Home from './home/Home';
import Grades from './grades/Grades';
import './student.css';
import Schedule from './schedule/Schedule';
import Course from './courses/CourseRoute';

function Student(){
	const {id} = useParams();
	const {path, url} = useRouteMatch();


	return (
		<div className="StudentPage">
			<NavBar />
				<Switch>
					<Route path={`${path}/courses`}>
						<Course id={id}/>
					</Route>

					<Route path={`${path}/grades`}>
						<Grades id={id}/>
					</Route>

					<Route exact path={`${path}/`}>
						<Home id={id}/>
					</Route>

					<Route path={`${path}/home`}>
						<Home id={id}/>
					</Route>

					<Route path={`${path}/schedule`}>
						<Schedule id={id}/>
					</Route>
				</Switch>
		</div>
	);

}


export default Student;
