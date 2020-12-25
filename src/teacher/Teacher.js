import React, { useContext } from 'react';
import { Redirect, Route, Switch, useParams, useRouteMatch } from 'react-router-dom';
import NavBar from './NavBar';
import Schedule from './schedule/Schedule';
import Courses from './courses/CourseRoute';
import Class from './Class';
import Home from './home/Home';

export const TeacherContext = React.createContext(null);

function Teacher() {
	let { id } = useParams();
	let match = useRouteMatch();
	return (
		<TeacherContext.Provider value={id}>
			<div className="TeacherPage">
				<NavBar />
				<Switch>
					<Route exact path={`${match.path}/`}>
						<Redirect to={`${match.url}/home`} />
					</Route>
					<Route path={`${match.path}/home`}>
						<Home teacherId={id} />
					</Route>
					<Route path={`${match.path}/class`}>
						<Class />
					</Route>
					<Route path={`${match.path}/courses`}>
						<Courses />
					</Route>
					<Route path={`${match.path}/schedule`}>
						<Schedule />
					</Route>
				</Switch>
			</div>
		</TeacherContext.Provider>
	);

}

export default Teacher;
