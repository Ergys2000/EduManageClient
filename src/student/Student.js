import React from 'react';
import { Route, Switch, useParams, useRouteMatch } from 'react-router-dom';
import NavBar from './NavBar';
import Home from './home/Home';
import Schedule from './schedule/Schedule';
import Courses from './courses/Courses';

export const StudentContext = React.createContext(null);

function Student() {
	const { id } = useParams();
	const { path } = useRouteMatch();

	return (
		<StudentContext.Provider value={id}>
			<div className="StudentPage">
				<NavBar />
				<Switch>
					<Route path={`${path}/courses`}>
						<Courses />
					</Route>

					<Route exact path={`${path}/`}>
						<Home />
					</Route>

					<Route exact path={`${path}/home`}>
						<Home />
					</Route>

					<Route exact path={`${path}/schedule`}>
						<Schedule />
					</Route>
				</Switch>
			</div>
		</StudentContext.Provider>
	);

}


export default Student;
