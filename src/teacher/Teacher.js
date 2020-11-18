import React from 'react';
import {Route, Switch, useParams, useRouteMatch} from 'react-router-dom';
import NavBar from './NavBar';
import Schedule from './schedule/Schedule';
import Courses from './Courses';
import './teacher.css';

function Teacher(){
    let {id} = useParams();
    let match = useRouteMatch();
    return (
        <div className="TeacherPage">
            <NavBar />
            <Switch>
                <Route path={`${match.url}/home`}>
                    <Home id={id}/>
                </Route>
                <Route path={`${match.url}/students`}>
                    <Students id={id}/>
                </Route>
                <Route path={`${match.url}/courses`}>
                    <Courses id={id}/>
                </Route>
                <Route path={`${match.url}/schedule`}>
                    <Schedule id={id}/>
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

function Students(props){
    return (
		<div className="option">
			<h1>Students</h1>
		</div>
    );
}

export default Teacher;
