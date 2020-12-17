import React from 'react';
import {Redirect, Route, Switch, useParams, useRouteMatch} from 'react-router-dom';
import NavBar from './NavBar';
import Schedule from './schedule/Schedule';
import Courses from './courses/CourseRoute';
import Class from './Class';

function Teacher(){
    let {id} = useParams();
    let match = useRouteMatch();
    return (
        <div className="TeacherPage">
            <NavBar />
            <Switch>
                <Route exact path={`${match.path}/`}>
                    <Redirect to={`${match.url}/home`} />
                </Route>
                <Route path={`${match.path}/home`}>
                    <Home teacherId={id}/>
                </Route>
                <Route path={`${match.path}/class`}>
                    <Class teacherId={id}/>
                </Route>
                <Route path={`${match.path}/courses`}>
                    <Courses teacherId={id}/>
                </Route>
                <Route path={`${match.path}/schedule`}>
                    <Schedule teacherId={id}/>
                </Route>
            </Switch>
        </div>
    );

}

function Home(props){
    return (
		<div className="option">
			<h1>Home</h1>
		</div>
    );
}

export default Teacher;
